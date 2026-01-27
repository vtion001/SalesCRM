import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env from parent directory (.env.local)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

dotenv.config({ path: envPath });
console.log('✓ Loading environment from:', envPath);

const app = express();
const PORT = process.env.PORT || 4000;

// Twilio credentials from .env.local (define before using)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// Accept either TWILIO_API_KEY (+ TWILIO_API_SECRET) or TWILIO_API_KEY_SID (+ TWILIO_API_KEY_SECRET)
const apiKey = process.env.TWILIO_API_KEY || process.env.TWILIO_API_KEY_SID;
const apiSecret = process.env.TWILIO_API_SECRET || process.env.TWILIO_API_KEY_SECRET;

console.log('Backend Configuration:');
console.log('  - PORT:', PORT);
console.log('  - TWILIO_ACCOUNT_SID:', accountSid ? '✓ Set' : '✗ Missing');
console.log('  - TWILIO_AUTH_TOKEN:', authToken ? '✓ Set' : '✗ Missing');
console.log('  - TWILIO_API_KEY:', apiKey ? '✓ Set' : '✗ Missing');
console.log('  - TWILIO_API_SECRET:', apiSecret ? '✓ Set' : '✗ Missing');
console.log('  - TWILIO_TWIML_APP_SID:', process.env.TWILIO_TWIML_APP_SID ? '✓ Set' : '✗ Missing');

if (!accountSid || !authToken) {
  console.warn('⚠️  TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set in .env.local');
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:3001'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Twilio client
const client = twilio(accountSid, authToken);
// Force debug logging for Twilio REST client to capture detailed REST logs (temporary)
client.logLevel = 'debug';
// Also respect TWILIO_LOG_LEVEL if explicitly set to a different value
if (process.env.TWILIO_LOG_LEVEL && process.env.TWILIO_LOG_LEVEL !== 'debug') {
  client.logLevel = process.env.TWILIO_LOG_LEVEL;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend running on port ' + PORT });
});

/**
 * GET /api/twilio/token
 * Generate Twilio access token (Vercel API Parity)
 * Query params: identity (user identifier)
 */
app.get('/api/twilio/token', async (req, res) => {
  let { identity } = req.query;
  console.log('Received GET /api/twilio/token request. Query:', req.query);

  // 1. TRIM values to remove hidden whitespace (common cause of 20101)
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID?.trim();

  if (!identity) {
    console.error('Error: identity parameter missing in request query');
    return res.status(400).json({ error: 'identity parameter required' });
  }

  // Sanitize identity
  const sanitizedIdentity = String(identity).replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (!accountSid || !authToken) {
    console.error('Error: Twilio Account SID or Auth Token missing');
    return res.status(500).json({ 
      error: 'TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN not configured in .env.local' 
    });
  }

  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    console.log(`Original identity: "${identity}"`);
    console.log(`Sanitized identity: "${sanitizedIdentity}"`);

    // 2. Create the token
    let token;
    // Check global variables loaded at top of file
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;

    if (apiKey && apiSecret) {
      // Standard method
      token = new AccessToken(
        accountSid,
        apiKey,
        apiSecret,
        { identity: sanitizedIdentity, ttl: 3600 }
      );
    } else {
      // Legacy method (Account SID as Key SID)
      token = new AccessToken(
        accountSid,                   // 1. Account SID
        accountSid,                   // 2. Key SID (Account SID used as signing key)
        authToken,                    // 3. Key Secret (Auth Token used as secret)
        { identity: sanitizedIdentity, ttl: 3600 }
      );
    }

    // 3. Add Voice Grant
    token.addGrant(new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    }));

    const jwt = token.toJwt();
    console.log(`✓ Token generated successfully for identity: "${sanitizedIdentity}"`);

    res.json({ token: jwt });
  } catch (error) {
    console.error('Error generating token:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /token
 * Legacy endpoint support (optional, can be deprecated)
 */
app.post('/token', async (req, res) => {
  let { identity } = req.body;
  console.log('Received /token request. Body:', req.body);

  // 1. TRIM values
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID?.trim();

  if (!identity) {
    console.error('Error: identity parameter missing in request body');
    return res.status(400).json({ error: 'identity parameter required' });
  }

  // Sanitize identity
  const sanitizedIdentity = String(identity).replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (!accountSid || !authToken) {
    return res.status(500).json({ error: 'Twilio credentials missing' });
  }

  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // 2. Create token using AUTH TOKEN method
    const token = new AccessToken(
      accountSid,                   // 1. Account SID
      accountSid,                   // 2. Key SID (Account SID used here)
      authToken,                    // 3. Key Secret (Auth Token used here)
      { identity: sanitizedIdentity, ttl: 3600 }
    );

    // 3. Add Voice grant
    token.addGrant(new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    }));

    const jwt = token.toJwt();
    res.json({ token: jwt });
  } catch (error) {
    console.error('Error generating token:', error.message);
    res.status(500).json({ 
      error: error.message,
      debug: {
        identityReceived: identity,
        accountSidConfigured: !!accountSid,
        authTokenConfigured: !!authToken
      }
    });
  }
});

/**
 * POST /call
 * Initiate an outgoing call
 * Required params: to (phone number), from (caller ID)
 */
app.post('/call', async (req, res) => {
  const { to, from = twilioPhoneNumber } = req.body;

  if (!to) {
    return res.status(400).json({ error: 'to (phone number) parameter required' });
  }

  if (!twilioPhoneNumber) {
    return res.status(500).json({ 
      error: 'TWILIO_PHONE_NUMBER not configured in .env.local' 
    });
  }

  try {
    const call = await client.calls.create({
      from: from,
      to: to,
      url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/twiml/voice`,
      statusCallback: `${process.env.BACKEND_URL || 'http://localhost:4000'}/call-status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed']
    });

    res.json({ 
      success: true, 
      callSid: call.sid,
      message: `Call initiated to ${to}` 
    });
  } catch (error) {
    console.error('Error creating call:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /sms
 * Send an SMS message
 * Required params: to (phone number), body (message text)
 */
app.post('/sms', async (req, res) => {
  const { to, body } = req.body;

  if (!to || !body) {
    return res.status(400).json({ error: 'to (phone) and body (message) parameters required' });
  }

  if (!twilioPhoneNumber) {
    return res.status(500).json({ 
      error: 'TWILIO_PHONE_NUMBER not configured in .env.local' 
    });
  }

  try {
    const message = await client.messages.create({
      from: twilioPhoneNumber,
      to: to,
      body: body,
      statusCallback: `${process.env.BACKEND_URL || 'http://localhost:4000'}/message-status`
    });

    res.json({ 
      success: true, 
      messageSid: message.sid,
      message: 'SMS sent successfully' 
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /twiml/voice
 * TwiML response for voice calls (MUST be POST for Twilio Device.connect())
 * This endpoint is called by Twilio when a call is initiated via the browser SDK
 * 
 * Twilio sends: To, From, CallSid, AccountSid, etc. in the POST body
 */
app.post('/twiml/voice', (req, res) => {
  // Get the destination number from the request body (sent by Twilio Device.connect())
  const toNumber = req.body?.To || req.body?.to;
  const fromNumber = req.body?.From || twilioPhoneNumber;
  
  console.log('📞 TwiML Voice Request:');
  console.log('   To:', toNumber);
  console.log('   From:', fromNumber);
  console.log('   Body:', JSON.stringify(req.body));

  const response = new twilio.twiml.VoiceResponse();
  
  if (toNumber) {
    // If we have a destination number, dial it
    console.log(`   Dialing: ${toNumber}`);
    const dial = response.dial({
      callerId: twilioPhoneNumber || fromNumber,
      timeout: 30,
      answerOnBridge: true
    });
    dial.number(toNumber);
  } else {
    // No number provided - this shouldn't happen but handle gracefully
    console.log('   No destination number provided');
    response.say('No destination number was provided. Please try again.', {
      voice: 'alice'
    });
  }

  res.type('text/xml');
  res.send(response.toString());
});

/**
 * GET /twiml/voice
 * TwiML response for voice calls (fallback for GET requests)
 * Some Twilio configurations may use GET
 */
app.get('/twiml/voice', (req, res) => {
  const toNumber = req.query?.To || req.query?.to;
  
  console.log('📞 TwiML Voice GET Request:');
  console.log('   To:', toNumber);

  const response = new twilio.twiml.VoiceResponse();
  
  if (toNumber) {
    const dial = response.dial({
      callerId: twilioPhoneNumber,
      timeout: 30,
      answerOnBridge: true
    });
    dial.number(toNumber);
  } else {
    response.say('Thank you for calling Sales CRM. Your call has been connected.', {
      voice: 'alice'
    });
  }

  res.type('text/xml');
  res.send(response.toString());
});

/**
 * POST /call-status
 * Webhook to receive call status updates
 */
app.post('/call-status', (req, res) => {
  const { CallSid, CallStatus, To, From } = req.body;
  console.log(`Call ${CallSid} status: ${CallStatus} | From: ${From} | To: ${To}`);
  res.sendStatus(200);
});

/**
 * POST /message-status
 * Webhook to receive SMS status updates
 */
app.post('/message-status', (req, res) => {
  const { MessageSid, MessageStatus, To, From } = req.body;
  console.log(`Message ${MessageSid} status: ${MessageStatus} | From: ${From} | To: ${To}`);
  res.sendStatus(200);
});

/**
 * POST /incoming-sms
 * Webhook for incoming SMS messages
 */
app.post('/incoming-sms', (req, res) => {
  const { From, To, Body } = req.body;
  console.log(`Incoming SMS from ${From}: ${Body}`);
  
  const response = new twilio.twiml.MessagingResponse();
  response.message('Thank you for your message. The Sales CRM team will respond shortly.');
  
  res.type('text/xml');
  res.send(response.toString());
});

app.listen(PORT, () => {
  console.log(`🚀 SalesCRM Backend running on http://localhost:${PORT}`);
  console.log(`⚙️  Make sure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are set in .env.local`);
});
