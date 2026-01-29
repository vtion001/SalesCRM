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

  // Log all environment variables for debugging
  console.log('   🔍 Environment Check:');
  console.log('      TWILIO_SIP_DOMAIN:', sipDomain || 'NOT SET');
  console.log('      TWILIO_PHONE_NUMBER:', twilioPhoneNumber || 'NOT SET');

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
    // Updated regex to handle various formats: +61300xxx, +611300xxx, etc.
    const isPremiumNumber = /^\+?61\s?1?3(00|800)/.test(toNumber) || /^\+?611[0-9]{1,4}$/.test(toNumber);
    
    console.log(`   🎯 Number Type Check:`);
    console.log(`      Input: ${toNumber}`);
    console.log(`      Is Premium (1300/1800/13xx): ${isPremiumNumber}`);
    console.log(`      Decision: ${sipTrunkConfigured && isPremiumNumber ? 'SIP' : 'Standard Number routing'}`);
    
    if (sipTrunkConfigured && isPremiumNumber) {
      // Route through SIP trunk for premium numbers
      // Format: sip:61300130928@altoproperty.pstn.twilio.com
      const normalizedNumber = toNumber.replace(/^\+/, '').replace(/\s/g, '');
      const sipUri = `sip:${normalizedNumber}@${sipDomain}`;
      console.log(`   🚀 SIP Routing: ${sipUri}`);
      
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial ${callerIdAttr} timeout="30" answerOnBridge="true" statusCallbackEvent="initiated ringing answered completed" statusCallback="https://sales-crm-sigma-eosin.vercel.app/api/webhooks/call-status">
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
  <Dial ${callerIdAttr} timeout="30" answerOnBridge="true" statusCallbackEvent="initiated ringing answered completed" statusCallback="https://sales-crm-sigma-eosin.vercel.app/api/webhooks/call-status">
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