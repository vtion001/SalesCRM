// Consolidated Zadarma API router - handles all operations
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { zadarmaRequest, ZADARMA_CONFIG } from './config';

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

  const { operation } = req.query;
  const op = Array.isArray(operation) ? operation[0] : operation;

  try {
    // Route to appropriate handler based on operation
    switch (op) {
      case 'make-call':
        return handleMakeCall(req, res);
      case 'call-logs':
        return handleCallLogs(req, res);
      case 'send-sms':
        return handleSendSMS(req, res);
      case 'hangup-call':
        return handleHangupCall(req, res);
      case 'reject-call':
        return handleRejectCall(req, res);
      case 'validate-number':
        return handleValidateNumber(req, res);
      case 'initialize':
        return handleInitialize(req, res);
      default:
        return res.status(404).json({ error: `Unknown operation: ${op}` });
    }
  } catch (error) {
    console.error('❌ Zadarma API error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

// Handler: Make Call (callback API)
async function handleMakeCall(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log environment configuration
    console.log('🔧 Zadarma Config Check:');
    console.log('   API_KEY:', ZADARMA_CONFIG.API_KEY ? ZADARMA_CONFIG.API_KEY.substring(0, 5) + '...' : 'NOT SET');
    console.log('   SECRET_KEY:', ZADARMA_CONFIG.SECRET_KEY ? ZADARMA_CONFIG.SECRET_KEY.substring(0, 5) + '...' : 'NOT SET');
    console.log('   SIP_NUMBER:', ZADARMA_CONFIG.SIP_NUMBER || 'NOT SET');
    console.log('   BASE_URL:', ZADARMA_CONFIG.BASE_URL);

    const { to, from, predicted } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Destination number (to) is required' });
    }

    if (!ZADARMA_CONFIG.API_KEY || !ZADARMA_CONFIG.SECRET_KEY) {
      console.error('❌ Zadarma credentials not configured');
      return res.status(500).json({ 
        error: 'Zadarma API credentials not configured. Please set ZADARMA_API_KEY and ZADARMA_SECRET_KEY in Vercel environment variables.',
        debug: {
          apiKey: !!ZADARMA_CONFIG.API_KEY,
          secretKey: !!ZADARMA_CONFIG.SECRET_KEY,
          sipNumber: !!ZADARMA_CONFIG.SIP_NUMBER
        }
      });
    }

    const params: Record<string, any> = {
      from: from || ZADARMA_CONFIG.SIP_NUMBER || '',
      to: to
    };

    if (predicted) {
      params.predicted = 'y';
    }

    console.log('📞 Initiating Zadarma callback with params:', params);

    const result = await zadarmaRequest('/request/callback/', params, 'GET');

    console.log('📡 Zadarma API result:', JSON.stringify(result));

    if (result.status === 'error') {
      console.error('❌ Zadarma API returned error:', result);
      return res.status(400).json({ 
        error: result.message || 'Zadarma callback request failed',
        zadarmaResponse: result
      });
    }

    console.log('✅ Zadarma callback initiated successfully');

    res.status(200).json({
      success: true,
      message: 'Call initiated',
      data: result
    });
  } catch (error: any) {
    console.error('❌ Exception in Zadarma make-call handler:', error);
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    
    res.status(500).json({ 
      error: error.message || 'Failed to initiate call',
      errorType: error.name,
      details: error.toString()
    });
  }
}

// Handler: Get Call Logs
async function handleCallLogs(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { start, end, limit, skip } = req.query;

  const params: Record<string, any> = {};
  if (start) params.start = start;
  if (end) params.end = end;
  if (limit) params.limit = limit;
  if (skip) params.skip = skip;

  console.log('📊 Fetching Zadarma PBX statistics:', params);

  const result = await zadarmaRequest('/statistics/pbx/', params, 'GET');

  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to fetch call logs');
  }

  const calls = (result.stats || []).map((stat: any) => ({
    id: stat.call_id,
    pbxCallId: stat.pbx_call_id,
    caller: stat.caller,
    called: stat.called,
    duration: stat.billsec,
    direction: stat.type,
    timestamp: stat.start,
    disposition: stat.disposition,
    cost: stat.cost
  }));

  res.status(200).json({
    success: true,
    calls,
    total: calls.length
  });
}

// Handler: Send SMS
async function handleSendSMS(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: 'Recipient (to) and message text are required' });
  }

  console.log('💬 Sending SMS via Zadarma:', { to, textLength: text.length });

  // SMS endpoint - placeholder for actual Zadarma SMS API
  const params = { to, text };
  const result = await zadarmaRequest('/sms/send/', params, 'POST');

  if (result.status === 'error') {
    throw new Error(result.message || 'SMS send failed');
  }

  console.log('✅ SMS sent successfully:', result);

  res.status(200).json({
    success: true,
    message: 'SMS sent',
    data: result
  });
}

// Handler: Hangup Call
async function handleHangupCall(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pbxCallId } = req.body;

  if (!pbxCallId) {
    return res.status(400).json({ error: 'pbxCallId is required' });
  }

  console.log('📞 Hanging up call:', pbxCallId);

  const params = { pbx_call_id: pbxCallId };
  const result = await zadarmaRequest('/request/hangup/', params, 'GET');

  res.status(200).json({
    success: true,
    message: 'Call hangup acknowledgment',
    data: result
  });
}

// Handler: Reject Call
async function handleRejectCall(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pbxCallId } = req.body;

  if (!pbxCallId) {
    return res.status(400).json({ error: 'pbxCallId is required' });
  }

  console.log('🚫 Rejecting call:', pbxCallId);

  const params = { pbx_call_id: pbxCallId };
  const result = await zadarmaRequest('/request/reject/', params, 'GET');

  res.status(200).json({
    success: true,
    message: 'Call rejection acknowledgment',
    data: result
  });
}

// Handler: Validate Number
async function handleValidateNumber(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  console.log('✔️ Validating phone number:', number);

  // Basic validation
  const cleanNumber = number.replace(/\D/g, '');
  const isValid = cleanNumber.length >= 10;

  res.status(200).json({
    success: true,
    number: cleanNumber,
    isValid: isValid,
    message: isValid ? 'Valid phone number' : 'Invalid phone number format'
  });
}

// Handler: Initialize Device
async function handleInitialize(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🚀 Initializing Zadarma device');

  // Zadarma callback API doesn't require device initialization like Twilio
  // This endpoint just confirms the provider is ready
  res.status(200).json({
    success: true,
    message: 'Zadarma provider initialized (callback API - no device setup required)',
    provider: 'zadarma',
    capabilities: {
      voice: true,
      sms: true,
      callback: true,
      webrtc: false
    }
  });
}
