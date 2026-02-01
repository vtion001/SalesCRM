// Zadarma webhook handler for call notifications

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('📞 Zadarma webhook handler invoked');
  console.log('   Method:', req.method);
  console.log('   Query:', JSON.stringify(req.query));
  console.log('   Body:', JSON.stringify(req.body).substring(0, 300));

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Zadarma webhook verification - echo back zd_echo parameter
  if (req.method === 'GET' && req.query.zd_echo) {
    console.log('✅ Zadarma webhook verification:', req.query.zd_echo);
    return res.status(200).send(req.query.zd_echo as string);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;
    
    console.log('📞 Zadarma webhook event received:', webhookData.event);
    console.log('   Full data:', webhookData);

    // Zadarma webhooks can be: NOTIFY_START, NOTIFY_END, NOTIFY_ANSWER, NOTIFY_OUT_START, NOTIFY_OUT_END
    const event = webhookData.event;
    const pbxCallId = webhookData.pbx_call_id;
    const callId = webhookData.call_id;
    const caller = webhookData.caller;
    const called = webhookData.called;
    const disposition = webhookData.disposition;
    const duration = webhookData.billsec;

    // Handle different webhook events
    switch (event) {
      case 'NOTIFY_START':
      case 'NOTIFY_OUT_START':
        // Incoming or outgoing call started
        await handleCallStart(pbxCallId, callId, caller, called, event === 'NOTIFY_START' ? 'incoming' : 'outgoing');
        break;

      case 'NOTIFY_ANSWER':
        // Call answered
        await handleCallAnswer(pbxCallId, callId);
        break;

      case 'NOTIFY_END':
      case 'NOTIFY_OUT_END':
        // Call ended
        await handleCallEnd(pbxCallId, callId, disposition, duration);
        break;

      case 'NOTIFY_INTERNAL':
        // Internal PBX call (between extensions)
        console.log('📞 Internal call notification:', webhookData);
        break;

      default:
        console.log('⚠️ Unknown Zadarma webhook event:', event);
    }

    return res.status(200).json({ success: true, received: event });
  } catch (error: any) {
    console.error('❌ Zadarma webhook error:', error);
    return res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message
    });
  }
}

async function handleCallStart(
  pbxCallId: string,
  callId: string,
  caller: string,
  called: string,
  callType: 'incoming' | 'outgoing'
) {
  try {
    // Create call history record
    const { error } = await supabase.from('call_history').insert({
      id: `zadarma_${pbxCallId}`,
      phone_number: callType === 'incoming' ? caller : called,
      call_type: callType,
      call_sid: callId,
      duration_seconds: 0,
      notes: 'Call started',
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('❌ Failed to create call history:', error);
    } else {
      console.log('✅ Call history created:', pbxCallId);
    }
  } catch (error) {
    console.error('❌ Error in handleCallStart:', error);
  }
}

async function handleCallAnswer(pbxCallId: string, callId: string) {
  try {
    const { error } = await supabase
      .from('call_history')
      .update({
        notes: 'Call answered',
        updated_at: new Date().toISOString()
      })
      .eq('id', `zadarma_${pbxCallId}`);

    if (error) {
      console.error('❌ Failed to update call answered:', error);
    } else {
      console.log('✅ Call answered updated:', pbxCallId);
    }
  } catch (error) {
    console.error('❌ Error in handleCallAnswer:', error);
  }
}

async function handleCallEnd(
  pbxCallId: string,
  callId: string,
  disposition: string,
  duration: number
) {
  try {
    const { error } = await supabase
      .from('call_history')
      .update({
        duration_seconds: duration || 0,
        notes: `Call ended: ${disposition}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', `zadarma_${pbxCallId}`);

    if (error) {
      console.error('❌ Failed to update call end:', error);
    } else {
      console.log('✅ Call end updated:', pbxCallId, 'Duration:', duration);
    }
  } catch (error) {
    console.error('❌ Error in handleCallEnd:', error);
  }
}
