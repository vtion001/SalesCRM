import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

    console.log('=== TOKEN GENERATION DEBUG ===');
    console.log('Using Auth Token method (no API Key)');
    console.log('Account SID:', accountSid ? `${accountSid.substring(0, 6)}...` : 'MISSING');
    console.log('Auth Token:', authToken ? `Length: ${authToken.length}` : 'MISSING');
    console.log('TwiML App SID:', twimlAppSid ? `${twimlAppSid.substring(0, 6)}...` : 'MISSING');

    if (!accountSid || !authToken || !twimlAppSid) {
      console.error('❌ Missing Twilio configuration');
      return res.status(500).json({ error: 'Missing Twilio configuration' });
    }

    // Identity handling: Ensure string and fallback
    let identity = req.query?.identity || req.body?.identity;
    
    // Explicitly check for valid identity
    if (!identity || identity === 'undefined' || identity === 'null') {
      identity = 'user_' + Math.random().toString(36).substring(7);
      console.warn('⚠️ No identity provided, using random fallback:', identity);
    }
    
    identity = String(identity).replace(/[^a-zA-Z0-9_]/g, '_');
    console.log('Final Identity:', identity);

    // Explicitly check for imported module
    if (!twilio || !twilio.jwt || !twilio.jwt.AccessToken) {
      console.error('❌ Twilio library not loaded correctly', twilio);
      throw new Error('Twilio library import failed');
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Create token using Account SID as the signing key (valid strategy)
    const token = new AccessToken(
      accountSid,
      accountSid,  // Signing Key SID (using Account SID)
      authToken,   // Signing Key Secret (using Auth Token)
      { identity, ttl: 3600 }
    );

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
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
