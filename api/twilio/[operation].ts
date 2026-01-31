// Consolidated Twilio API router
import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { operation } = req.query;
  const op = Array.isArray(operation) ? operation[0] : operation;

  try {
    switch (op) {
      case 'token':
        return handleToken(req, res);
      case 'list-calls':
        return handleListCalls(req, res);
      default:
        return res.status(404).json({ error: `Unknown operation: ${op}` });
    }
  } catch (error) {
    console.error('❌ Twilio API error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

// Handler: Generate Twilio Token
async function handleToken(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log all environment variables for debugging
    console.log('🔧 Twilio Env Vars Check:');
    console.log('   TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? `${process.env.TWILIO_ACCOUNT_SID.substring(0, 5)}...` : 'NOT SET');
    console.log('   TWILIO_API_KEY:', process.env.TWILIO_API_KEY ? `${process.env.TWILIO_API_KEY.substring(0, 5)}...` : 'NOT SET');
    console.log('   TWILIO_API_SECRET:', process.env.TWILIO_API_SECRET ? `${process.env.TWILIO_API_SECRET.substring(0, 5)}...` : 'NOT SET');
    console.log('   TWILIO_TWIML_APP_SID:', process.env.TWILIO_TWIML_APP_SID ? `${process.env.TWILIO_TWIML_APP_SID.substring(0, 5)}...` : 'NOT SET');
    console.log('   TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? `${process.env.TWILIO_AUTH_TOKEN.substring(0, 5)}...` : 'NOT SET');

    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const apiKey = process.env.TWILIO_API_KEY?.trim();
    const apiSecret = process.env.TWILIO_API_SECRET?.trim();
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID?.trim();

    // Validate required credentials
    if (!accountSid) {
      console.error('❌ TWILIO_ACCOUNT_SID is not set in environment variables');
      return res.status(500).json({ 
        error: 'TWILIO_ACCOUNT_SID not configured. Please add it to Vercel environment variables.',
        missingVars: { accountSid: true }
      });
    }

    if (!twimlAppSid) {
      console.error('❌ TWILIO_TWIML_APP_SID is not set in environment variables');
      return res.status(500).json({ 
        error: 'TWILIO_TWIML_APP_SID not configured. Please add it to Vercel environment variables.',
        missingVars: { twimlAppSid: true }
      });
    }

    // API Key/Secret are REQUIRED for valid JWT signing
    if (!apiKey || !apiSecret) {
      console.error('❌ TWILIO_API_KEY and TWILIO_API_SECRET are REQUIRED for token generation');
      console.error('   API Key set:', !!apiKey);
      console.error('   API Secret set:', !!apiSecret);
      console.error('   NOTE: Auth Token cannot be used to sign JWT tokens');
      
      return res.status(500).json({ 
        error: 'TWILIO_API_KEY and TWILIO_API_SECRET are required. Please configure them in Vercel environment variables. Auth Token cannot be used to sign JWT tokens.',
        debug: {
          accountSid: !!accountSid,
          apiKey: !!apiKey,
          apiSecret: !!apiSecret,
          twimlAppSid: !!twimlAppSid,
          authToken: !!process.env.TWILIO_AUTH_TOKEN,
          message: 'Get API Key from: https://www.twilio.com/console/keys-credentials'
        }
      });
    }

    const identity = (req.body.identity || `user_${Date.now()}`).replace(/[^a-zA-Z0-9_]/g, '_');
    console.log('🔐 Generating token for identity:', identity);

    // Create token with API Key/Secret (required for valid signing)
    const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    const jwt = token.toJwt();
    console.log('✅ Token generated successfully with API Key/Secret method');
    console.log('   Token format: valid JWT (', jwt.split('.').length, 'parts)');

    res.status(200).json({
      identity,
      token: jwt,
      expiresIn: 3600,
      method: 'API Key/Secret'
    });
  } catch (error: any) {
    console.error('❌ Error generating token:', error.message);
    console.error('   Full error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate token',
      errorDetails: error.toString()
    });
  }
}

// Handler: List Calls
async function handleListCalls(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = '50', status, from, to } = req.query;

    const options: any = {
      limit: parseInt(limit as string),
    };

    if (status) options.status = status;
    if (from) options.from = from;
    if (to) options.to = to;

    const calls = await twilioClient.calls.list(options);

    res.status(200).json({
      success: true,
      calls: calls.map(call => ({
        sid: call.sid,
        from: call.from,
        to: call.to,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime,
        price: call.price,
        priceUnit: call.priceUnit,
      })),
    });
  } catch (error) {
    console.error('Error listing calls:', error);
    res.status(500).json({ error: 'Failed to list calls' });
  }
}
