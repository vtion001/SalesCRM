import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { authenticator } from 'otplib';
import crypto from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Hash recovery code for comparison
function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, mfaCode, useRecoveryCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, authenticate with email/password
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError || !signInData.user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = signInData.user;

    // Check if MFA is enabled
    const mfaEnabled = user.user_metadata?.mfa_enabled;
    if (!mfaEnabled) {
      // MFA not enabled, return success
      return res.status(200).json({
        success: true,
        requiresMFA: false,
        session: signInData.session,
        user
      });
    }

    // MFA is enabled - require verification
    if (!mfaCode) {
      // Sign out the session since MFA not verified
      await supabase.auth.signOut();
      return res.status(200).json({
        success: false,
        requiresMFA: true,
        message: 'MFA verification required'
      });
    }

    // Verify MFA code
    if (useRecoveryCode) {
      // Verify recovery code
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

      // Mark recovery code as used
      await supabase
        .from('mfa_recovery_codes')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('id', recoveryCode.id);

    } else {
      // Verify TOTP code
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

    // MFA verified successfully
    return res.status(200).json({
      success: true,
      requiresMFA: false,
      session: signInData.session,
      user
    });

  } catch (error: any) {
    console.error('MFA challenge error:', error);
    return res.status(500).json({ error: error.message || 'Failed to verify MFA' });
  }
}
