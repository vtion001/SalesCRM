import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Handle transcription callbacks from Twilio
 * POST /api/webhooks/transcription
 * 
 * This webhook is called by Twilio when a voicemail transcription is ready.
 * You can save the transcription to your database or send notifications.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const {
    TranscriptionText,
    TranscriptionStatus,
    RecordingSid,
    RecordingUrl,
    CallSid,
    From,
    To,
  } = req.body;

  console.log('📝 Transcription received:');
  console.log('   Status:', TranscriptionStatus);
  console.log('   From:', From);
  console.log('   CallSid:', CallSid);
  console.log('   RecordingSid:', RecordingSid);
  console.log('   Text:', TranscriptionText);

  // TODO: Save to database
  // Example: Save to Supabase call_history table
  // await supabase.from('call_history').insert({
  //   call_sid: CallSid,
  //   phone_number: From,
  //   call_type: 'incoming',
  //   recording_url: RecordingUrl,
  //   notes: TranscriptionText,
  // });

  return res.status(200).json({ 
    success: true,
    message: 'Transcription processed'
  });
}
