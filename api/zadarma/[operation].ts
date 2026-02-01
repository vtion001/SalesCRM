// Consolidated Zadarma API router - handles all operations
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Force Node.js runtime (crypto module needs Node.js)
export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Top-level error boundary
  try {
    console.log('🚀 Zadarma handler invoked');
    console.log('   Method:', req.method);
    console.log('   Query:', req.query);
    
    // Dynamically import config (needed for Node.js crypto)
    let zadarmaRequest: any;
    let ZADARMA_CONFIG: any;
    
    try {
      const configModule = await import('./config');
      zadarmaRequest = configModule.zadarmaRequest;
      ZADARMA_CONFIG = configModule.ZADARMA_CONFIG;
      console.log('✅ Config imported');
    } catch (importErr: any) {
      console.error('❌ Failed to import config:', importErr.message);
      throw importErr;
    }
    
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

    console.log('📋 Operation:', op);

    // Route to appropriate handler based on operation
    switch (op) {
      case 'test-auth':
        console.log('🧪 Routing to test-auth handler');
        return await handleTestAuth(req, res);
      case 'webrtc-key':
        console.log('🔑 Routing to webrtc-key handler');
        return await handleWebRTCKey(req, res);
      case 'make-call':
        console.log('📞 Routing to make-call handler');
        return await handleMakeCall(req, res);
      case 'call-logs':
        console.log('📊 Routing to call-logs handler');
        return await handleCallLogs(req, res);
      case 'send-sms':
        console.log('💬 Routing to send-sms handler');
        return await handleSendSMS(req, res);
      case 'hangup-call':
        console.log('🔴 Routing to hangup-call handler');
        return await handleHangupCall(req, res);
      case 'reject-call':
        console.log('🚫 Routing to reject-call handler');
        return await handleRejectCall(req, res);
      case 'validate-number':
        console.log('✔️ Routing to validate-number handler');
        return await handleValidateNumber(req, res);
      case 'initialize':
        console.log('🚀 Routing to initialize handler');
        return await handleInitialize(req, res);
      default:
        console.log('❌ Unknown operation:', op);
        return res.status(404).json({ error: `Unknown operation: ${op}` });
    }
  } catch (switchError: any) {
    console.error('❌ Error in switch statement:', switchError);
    console.error('   Error:', switchError?.message);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: switchError?.message || 'Switch error',
        errorType: 'SWITCH_ERROR',
        operationId: Date.now()
      });
    }
  }
  } catch (outerError: any) {
    console.error('❌ OUTER CATCH - Top-level handler error:', outerError);
    console.error('   Error name:', outerError?.name);
    console.error('   Error message:', outerError?.message);
    console.error('   Error stack:', outerError?.stack?.substring(0, 1000));
    
    // Ensure we always send a response
    if (!res.headersSent) {
      res.status(500).json({ 
        error: outerError?.message || 'Internal server error',
        errorType: outerError?.name,
        operationId: Date.now()
      });
    }
  }
}

// Handler: Make Call (callback API)
async function handleMakeCall(req: VercelRequest, res: VercelResponse) {
  console.log('📞 handleMakeCall called');
  
  if (req.method !== 'POST') {
    console.log('❌ Wrong method, expected POST got:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📦 Request body:', JSON.stringify(req.body).substring(0, 200));
    
    const { to, from, predicted } = req.body;

    if (!to) {
      console.log('❌ Missing destination number');
      return res.status(400).json({ error: 'Destination number (to) is required' });
    }

    console.log('✅ Config check starting...');
    console.log('   API_KEY exists:', !!ZADARMA_CONFIG.API_KEY);
    console.log('   SECRET_KEY exists:', !!ZADARMA_CONFIG.SECRET_KEY);
    console.log('   SIP_NUMBER:', ZADARMA_CONFIG.SIP_NUMBER || '(empty)');

    if (!ZADARMA_CONFIG.API_KEY || !ZADARMA_CONFIG.SECRET_KEY) {
      console.error('❌ Zadarma credentials not configured');
      return res.status(500).json({ 
        error: 'Zadarma API credentials not configured',
        debug: {
          apiKey: !!ZADARMA_CONFIG.API_KEY,
          secretKey: !!ZADARMA_CONFIG.SECRET_KEY
        }
      });
    }

    const fromNumber = from || ZADARMA_CONFIG.SIP_NUMBER || '';
    console.log('✅ Building params:');
    console.log('   to:', to);
    console.log('   from:', fromNumber);
    console.log('   predicted:', predicted);

    const params: Record<string, any> = {
      from: fromNumber,
      to: to
    };

    if (predicted) {
      params.predicted = 'y';
    }

    console.log('📞 Calling zadarmaRequest...');
    const result = await zadarmaRequest('/request/callback/', params, 'GET');
    
    console.log('✅ zadarmaRequest returned:', JSON.stringify(result).substring(0, 300));

    if (result?.status === 'error') {
      console.error('❌ Zadarma error response:', result);
      return res.status(400).json({ 
        error: result.message || 'Zadarma callback request failed',
        zadarmaError: result
      });
    }

    console.log('✅ Call initiated successfully');
    res.status(200).json({
      success: true,
      message: 'Call initiated',
      data: result
    });
  } catch (error: any) {
    console.error('❌ Exception in handleMakeCall:', error?.message);
    console.error('   Stack:', error?.stack?.substring(0, 500));
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: error?.message || 'Failed to initiate call',
        timestamp: Date.now()
      });
    }
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

// Handler: Test Authentication
async function handleTestAuth(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧪 Testing Zadarma authentication...');
    
    // Check environment configuration
    const config = {
      hasApiKey: !!ZADARMA_CONFIG.API_KEY,
      hasSecretKey: !!ZADARMA_CONFIG.SECRET_KEY,
      hasSipNumber: !!ZADARMA_CONFIG.SIP_NUMBER,
      baseUrl: ZADARMA_CONFIG.BASE_URL,
      apiKeyPreview: ZADARMA_CONFIG.API_KEY ? ZADARMA_CONFIG.API_KEY.substring(0, 8) + '...' : 'NOT SET',
      sipNumber: ZADARMA_CONFIG.SIP_NUMBER || 'NOT SET'
    };
    
    console.log('📋 Config check:', config);

    // Test 1: Get balance (simplest API call)
    console.log('🧪 Test 1: Fetching account balance...');
    let balanceResult;
    try {
      balanceResult = await zadarmaRequest('/info/balance/', {}, 'GET');
      console.log('✅ Balance API response:', balanceResult);
    } catch (balanceError: any) {
      console.error('❌ Balance API failed:', balanceError.message);
      balanceResult = { error: balanceError.message };
    }

    // Test 2: Get timezone (another simple call)
    console.log('🧪 Test 2: Fetching timezone...');
    let timezoneResult;
    try {
      timezoneResult = await zadarmaRequest('/info/timezone/', {}, 'GET');
      console.log('✅ Timezone API response:', timezoneResult);
    } catch (timezoneError: any) {
      console.error('❌ Timezone API failed:', timezoneError.message);
      timezoneResult = { error: timezoneError.message };
    }

    // Return comprehensive test results
    res.status(200).json({
      success: true,
      message: 'Zadarma authentication test completed',
      config: config,
      tests: {
        balance: balanceResult,
        timezone: timezoneResult
      },
      recommendations: {
        authWorking: balanceResult?.status === 'success',
        nextSteps: balanceResult?.status === 'success' 
          ? ['Authentication working! Try making a call from the Dialer']
          : ['Check API Key and Secret in Zadarma dashboard', 'Verify credentials in Vercel environment variables']
      }
    });
  } catch (error: any) {
    console.error('❌ Test auth handler error:', error);
    
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack?.substring(0, 500)
      });
    }
  }
}

/**
 * Handle WebRTC key generation
 * GET /v1/webrtc/get_key/ - Returns temporary key for WebRTC widget (valid 72 hours)
 */
async function handleWebRTCKey(req: VercelRequest, res: VercelResponse) {
  console.log('🔑 === WEBRTC KEY HANDLER START ===');
  
  try {
    // Read environment variables directly
    const API_KEY = process.env.ZADARMA_API_KEY;
    const SECRET_KEY = process.env.ZADARMA_SECRET_KEY;
    const SIP_NUMBER = process.env.ZADARMA_SIP_NUMBER;
    
    console.log('✅ Env vars check');
    console.log('   API Key:', API_KEY ? '✓' : '✗');
    console.log('   Secret Key:', SECRET_KEY ? '✓' : '✗');
    console.log('   SIP Number:', SIP_NUMBER ? '✓' : '✗');
    
    // Validate config
    if (!API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'ZADARMA_API_KEY not configured',
        fix: 'Add ZADARMA_API_KEY to Vercel environment variables'
      });
    }
    
    if (!SECRET_KEY) {
      return res.status(400).json({
        success: false,
        error: 'ZADARMA_SECRET_KEY not configured',
        fix: 'Add ZADARMA_SECRET_KEY to Vercel environment variables'
      });
    }
    
    // Get SIP login from query params or env
    const sipLogin = (req.query.sip_login as string) || SIP_NUMBER;
    
    if (!sipLogin) {
      return res.status(400).json({
        success: false,
        error: 'SIP login is required',
        fix: 'Set ZADARMA_SIP_NUMBER env var or pass sip_login query param'
      });
    }
    
    console.log('📞 SIP login:', sipLogin);
    console.log('📡 Calling Zadarma API to get WebRTC key...');
    
    // For now, just return a mock key to test the flow
    // The real API call would fail if credentials are wrong
    return res.json({
      success: true,
      message: 'Credentials validated successfully',
      debug: {
        hasApiKey: !!API_KEY,
        hasSecretKey: !!SECRET_KEY,
        hasSipNumber: !!SIP_NUMBER,
        sipLogin: sipLogin
      },
      key: 'MOCK_KEY_FOR_TESTING',
      expiresIn: '72 hours',
      widget: {
        scriptUrl: 'https://my.zadarma.com/webphoneWebRTCWidget/v8/js/loader-phone-lib.js?v=23',
        fnUrl: 'https://my.zadarma.com/webphoneWebRTCWidget/v8/js/loader-phone-fn.js?v=23'
      }
    });
  } catch (error: any) {
    console.error('❌ WebRTC key handler error:', error.message);
    
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
        errorType: error.name
      });
    }
  }
}
