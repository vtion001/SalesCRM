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
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend running on port ' + PORT });
});

/**
 * POST /token
 * Generate Twilio access token for frontend Twilio.Device
 * Required params: identity (user identifier)
 */
app.post('/token', async (req, res) => {
  let { identity } = req.body;
  console.log('Received /token request. Body:', req.body);

  if (!identity) {
    console.error('Error: identity parameter missing in request body');
    return res.status(400).json({ error: 'identity parameter required' });
  }

  // Sanitize identity: remove any non-alphanumeric characters except underscore
  // Twilio requires: alphanumeric and underscore only
  const sanitizedIdentity = String(identity).replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (sanitizedIdentity.length === 0) {
    return res.status(400).json({ error: 'identity must contain at least one valid character' });
  }

  if (sanitizedIdentity.length > 256) {
    return res.status(400).json({ error: 'identity cannot exceed 256 characters' });
  }

  if (!apiKey || !apiSecret) {
    console.error('Error: Twilio API Key/Secret missing');
    return res.status(500).json({ 
      error: 'TWILIO_API_KEY and TWILIO_API_SECRET not configured in .env.local' 
    });
  }

  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    console.log(`Original identity: "${identity}"`);
    console.log(`Sanitized identity: "${sanitizedIdentity}" (Type: ${typeof sanitizedIdentity})`);

    // Create AccessToken with sanitized identity in the options object
    const token = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: sanitizedIdentity,
      ttl: 3600 // 1 hour
    });

    // Add Voice grant for calling capabilities
    token.addGrant(new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true
    }));

    const jwt = token.toJwt();
    console.log(`✓ Token generated successfully for identity: "${sanitizedIdentity}"`);
    console.log(`  Token length: ${jwt.length}`);

    res.json({ token: jwt });
  } catch (error) {
    console.error('Error generating token:', error.message);
    console.error('Full error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      error: error.message,
      debug: {
        identityReceived: identity,
        identityType: typeof identity,
        apiKeyConfigured: !!apiKey,
        apiSecretConfigured: !!apiSecret,
        accountSidConfigured: !!accountSid,
        apiKeyFormat: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'N/A',
        apiSecretFormat: apiSecret ? `${apiSecret.substring(0, 4)}...${apiSecret.substring(apiSecret.length - 4)}` : 'N/A'
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
 * GET /twiml/voice
 * TwiML response for voice calls
 * This endpoint is called by Twilio when a call is initiated
 */
app.get('/twiml/voice', (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  response.say('Thank you for calling Sales CRM. Your call has been connected.', {
    voice: 'alice'
  });
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
