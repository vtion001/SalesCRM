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
    const apiKeySid = process.env.TWILIO_API_KEY_SID?.trim();
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET?.trim();

    console.log('=== TOKEN GENERATION DEBUG ===');
    console.log('Account SID:', accountSid ? `${accountSid.substring(0, 6)}...` : 'MISSING');
    console.log('TwiML App SID:', twimlAppSid ? `${twimlAppSid.substring(0, 6)}...` : 'MISSING');
    
    if (apiKeySid && apiKeySecret) {
       console.log('Using Standard API Key method (Recommended)');
       console.log('API Key SID:', `${apiKeySid.substring(0, 6)}...`);
    } else {
       console.log('Using Legacy Auth Token method (Account SID as Key SID) - NOT RECOMMENDED');
       console.log('Auth Token:', authToken ? `Length: ${authToken.length}` : 'MISSING');
    }

    if (!accountSid || !twimlAppSid) {
      console.error('❌ Missing required Twilio configuration: Account SID or TwiML App SID');
      return res.status(500).json({ error: 'Missing required Twilio configuration' });
    }

    if (!apiKeySid || !apiKeySecret) {
      if (!authToken) {
        console.error('❌ Missing API Key credentials or Auth Token');
        return res.status(500).json({ error: 'Missing API Key credentials or Auth Token' });
      }
      console.warn('⚠️  Using legacy Auth Token method - consider switching to API Keys for better reliability');
    }

    // Identity handling with validation
    let identity = req.query?.identity || req.body?.identity;
    if (!identity || identity === 'undefined' || identity === 'null') {
      identity = 'user_' + Math.random().toString(36).substring(7);
    }
    
    // Clean and validate identity (Twilio requires alphanumeric + underscore only)
    identity = String(identity).replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Ensure identity isn't too long (Twilio has limits)
    if (identity.length > 50) {
      identity = identity.substring(0, 47) + '...';
    }
    
    console.log('Identity:', identity);
    console.log('Identity length:', identity.length);

    // Import AccessToken from twilio
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // 2. Create the token
    let token;
    
    if (apiKeySid && apiKeySecret) {
      // Standard method: Use API Key SID and Secret
      token = new AccessToken(
        accountSid,
        apiKeySid,
        apiKeySecret,
        { identity, ttl: 3600 }
      );
    } else {
      // Legacy method: Use Account SID as Key SID and Auth Token as Secret
      // This often causes error 20101 on newer accounts
      token = new AccessToken(
        accountSid,                   // 1. Account SID
        accountSid,                   // 2. Key SID (Account SID is used here)
        authToken,                    // 3. Key Secret (Auth Token is used here)
        { identity, ttl: 3600 }       // Options
      );
    }

    // 3. CRITICAL: Add the Voice Grant
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true, // Allow incoming calls
    });

    token.addGrant(voiceGrant);

    const jwt = token.toJwt();
    console.log('✅ Token generated successfully');
    console.log('Token length:', jwt.length);
    console.log('Token method:', apiKeySid ? 'API Key' : 'Legacy Auth Token');

    return res.status(200).json({ 
      token: jwt, 
      identity,
      expiresIn: 3600,
      method: apiKeySid ? 'API Key' : 'Legacy'
    });

  } catch (error: any) {
    console.error('❌ Token Generation Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate token',
      details: error.toString()
    });
  }
}