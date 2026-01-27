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
    const authToken = process.env.TWILIO_AUTH_TOKEN;  // <-- AUTH_TOKEN is the secret!
    const appSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !apiKey || !apiSecret || !authToken || !appSid) {
      console.error('❌ Missing Twilio env vars:', { 
        accountSid: !!accountSid, 
        apiKey: !!apiKey, 
        apiSecret: !!apiSecret,
        authToken: !!authToken,
        appSid: !!appSid 
      });
      return res.status(500).json({ error: 'Missing Twilio configuration' });
    }

    const identity = String(req.query?.identity || 'user').replace(/[^a-zA-Z0-9_]/g, '_');
    const ttl = 3600;

    // Create JWT payload with Twilio Voice grants
    // Structure matches Twilio's expected format exactly
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

    // Sign JWT with the correct algorithm and options
    // IMPORTANT: For Access Tokens, use TWILIO_AUTH_TOKEN as the secret, NOT TWILIO_API_SECRET
    // issuer must be the API Key
    // subject must be the Account SID
    const token = jwt.sign(payload, authToken, {
      algorithm: 'HS256',
      issuer: apiKey,
      subject: accountSid,
      expiresIn: ttl
    });

    // Debug logging
    console.log(`✅ Token generated for identity: ${identity}`);
    console.log(`📋 JWT Payload:`, JSON.stringify(payload, null, 2));
    console.log(`🔐 Signing with:
      - Algorithm: HS256
      - Issuer (API Key): ${apiKey.substring(0, 8)}...
      - Subject (Account SID): ${accountSid.substring(0, 8)}...
      - Secret length: ${apiSecret.length} chars
    `);
    console.log(`📊 Token length: ${token.length} bytes`);

    return res.status(200).json({ 
      token, 
      identity, 
      expiresIn: ttl 
    });

  } catch (error: any) {
    console.error('❌ Token generation error:', {
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      error: error.message || 'Token generation failed'
    });
  }
}
