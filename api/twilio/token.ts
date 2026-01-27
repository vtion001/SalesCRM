import { VercelRequest, VercelResponse } from '@vercel/node';
import { AccessToken, jwt } from 'twilio';

/**
 * Generate Twilio Access Token for Voice
 * GET /api/twilio/token?identity=user123
 * 
 * Returns: { token: "eyJhbGc..." }
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get environment variables at request time (not at module load time)
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
    const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET;
    const TWILIO_TWIML_APP_SID = process.env.TWILIO_TWIML_APP_SID;

    // Get identity from query params or body
    const identity = (req.query.identity as string) || 
                     (req.body?.identity as string) || 
                     'sales-user';

    // Validate environment variables with detailed error message
    const missingVars = [];
    if (!TWILIO_ACCOUNT_SID) missingVars.push('TWILIO_ACCOUNT_SID');
    if (!TWILIO_API_KEY) missingVars.push('TWILIO_API_KEY');
    if (!TWILIO_API_SECRET) missingVars.push('TWILIO_API_SECRET');
    if (!TWILIO_TWIML_APP_SID) missingVars.push('TWILIO_TWIML_APP_SID');

    if (missingVars.length > 0) {
      console.error('❌ Missing Twilio credentials:', missingVars);
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('TWILIO')));
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: `Missing environment variables: ${missingVars.join(', ')}`,
        hint: 'Set these in Vercel project Settings → Environment Variables',
        debug: {
          missing: missingVars,
          available: Object.keys(process.env).filter(k => k.includes('TWILIO') || k.includes('SUPABASE'))
        }
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
