import { VercelRequest, VercelResponse } from '@vercel/node';
import { VoiceResponse, twiml } from 'twilio';

const { TWILIO_PHONE_NUMBER } = process.env;

/**
 * Handle incoming and outgoing calls with TwiML
 * POST /api/twiml/voice
 * 
 * Query params:
 * - to: Phone number to dial (for outgoing calls)
 * - from: Caller ID (default: TWILIO_PHONE_NUMBER)
 * 
 * Returns: TwiML XML response
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/xml');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end('Method not allowed');
  }

  try {
    const response = new VoiceResponse();

    // Get parameters from query or body
    const to = (req.query.to as string) || (req.body?.to as string);
    const from = (req.query.from as string) || (req.body?.from as string) || TWILIO_PHONE_NUMBER;

    console.log(`📞 Handling voice call:`, { to, from });

    if (to) {
      // Outgoing call - dial the number
      console.log(`📱 Dialing: ${to} from ${from}`);

      if (!TWILIO_PHONE_NUMBER) {
        console.error('❌ TWILIO_PHONE_NUMBER not configured');
        response.say('Twilio phone number is not configured');
        return res.status(500).send(response.toString());
      }

      // Create a Dial verb to dial the outgoing number
      const dial = response.dial({
        callerId: from,
        timeout: 30,
        // Record call if needed: record: 'record-from-answer'
      });

      // Add the number to dial
      dial.number(
        to,
        {
          // Optional: Set status callback for call events
          // statusCallback: `${process.env.VERCEL_URL || 'https://yourdomain.com'}/api/twiml/status`,
          // statusCallbackEvent: 'initiated ringing answered completed'
        }
      );

      console.log(`✅ Dial command created for: ${to}`);
    } else {
      // Incoming call - ask what they want to do
      console.log('📥 Incoming call - no dial target');
      
      response.say('Welcome to Sales CRM. Please wait while we connect your call.');
      
      // Alternatively, you could gather input:
      // const gather = response.gather({
      //   numDigits: 1,
      //   action: '/api/twiml/handle-input',
      //   method: 'POST'
      // });
      // gather.say('Press 1 for sales, 2 for support');
    }

    const twimlResponse = response.toString();
    console.log('📤 Returning TwiML:', twimlResponse.substring(0, 200) + '...');

    return res.status(200).send(twimlResponse);

  } catch (error: any) {
    console.error('❌ Error in voice TwiML handler:', {
      message: error?.message,
      stack: error?.stack
    });

    // Return a valid TwiML response with error message
    const errorResponse = new VoiceResponse();
    errorResponse.say('An error occurred. Please try again later.');

    return res.status(500).send(errorResponse.toString());
  }
}
