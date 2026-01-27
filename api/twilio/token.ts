import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const appSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !apiKey || !apiSecret || !appSid) {
      console.error('Missing env vars:', { accountSid: !!accountSid, apiKey: !!apiKey, apiSecret: !!apiSecret, appSid: !!appSid });
      return res.status(500).json({ error: 'Missing Twilio configuration' });
    }

    const identity = String(req.query?.identity || 'user').replace(/[^a-zA-Z0-9_]/g, '_');
    const ttl = 3600;

    // Create JWT payload with Twilio Voice grants
    const payload = {
      grants: {
        identity: identity,
        voice: {
          outgoing: {
            application_sid: appSid
          },
          incoming: {
            allow: true
          }
        }
      }
    };

    // Sign the JWT using jsonwebtoken library (proper implementation)
    const token = jwt.sign(payload, apiSecret, {
      algorithm: 'HS256',
      issuer: apiKey,
      subject: accountSid,
      expiresIn: ttl,
      jwtid: `${apiKey}-${Date.now()}`
    });

    console.log(`✅ Token generated for identity: ${identity}`);

    return res.status(200).json({ 
      token, 
      identity, 
      expiresIn: ttl 
    });

  } catch (error: any) {
    console.error('❌ Token error:', error);
    return res.status(500).json({ 
      error: error.message || 'Token generation failed',
      details: 'Failed to generate Twilio access token'
    });
  }
}
