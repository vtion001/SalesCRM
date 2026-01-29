import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Handle Twilio call status callbacks
 * POST /api/webhooks/call-status
 * 
 * Called when call events occur:
 * - initiated: Call was initiated
 * - ringing: Call is ringing
 * - answered: Call was answered
 * - completed: Call was completed
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { CallSid, CallStatus, Direction, To, From, Duration } = req.body;

    console.log('📞 Call Status Callback:');
    console.log('   CallSid:', CallSid);
    console.log('   Status:', CallStatus);
    console.log('   Direction:', Direction);
    console.log('   To:', To);
    console.log('   From:', From);
    console.log('   Duration:', Duration);

    // Log to your database or monitoring service here if needed
    // For now, just acknowledge receipt

    return res.status(200).json({
      success: true,
      message: 'Call status logged',
      callSid: CallSid,
      status: CallStatus
    });
  } catch (error) {
    console.error('❌ Error handling call status callback:', error);
    return res.status(500).json({
      error: 'Failed to process callback',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
