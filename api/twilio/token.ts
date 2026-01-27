import { VercelRequest, VercelResponse } from '@vercel/node';
import { AccessToken, jwt } from 'twilio';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_TWIML_APP_SID
} = process.env;

/**
 * Generate Twilio Access Token for Voice
 * GET /api/twilio/token?identity=user123
 * 
 * Returns: { token: "eyJhbGc..." }
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get identity from query params or body
    const identity = (req.query.identity as string) || 
                     (req.body?.identity as string) || 
                     'sales-user';

    // Validate environment variables
    if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET) {
      console.error('❌ Missing Twilio credentials in environment');
      return res.status(500).json({ 
        error: 'Server configuration error: Missing Twilio credentials',
        debug: 'TWILIO_ACCOUNT_SID, TWILIO_API_KEY, or TWILIO_API_SECRET not set'
      });
    }

    // Sanitize identity: only alphanumeric and underscore
    const sanitizedIdentity = String(identity)
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .substring(0, 256);

    if (!sanitizedIdentity) {
      return res.status(400).json({ 
        error: 'Invalid identity - must contain at least one alphanumeric character'
      });
    }

    console.log(`🔐 Generating token for identity: ${sanitizedIdentity}`);

    // Create access token with Voice grant
    const token = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      { identity: sanitizedIdentity, ttl: 3600 }
    );

    // Add Voice grant for outgoing calls
    const voiceGrant = new (jwt as any).VoiceGrant({
      outgoingApplicationSid: TWILIO_TWIML_APP_SID,
      incomingAllow: true
    });

    token.addGrant(voiceGrant);

    const tokenString = token.toJwt();

    console.log(`✅ Token generated successfully for ${sanitizedIdentity}`);
    console.log(`   Token length: ${tokenString.length} bytes`);

    return res.status(200).json({ 
      token: tokenString,
      identity: sanitizedIdentity,
      expiresIn: 3600
    });

  } catch (error: any) {
    console.error('❌ Error generating Twilio token:', {
      message: error?.message,
      stack: error?.stack
    });

    return res.status(500).json({ 
      error: error?.message || 'Failed to generate access token',
      debug: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}
