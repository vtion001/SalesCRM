import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Handle incoming and outgoing calls with TwiML
 * POST /api/twiml/voice
 * 
 * This is called by Twilio when:
 * 1. A browser client initiates an outgoing call via Device.connect()
 * 2. An incoming call needs to be routed
 * 
 * Twilio sends: To, From, CallSid, AccountSid, Direction, etc.
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

  // Get Twilio phone number from environment for caller ID
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER?.trim();

  // 1. Get the phone number the user dialed (sent by Twilio as 'To')
  // Twilio sends parameters in the body for POST requests
  const toNumber = req.body?.To || req.body?.to || req.query?.To || req.query?.to;
  const fromNumber = req.body?.From || req.body?.from || twilioPhoneNumber;
  const callSid = req.body?.CallSid || req.body?.callSid;
  const direction = req.body?.Direction || 'outbound-api';

  // Log the request for debugging
  console.log('📞 TwiML Voice Request:');
  console.log('   Method:', req.method);
  console.log('   To:', toNumber);
  console.log('   From:', fromNumber);
  console.log('   CallSid:', callSid);
  console.log('   Direction:', direction);
  console.log('   Twilio Phone:', twilioPhoneNumber);
  console.log('   Body:', JSON.stringify(req.body));

  // 2. Validate caller ID
  if (!twilioPhoneNumber) {
    console.error('   ❌ CRITICAL: TWILIO_PHONE_NUMBER not set in environment!');
    console.error('   This will cause 31005 errors. Set it in Vercel environment variables.');
  }

  // 3. Get SIP trunk configuration
  const sipDomain = process.env.TWILIO_SIP_DOMAIN?.trim();
  const sipTrunkConfigured = !!sipDomain;

  // 4. Create the TwiML response
  let twiml: string;

  if (toNumber) {
    // Outgoing call - dial the destination number
    console.log(`   ✅ Dialing: ${toNumber}`);
    console.log(`   📱 Using Caller ID: ${twilioPhoneNumber || 'MISSING - THIS WILL FAIL!'}`);
    console.log(`   🔧 SIP Trunk: ${sipTrunkConfigured ? `Enabled (${sipDomain})` : 'Disabled - using standard routing'}`);
    
    // Only include callerId if we have a valid Twilio number
    const callerIdAttr = twilioPhoneNumber ? `callerId="${twilioPhoneNumber}"` : '';
    
    // Check if this is a premium Australian number (1300/1800/13xx)
    const isPremiumNumber = toNumber.match(/^\+?61\s?(1?300|1?800|13)/);
    
    if (sipTrunkConfigured && isPremiumNumber) {
      // Route through SIP trunk for premium numbers
      console.log(`   🚀 Routing via SIP Trunk for premium number`);
      const sipUri = `sip:${toNumber.replace(/^\+/, '')}@${sipDomain}`;
      
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial ${callerIdAttr} timeout="30" answerOnBridge="true">
    <Sip>${sipUri}</Sip>
  </Dial>
</Response>`;
    } else {
      // Standard routing for mobile/landline numbers
      console.log(`   📞 Using standard routing (mobile/landline)`);
      if (!sipTrunkConfigured && isPremiumNumber) {
        console.warn('   ⚠️ SIP trunk domain not configured. Premium numbers may fail.');
      }
      
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial ${callerIdAttr} timeout="30" answerOnBridge="true">
    <Number>${toNumber}</Number>
  </Dial>
</Response>`;
    }
    
    console.log('   📄 TwiML Generated:', twiml);
  } else {
    // No destination number provided
    console.log('   ⚠️ No destination number provided');
    twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">No destination number was provided. Please try again.</Say>
</Response>`;
  }

  // 4. CRITICAL: Return Content-Type: text/xml to prevent Error 31005
  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(twiml);
}