import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Forward incoming calls to a specific phone number
 * POST /api/twiml/forward-call
 * 
 * Use this endpoint to forward all incoming calls to your Twilio number
 * to another phone number (e.g., your personal mobile).
 * 
 * Configuration:
 * 1. Set FORWARD_TO_NUMBER environment variable in Vercel
 * 2. In Twilio Console, set this as your phone number's voice webhook
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get forwarding number from environment
  const forwardTo = process.env.FORWARD_TO_NUMBER?.trim();
  const from = req.body?.From || 'Unknown';
  const fromCity = req.body?.FromCity || '';

  console.log('📞 Forwarding incoming call:');
  console.log('   From:', from, fromCity);
  console.log('   To:', forwardTo);

  if (!forwardTo) {
    // No forwarding number configured - provide a default message
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Sorry, call forwarding is not configured. Please try again later.</Say>
</Response>`;
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml);
  }

  // Forward the call
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Please wait while we connect your call${fromCity ? ' from ' + fromCity : ''}.</Say>
  <Dial timeout="30" callerId="${req.body?.To || ''}">
    <Number>${forwardTo}</Number>
  </Dial>
  <Say voice="alice">Sorry, the call could not be connected. Goodbye.</Say>
</Response>`;

  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(twiml);
}
