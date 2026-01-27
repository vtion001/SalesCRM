import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== TOKEN REQUEST START ===');
  console.log('Method:', req.method);
  console.log('Query:', req.query);
  
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

    console.log('Environment variables check:');
    console.log('- Account SID:', accountSid?.substring(0, 10) + '...');
    console.log('- API Key:', apiKey?.substring(0, 10) + '...');
    console.log('- API Secret length:', apiSecret?.length);
    console.log('- TwiML App SID:', twimlAppSid?.substring(0, 10) + '...');

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
    console.log('Identity:', identity);

    // Create token
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    console.log('Creating AccessToken with:');
    console.log('- Account SID:', accountSid);
    console.log('- API Key:', apiKey);
    console.log('- Identity:', identity);

    const tokenObj = new AccessToken(accountSid, apiKey, apiSecret, { 
      identity: identity,
      ttl: 3600
    });

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    });

    tokenObj.addGrant(voiceGrant);

    const token = tokenObj.toJwt();

    console.log('✅ Token generated successfully');
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 50) + '...');
    console.log('=== TOKEN REQUEST END ===');

    return res.status(200).json({ 
      token: token, 
      identity: identity,
      expiresIn: 3600
    });

  } catch (error: any) {
    console.error('❌ Token generation error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('=== TOKEN REQUEST END (ERROR) ===');
    
    return res.status(500).json({ 
      error: error.message || 'Token generation failed'
    });
  }
}
