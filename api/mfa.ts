import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import crypto from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Helper functions
function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}

function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

// Main handler with routing
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  try {
    switch (action) {
      case 'enroll':
        return await handleEnrollTotp(req, res);
      case 'verify':
        return await handleVerifyTotp(req, res);
      case 'challenge':
        return await handleChallenge(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action. Use: enroll, verify, or challenge' });
    }
  } catch (error: any) {
    console.error('MFA handler error:', error);
    return res.status(500).json({ error: error.message || 'MFA operation failed' });
  }
}

// Enroll TOTP - Generate QR code
async function handleEnrollTotp(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.substring(7);
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const secret = authenticator.generateSecret();
  const userEmail = user.email || 'user@salescrm.com';
  const otpauthUrl = authenticator.keyuri(userEmail, 'SalesCRM', secret);
  const qrCode = await QRCode.toDataURL(otpauthUrl);

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      user_metadata: {
        ...user.user_metadata,
        mfa_totp_secret_pending: secret,
        mfa_totp_enrolled: false
      }
    }
  );

  if (updateError) {
    return res.status(500).json({ error: 'Failed to store MFA secret' });
  }

  return res.status(200).json({
    secret,
    qrCode,
    otpauthUrl,
    message: 'Scan QR code with your authenticator app and verify to complete setup'
  });
}

// Verify TOTP - Complete enrollment
async function handleVerifyTotp(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Verification code required' });
  }

  const token = authHeader.substring(7);
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const pendingSecret = user.user_metadata?.mfa_totp_secret_pending;
  if (!pendingSecret) {
    return res.status(400).json({ error: 'No pending MFA enrollment found' });
  }

  const isValid = authenticator.verify({
    token: code,
    secret: pendingSecret
  });

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  const recoveryCodes = generateRecoveryCodes();
  const hashedCodes = recoveryCodes.map(hashRecoveryCode);

  await supabase
    .from('mfa_recovery_codes')
    .insert(
      hashedCodes.map(hash => ({
        user_id: user.id,
        code_hash: hash,
        used: false
      }))
    );

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      user_metadata: {
        ...user.user_metadata,
        mfa_totp_secret: pendingSecret,
        mfa_totp_secret_pending: null,
        mfa_totp_enrolled: true,
        mfa_enabled: true,
        mfa_method: 'totp'
      }
    }
  );

  if (updateError) {
    return res.status(500).json({ error: 'Failed to activate MFA' });
  }

  return res.status(200).json({
    success: true,
    recoveryCodes,
    message: 'MFA successfully enabled! Save your recovery codes in a safe place.'
  });
}

// Challenge - Login with MFA
async function handleChallenge(req: VercelRequest, res: VercelResponse) {
  const { email, password, mfaCode, useRecoveryCode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError || !signInData.user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = signInData.user;
  const mfaEnabled = user.user_metadata?.mfa_enabled;

  if (!mfaEnabled) {
    return res.status(200).json({
      success: true,
      requiresMFA: false,
      session: signInData.session,
      user
    });
  }

  if (!mfaCode) {
    await supabase.auth.signOut();
    return res.status(200).json({
      success: false,
      requiresMFA: true,
      message: 'MFA verification required'
    });
  }

  if (useRecoveryCode) {
    const codeHash = hashRecoveryCode(mfaCode);
    
    const { data: recoveryCode, error: codeError } = await supabase
      .from('mfa_recovery_codes')
      .select('*')
      .eq('user_id', user.id)
      .eq('code_hash', codeHash)
      .eq('used', false)
      .single();

    if (codeError || !recoveryCode) {
      await supabase.auth.signOut();
      return res.status(401).json({ error: 'Invalid recovery code' });
    }

    await supabase
      .from('mfa_recovery_codes')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', recoveryCode.id);

  } else {
    const totpSecret = user.user_metadata?.mfa_totp_secret;
    if (!totpSecret) {
      await supabase.auth.signOut();
      return res.status(401).json({ error: 'MFA not properly configured' });
    }

    const isValid = authenticator.verify({
      token: mfaCode,
      secret: totpSecret
    });

    if (!isValid) {
      await supabase.auth.signOut();
      return res.status(401).json({ error: 'Invalid MFA code' });
    }
  }

  return res.status(200).json({
    success: true,
    requiresMFA: false,
    session: signInData.session,
    user
  });
}
