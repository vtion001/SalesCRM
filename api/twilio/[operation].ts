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
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const apiKey = process.env.TWILIO_API_KEY?.trim();
    const apiSecret = process.env.TWILIO_API_SECRET?.trim();
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID?.trim();

    if (!accountSid || !twimlAppSid) {
      console.error('❌ Missing Twilio credentials:', {
        accountSid: !!accountSid,
        twimlAppSid: !!twimlAppSid,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret
      });
      return res.status(500).json({ error: 'Twilio credentials not configured' });
    }

    const identity = (req.body.identity || `user_${Date.now()}`).replace(/[^a-zA-Z0-9_]/g, '_');

    console.log('🔐 Generating token for identity:', identity);

    // AccessToken requires API Key/Secret for signing
    // These MUST be set for token generation to work
    if (!apiKey || !apiSecret) {
      console.error('❌ TWILIO_API_KEY and TWILIO_API_SECRET are required for token generation');
      console.error('   API Key available:', !!apiKey);
      console.error('   API Secret available:', !!apiSecret);
      return res.status(500).json({ 
        error: 'Twilio API Key and Secret are required. Please configure TWILIO_API_KEY and TWILIO_API_SECRET environment variables in Vercel.',
        debug: {
          accountSid: !!accountSid,
          apiKey: !!apiKey,
          apiSecret: !!apiSecret,
          twimlAppSid: !!twimlAppSid
        }
      });
    }

    console.log('🔐 Generating token for identity:', identity);

    // Create AccessToken with API Key/Secret
    const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
    console.log('✅ Using API Key/Secret method');

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    const jwt = token.toJwt();
    console.log('✅ Token generated successfully');

    res.status(200).json({
      identity,
      token: jwt,
      expiresIn: 3600
    });
  } catch (error: any) {
    console.error('❌ Error generating token:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate token' });
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
