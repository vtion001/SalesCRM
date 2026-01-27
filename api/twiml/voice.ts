import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Handle incoming and outgoing calls with TwiML
 * POST /api/twiml/voice
 * 
 * This handler is simplified to resolve Twilio Error 31005 by ensuring
 * the correct Content-Type: text/xml is returned.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Get the phone number the user dialed (sent by Twilio as 'To')
  // For robustness, check both body (POST) and query (GET)
  const toNumber = req.body?.To || req.body?.to || req.query?.to;

  console.log("TwiML received request to dial:", toNumber);

  // 2. Create the TwiML (The XML instructions for Twilio)
  // We tell Twilio to <Dial> the number.
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${toNumber ? `<Dial>${toNumber}</Dial>` : '<Say>No destination number provided.</Say>'}
</Response>`;

  // 3. CRITICAL: You MUST return Content-Type: text/xml
  // If you don't set this, you may get Error 31005.
  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(twiml);
}