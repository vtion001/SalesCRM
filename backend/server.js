import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config({ path: '../.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:3001'
  ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Twilio credentials from .env.local
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

if (!accountSid || !authToken) {
  console.warn('⚠️  TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set in .env.local');
}

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
  const { identity } = req.body;

  if (!identity) {
    return res.status(400).json({ error: 'identity parameter required' });
  }

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ 
      error: 'TWILIO_API_KEY and TWILIO_API_SECRET not configured in .env.local' 
    });
  }

  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const token = new AccessToken(accountSid, apiKey, apiSecret, { identity: identity });
    token.addGrant(new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true
    }));

    token.identity = identity;

    res.json({ token: token.toJwt() });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: error.message });
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
