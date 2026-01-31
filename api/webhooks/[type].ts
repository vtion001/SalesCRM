// Consolidated Webhook router
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { type } = req.query;
  const webhookType = Array.isArray(type) ? type[0] : type;

  try {
    switch (webhookType) {
      case 'call-status':
        return handleCallStatus(req, res);
      case 'message-status':
        return handleMessageStatus(req, res);
      case 'transcription':
        return handleTranscription(req, res);
      default:
        return res.status(404).json({ error: `Unknown webhook type: ${webhookType}` });
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

// Handler: Call Status Webhook
async function handleCallStatus(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      CallSid,
      CallStatus,
      From,
      To,
      Duration,
      RecordingUrl,
    } = req.body;

    console.log('📞 Call status webhook:', CallStatus, CallSid);

    // Update call history in Supabase
    const { data, error } = await supabase
      .from('call_history')
      .upsert({
        call_sid: CallSid,
        phone_number: CallStatus === 'completed' ? From : To,
        call_type: CallStatus === 'completed' ? 'outbound' : 'inbound',
        duration_seconds: parseInt(Duration || '0'),
        notes: `Call ${CallStatus}`,
        recording_url: RecordingUrl,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'call_sid'
      });

    if (error) {
      console.error('❌ Failed to update call history:', error);
    }

    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  } catch (error) {
    console.error('Error in call status webhook:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  }
}

// Handler: Message Status Webhook
async function handleMessageStatus(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      MessageSid,
      MessageStatus,
      From,
      To,
      Body,
      ErrorCode,
    } = req.body;

    console.log('💬 Message status webhook:', MessageStatus, MessageSid);

    // Update SMS message in Supabase
    const { error } = await supabase
      .from('sms_messages')
      .upsert({
        message_sid: MessageSid,
        from_number: From,
        to_number: To,
        message_body: Body,
        status: MessageStatus,
        error_code: ErrorCode,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'message_sid'
      });

    if (error) {
      console.error('❌ Failed to update message status:', error);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in message status webhook:', error);
    res.status(500).json({ error: 'Internal error' });
  }
}

// Handler: Transcription Webhook
async function handleTranscription(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      TranscriptionSid,
      TranscriptionText,
      TranscriptionStatus,
      CallSid,
      RecordingSid,
    } = req.body;

    console.log('📝 Transcription webhook:', TranscriptionStatus, TranscriptionSid);

    // Update call history with transcription
    const { error } = await supabase
      .from('call_history')
      .update({
        transcription: TranscriptionText,
        notes: `Transcription ${TranscriptionStatus}`,
        updated_at: new Date().toISOString(),
      })
      .eq('call_sid', CallSid);

    if (error) {
      console.error('❌ Failed to update transcription:', error);
    }

    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  } catch (error) {
    console.error('Error in transcription webhook:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  }
}
