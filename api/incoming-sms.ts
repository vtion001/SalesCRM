import { VercelRequest, VercelResponse } from '@vercel/node';
import { VoiceResponse } from 'twilio';
import { createClient } from '@supabase/supabase-js';

const {
  VITE_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  VITE_SUPABASE_ANON_KEY
} = process.env;

/**
 * Handle incoming SMS messages
 * POST /api/incoming-sms
 * 
 * Twilio sends:
 * - From: Sender phone number
 * - To: Your Twilio phone number
 * - Body: Message text
 * - MessageSid: Unique message ID
 * - AccountSid: Your Twilio account
 * 
 * Returns: TwiML SMS response (empty 200 OK to Twilio)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/xml');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).end('Method not allowed');
  }

  try {
    // Extract Twilio webhook data
    const { From, To, Body, MessageSid, AccountSid } = req.body;

    console.log('📬 Incoming SMS received:', {
      from: From,
      to: To,
      messageSid: MessageSid,
      bodyLength: Body?.length
    });

    // Validate required fields
    if (!From || !To || !Body || !MessageSid) {
      console.warn('⚠️  Missing required SMS fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Supabase client for storing SMS
    const supabaseUrl = VITE_SUPABASE_URL || '';
    const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || VITE_SUPABASE_ANON_KEY || '';

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Store SMS in sms_messages table
        const { error: insertError } = await supabase
          .from('sms_messages')
          .insert({
            from_number: From,
            to_number: To,
            body: Body,
            twilio_message_sid: MessageSid,
            direction: 'inbound',
            status: 'received',
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('❌ Error storing SMS in Supabase:', insertError);
        } else {
          console.log(`✅ SMS stored in database (MessageSid: ${MessageSid})`);
        }
      } catch (dbError: any) {
        console.error('❌ Error connecting to Supabase:', dbError?.message);
        // Continue anyway - don't block Twilio webhook
      }
    } else {
      console.warn('⚠️  Supabase not configured - skipping SMS storage');
    }

    // Optional: Send auto-reply to the sender
    const shouldAutoReply = req.query.autoReply === 'true' || false;
    
    if (shouldAutoReply) {
      const response = new VoiceResponse();
      // Note: For SMS, we don't use Voice response, just return 200 OK
      // Twilio handles the SMS response differently
      console.log('📤 Auto-reply enabled (would send SMS response)');
    }

    // Return 200 OK to Twilio to confirm receipt
    // Twilio expects an empty TwiML response or just an empty 200
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);

    return;

  } catch (error: any) {
    console.error('❌ Error handling incoming SMS:', {
      message: error?.message,
      stack: error?.stack
    });

    // Still return 200 to acknowledge to Twilio
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);
  }
}
