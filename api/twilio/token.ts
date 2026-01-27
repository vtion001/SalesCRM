import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

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
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
      console.error('Missing env vars:', { accountSid: !!accountSid, apiKey: !!apiKey, apiSecret: !!apiSecret, twimlAppSid: !!twimlAppSid });
      return res.status(500).json({ error: 'Missing Twilio configuration' });
    }

    const identity = String(req.query?.identity || 'user').replace(/[^a-zA-Z0-9_]/g, '_');

    // Use Twilio SDK AccessToken class - this is the ONLY correct way
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Create token with API Key method (keySid=apiKey, secret=apiSecret)
    const token = new AccessToken(accountSid, apiKey, apiSecret, { 
      identity: identity,
      ttl: 3600
    });

    // Add voice grant for outgoing and incoming calls
    token.addGrant(new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    }));

    // Convert to JWT string - this handles all Twilio-specific requirements
    const jwt = token.toJwt();

    return res.status(200).json({ 
      token: jwt, 
      identity: identity,
      expiresIn: 3600
    });

  } catch (error: any) {
    console.error('Token generation error:', error.message, error.stack);
    return res.status(500).json({ 
      error: error.message || 'Token generation failed'
    });
  }
}
