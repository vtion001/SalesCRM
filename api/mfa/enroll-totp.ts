import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.substring(7);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Generate TOTP secret
    const secret = authenticator.generateSecret();
    
    // Create OTP auth URL for QR code
    const userEmail = user.email || 'user@salescrm.com';
    const otpauthUrl = authenticator.keyuri(userEmail, 'SalesCRM', secret);
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    // Store secret in user metadata (temporary until verified)
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

  } catch (error: any) {
    console.error('MFA enrollment error:', error);
    return res.status(500).json({ error: error.message || 'Failed to enroll MFA' });
  }
}
