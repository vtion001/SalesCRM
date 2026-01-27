/**
 * Generate Twilio Access Token for Voice
 * This version creates JWT tokens manually without requiring the twilio package
 * GET /api/twilio/token?identity=user123
 */

const crypto = require('crypto');

// Helper function to base64url encode
function base64url(str) {
  return Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Helper function to sign JWT
function signJWT(header, payload, secret) {
  const message = base64url(JSON.stringify(header)) + '.' + base64url(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return message + '.' + signature;
}

module.exports = async (req, res) => {
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
    // Get environment variables
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
    const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET;
    const TWILIO_TWIML_APP_SID = process.env.TWILIO_TWIML_APP_SID;

    // Get identity from query params or body
    const identity = (req.query?.identity) || (req.body?.identity) || 'sales-user';

    // Validate environment variables
    const missingVars = [];
    if (!TWILIO_ACCOUNT_SID) missingVars.push('TWILIO_ACCOUNT_SID');
    if (!TWILIO_API_KEY) missingVars.push('TWILIO_API_KEY');
    if (!TWILIO_API_SECRET) missingVars.push('TWILIO_API_SECRET');
    if (!TWILIO_TWIML_APP_SID) missingVars.push('TWILIO_TWIML_APP_SID');

    if (missingVars.length > 0) {
      console.error('❌ Missing Twilio credentials:', missingVars);
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: `Missing environment variables: ${missingVars.join(', ')}`,
        hint: 'Set these in Vercel project Settings → Environment Variables'
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

    // Create JWT header
    const header = {
      alg: 'HS256',
      typ: 'JWT',
      cty: 'twilio-fpa;v=1'
    };

    // Get current timestamp
    const now = Math.floor(Date.now() / 1000);
    const ttl = 3600; // 1 hour

    // Create JWT payload with Voice grant
    const payload = {
      jti: TWILIO_API_KEY + '-' + now,
      grants: {
        identity: sanitizedIdentity,
        voice: {
          incoming: {
            allow: true
          },
          outgoing: {
            application_sid: TWILIO_TWIML_APP_SID
          }
        }
      },
      iat: now,
      exp: now + ttl,
      iss: TWILIO_API_KEY,
      sub: TWILIO_ACCOUNT_SID
    };

    // Sign the JWT
    const tokenString = signJWT(header, payload, TWILIO_API_SECRET);

    console.log(`✅ Token generated successfully for ${sanitizedIdentity}`);
    console.log(`   Token length: ${tokenString.length} bytes`);

    return res.status(200).json({ 
      token: tokenString,
      identity: sanitizedIdentity,
      expiresIn: ttl
    });

  } catch (error) {
    console.error('❌ Error generating Twilio token:', {
      message: error?.message,
      stack: error?.stack
    });

    return res.status(500).json({ 
      error: error?.message || 'Failed to generate access token'
    });
  }
};
