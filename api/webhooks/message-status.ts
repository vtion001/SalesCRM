import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Handle message status updates from Twilio
 * POST /api/webhooks/message-status
 * 
 * This webhook receives delivery status updates for sent SMS messages.
 * Statuses include: queued, sent, delivered, failed, undelivered
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const {
    MessageSid,
    MessageStatus,
    To,
    From,
    ErrorCode,
    ErrorMessage,
  } = req.body;

  console.log('📬 SMS Status Update:');
  console.log('   MessageSid:', MessageSid);
  console.log('   Status:', MessageStatus);
  console.log('   To:', To);
  console.log('   From:', From);
  
  if (ErrorCode) {
    console.log('   ❌ Error:', ErrorCode, ErrorMessage);
  }

  // TODO: Update database with delivery status
  // Example:
  // await supabase
  //   .from('sms_messages')
  //   .update({ 
  //     status: MessageStatus,
  //     error_message: ErrorMessage 
  //   })
  //   .eq('message_sid', MessageSid);

  return res.status(200).json({ 
    success: true,
    message: 'Status update received'
  });
}
