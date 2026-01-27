import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER
} = process.env;

/**
 * Send SMS message via Twilio API
 * POST /api/sms
 * 
 * Required parameters:
 * - to: Recipient phone number (E.164 format)
 * - body: Message content
 * 
 * Optional parameters:
 * - from: Sender phone number (defaults to TWILIO_PHONE_NUMBER)
 * 
 * Returns: JSON response with message SID and status
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract request body
    const { to, body, from } = req.body;

    // Validate required parameters
    if (!to || !body) {
      return res.status(400).json({ 
        error: 'Missing required parameters: to and body are required' 
      });
    }

    // Validate phone number format (basic E.164 validation)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to)) {
      return res.status(400).json({ 
        error: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)' 
      });
    }

    // Validate message length
    if (body.length > 1600) {
      return res.status(400).json({ 
        error: 'Message too long. Maximum 1600 characters allowed for standard SMS' 
      });
    }

    // Set default from number if not provided
    const fromNumber = from || TWILIO_PHONE_NUMBER;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !fromNumber) {
      console.error('❌ Missing Twilio configuration for SMS');
      return res.status(500).json({ 
        error: 'SMS service not properly configured' 
      });
    }

    console.log('📤 Sending SMS:', {
      from: fromNumber,
      to,
      bodyLength: body.length
    });

    // Initialize Twilio client
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // Build the status callback URL with proper protocol
    // Handle Vercel URLs that may or may not include protocol
    let baseUrl: string;
    if (process.env.VERCEL_URL) {
      // Remove any existing protocol and add https://
      const cleanUrl = process.env.VERCEL_URL.replace(/^https?:\/\//, '');
      baseUrl = `https://${cleanUrl}`;
    } else {
      baseUrl = 'https://sales-crm-sigma-eosin.vercel.app';
    }
    const statusCallbackUrl = `${baseUrl}/api/webhooks/message-status`;

    console.log('📍 Base URL:', baseUrl);
    console.log('📍 Status callback URL:', statusCallbackUrl);

    // Create and send SMS message
    const message = await client.messages.create({
      body: body,
      from: fromNumber,
      to: to,
      // Optional: Add delivery tracking
      statusCallback: statusCallbackUrl
    });

    console.log('✅ SMS sent successfully:', {
      messageSid: message.sid,
      status: message.status,
      to: to
    });

    // Return success response
    res.status(200).json({
      success: true,
      messageSid: message.sid,
      to: to,
      from: fromNumber,
      body: body,
      status: message.status,
      dateCreated: message.dateCreated,
      message: 'SMS sent successfully'
    });

  } catch (error: any) {
    console.error('❌ Error sending SMS:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack
    });

    // Return error response
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to send SMS',
      message: 'SMS sending failed'
    });
  }
}