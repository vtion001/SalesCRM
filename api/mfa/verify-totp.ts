import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { authenticator } from 'otplib';
import crypto from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Generate 10 recovery codes
function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    // Format as XXXX-XXXX for readability
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}

// Hash recovery code for storage
function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Verify user token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get pending secret from user metadata
    const pendingSecret = user.user_metadata?.mfa_totp_secret_pending;
    if (!pendingSecret) {
      return res.status(400).json({ error: 'No pending MFA enrollment found' });
    }

    // Verify the TOTP code
    const isValid = authenticator.verify({
      token: code,
      secret: pendingSecret
    });

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Generate recovery codes
    const recoveryCodes = generateRecoveryCodes();
    const hashedCodes = recoveryCodes.map(hashRecoveryCode);

    // Store recovery codes in database
    const { error: codesError } = await supabase
      .from('mfa_recovery_codes')
      .insert(
        hashedCodes.map(hash => ({
          user_id: user.id,
          code_hash: hash,
          used: false
        }))
      );

    if (codesError) {
      console.error('Failed to store recovery codes:', codesError);
      // Continue anyway - codes can be regenerated
    }

    // Update user metadata - move secret from pending to active
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

  } catch (error: any) {
    console.error('MFA verification error:', error);
    return res.status(500).json({ error: error.message || 'Failed to verify MFA' });
  }
}
