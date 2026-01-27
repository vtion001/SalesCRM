import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1. TRIM values to remove hidden whitespace (common cause of 20101)
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID?.trim();

    console.log('=== TOKEN GENERATION DEBUG ===');
    console.log('Using Auth Token method (Account SID as Key SID)');
    console.log('Account SID:', accountSid ? `${accountSid.substring(0, 6)}...` : 'MISSING');
    console.log('Auth Token:', authToken ? `Length: ${authToken.length}` : 'MISSING');
    console.log('TwiML App SID:', twimlAppSid ? `${twimlAppSid.substring(0, 6)}...` : 'MISSING');

    if (!accountSid || !authToken || !twimlAppSid) {
      console.error('❌ Missing Twilio configuration');
      return res.status(500).json({ error: 'Missing Twilio configuration' });
    }

    // Identity handling
    let identity = req.query?.identity || req.body?.identity;
    if (!identity || identity === 'undefined' || identity === 'null') {
      identity = 'user_' + Math.random().toString(36).substring(7);
    }
    identity = String(identity).replace(/[^a-zA-Z0-9_]/g, '_');
    console.log('Identity:', identity);

    // Import AccessToken from twilio
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // 2. Create the token using AUTH TOKEN
    // Note: We pass 'accountSid' as the 2nd argument (KeySid) as well.
    const token = new AccessToken(
      accountSid,                   // 1. Account SID
      accountSid,                   // 2. Key SID (Account SID is used here)
      authToken,                    // 3. Key Secret (Auth Token is used here)
      { identity, ttl: 3600 }       // Options
    );

    // 3. CRITICAL: Add the Voice Grant
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true, // Allow incoming calls
    });

    token.addGrant(voiceGrant);

    const jwt = token.toJwt();
    console.log('✅ Token generated successfully');
    console.log('Token length:', jwt.length);

    return res.status(200).json({ 
      token: jwt, 
      identity,
      expiresIn: 3600
    });

  } catch (error: any) {
    console.error('❌ Token Generation Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate token',
      details: error.toString()
    });
  }
}