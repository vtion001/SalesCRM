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

    console.log('Using Auth Token method');
    console.log('Account SID:', accountSid?.substring(0, 10) + '...');
    console.log('Auth Token exists:', !!authToken);
    console.log('TwiML App SID:', twimlAppSid?.substring(0, 10) + '...');

    if (!accountSid || !authToken || !twimlAppSid) {
      return res.status(500).json({ error: 'Missing Twilio configuration' });
    }

    const identity = String(req.query?.identity || 'user').replace(/[^a-zA-Z0-9_]/g, '_');

    // Use regular import
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Use Account SID and Auth Token (not API Key)
    const token = new AccessToken(
      accountSid,
      accountSid,  // Use Account SID as the signing key SID
      authToken,   // Use Auth Token as the secret
      { identity, ttl: 3600 }
    );

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    const jwt = token.toJwt();
    console.log('✅ Token generated with Auth Token method');

    return res.status(200).json({ 
      token: jwt, 
      identity,
      expiresIn: 3600
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message, error.stack);
    return res.status(500).json({ error: error.message });
  }
}
