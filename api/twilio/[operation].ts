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
    const identity = req.body.identity || `user_${Date.now()}`;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY!,
      process.env.TWILIO_API_SECRET!,
      { identity }
    );

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID!,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    res.status(200).json({
      identity,
      token: token.toJwt(),
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
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
