import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Handle incoming phone calls to your Twilio number
 * POST /api/twiml/incoming-call
 * 
 * This webhook is triggered when someone calls your Twilio phone number.
 * It routes the call to the browser client using Twilio Client SDK.
 * 
 * To use this:
 * 1. Go to Twilio Console > Phone Numbers > Manage > Active Numbers
 * 2. Click on your phone number
 * 3. Under "Voice Configuration", set:
 *    - A CALL COMES IN: Webhook
 *    - URL: https://your-app.vercel.app/api/twiml/incoming-call
 *    - HTTP: POST
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

  // Get call details from Twilio webhook
  const from = req.body?.From || 'Unknown';
  const to = req.body?.To || '';
  const callSid = req.body?.CallSid || '';
  const fromCity = req.body?.FromCity || '';
  const fromState = req.body?.FromState || '';
  
  console.log('📞 Incoming Call to Twilio Number:');
  console.log('   From:', from);
  console.log('   To:', to);
  console.log('   CallSid:', callSid);
  console.log('   Location:', fromCity, fromState);

  // Create TwiML response to route call to browser client
  // The client identity should match what's used when generating the token
  // For now, we'll use a generic identity - in production, you'd want to route
  // based on business logic (e.g., round-robin, availability, lead assignment)
  const clientIdentity = 'user_default'; // This should match the identity in your token

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Please wait while we connect you to an agent.</Say>
  <Dial timeout="30" record="record-from-answer">
    <Client>${clientIdentity}</Client>
  </Dial>
  <Say voice="alice">Sorry, no agents are available. Please try again later.</Say>
</Response>`;

  console.log('   Routing to client:', clientIdentity);

  // Return TwiML response
  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(twiml);
}
