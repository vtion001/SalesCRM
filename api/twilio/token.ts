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
      console.error('❌ Missing Twilio env vars:', { 
        accountSid: !!accountSid, 
        apiKey: !!apiKey, 
        apiSecret: !!apiSecret, 
        twimlAppSid: !!twimlAppSid 
      });
      return res.status(500).json({ error: 'Missing Twilio configuration' });
    }

    const identity = String(req.query?.identity || 'user').replace(/[^a-zA-Z0-9_]/g, '_');

    // Use Twilio SDK to generate access token
    // This ensures the token format is exactly what Twilio Client SDK expects
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    console.log(`🔧 Creating token for identity: ${identity}`);
    console.log(`📋 Using Account SID: ${accountSid.substring(0, 10)}...`);
    console.log(`🔑 Using API Key: ${apiKey.substring(0, 10)}...`);
    console.log(`📱 Using TwiML App SID: ${twimlAppSid.substring(0, 10)}...`);

    // Create the access token
    const token = new AccessToken(accountSid, apiKey, apiSecret, { 
      identity: identity,
      ttl: 3600 // 1 hour
    });

    // Add voice grant for outgoing and incoming calls
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    });

    token.addGrant(voiceGrant);

    // Convert to JWT string
    const jwt = token.toJwt();

    console.log(`✅ Access token generated successfully`);
    console.log(`📊 Token length: ${jwt.length} bytes`);
    console.log(`⏰ Token expires in: 3600 seconds (1 hour)`);

    return res.status(200).json({ 
      token: jwt, 
      identity: identity,
      expiresIn: 3600
    });

  } catch (error: any) {
    console.error('❌ Token generation error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return res.status(500).json({ 
      error: error.message || 'Token generation failed'
    });
  }
}
