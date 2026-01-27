import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Record incoming calls as voicemail
 * POST /api/twiml/voicemail
 * 
 * Use this endpoint to record voicemails from incoming calls.
 * Optionally enable transcription by setting ENABLE_TRANSCRIPTION=true
 * 
 * To retrieve recordings later, use Twilio Console or REST API:
 * https://www.twilio.com/docs/voice/api/recording
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const from = req.body?.From || 'Unknown';
  const fromCity = req.body?.FromCity || '';
  const enableTranscription = process.env.ENABLE_TRANSCRIPTION === 'true';

  console.log('📞 Recording voicemail:');
  console.log('   From:', from, fromCity);
  console.log('   Transcription:', enableTranscription ? 'enabled' : 'disabled');

  // Create TwiML for voicemail recording
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Hello! You have reached Sales C R M. Please leave a message after the beep, and we will get back to you as soon as possible.</Say>
  <Record 
    maxLength="120" 
    transcribe="${enableTranscription}" 
    transcribeCallback="https://sales-crm-sigma-eosin.vercel.app/api/webhooks/transcription"
    playBeep="true"
  />
  <Say voice="alice">Thank you for your message. Goodbye!</Say>
  <Hangup/>
</Response>`;

  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(twiml);
}
