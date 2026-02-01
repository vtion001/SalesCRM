// Standalone WebRTC key endpoint - no external dependencies
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export const config = {
  runtime: 'nodejs',
};

// Inline configuration - no external imports
const ZADARMA_API_KEY = process.env.ZADARMA_API_KEY || '';
const ZADARMA_SECRET_KEY = process.env.ZADARMA_SECRET_KEY || '';
const ZADARMA_SIP_NUMBER = process.env.ZADARMA_SIP_NUMBER || '';
const ZADARMA_BASE_URL = 'https://api.zadarma.com/v1';

function generateSignature(method: string, params: Record<string, string> = {}): string {
  const sortedKeys = Object.keys(params).sort();
  const sortedParams: Record<string, string> = {};
  sortedKeys.forEach(key => {
    sortedParams[key] = params[key];
  });
  
  const paramsStr = new URLSearchParams(sortedParams).toString();
  const paramsMd5 = crypto.createHash('md5').update(paramsStr).digest('hex');
  const signatureString = method + paramsStr + paramsMd5;
  const hash = crypto.createHmac('sha1', ZADARMA_SECRET_KEY).update(signatureString).digest();
  
  return hash.toString('base64');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('🔑 WebRTC Key Handler - START');
  
  try {
    // Check environment variables
    console.log('ENV CHECK:');
    console.log('  API_KEY:', ZADARMA_API_KEY ? `${ZADARMA_API_KEY.substring(0, 8)}...` : 'MISSING');
    console.log('  SECRET_KEY:', ZADARMA_SECRET_KEY ? 'SET' : 'MISSING');
    console.log('  SIP_NUMBER:', ZADARMA_SIP_NUMBER || 'MISSING');

    if (!ZADARMA_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'ZADARMA_API_KEY not configured',
        fix: 'Add ZADARMA_API_KEY to Vercel environment variables'
      });
    }

    if (!ZADARMA_SECRET_KEY) {
      return res.status(400).json({
        success: false,
        error: 'ZADARMA_SECRET_KEY not configured',
        fix: 'Add ZADARMA_SECRET_KEY to Vercel environment variables'
      });
    }

    // Get SIP login
    const sipLogin = (req.query.sip_login as string) || ZADARMA_SIP_NUMBER;

    if (!sipLogin) {
      return res.status(400).json({
        success: false,
        error: 'SIP login required',
        fix: 'Set ZADARMA_SIP_NUMBER env var or pass ?sip_login=XXX'
      });
    }

    console.log('📞 Using SIP login:', sipLogin);

    // Call Zadarma API
    const endpoint = '/webrtc/get_key/';
    const params = { sip_login: sipLogin };
    const signature = generateSignature(endpoint, params);
    
    const url = `${ZADARMA_BASE_URL}${endpoint}?${new URLSearchParams(params).toString()}`;
    
    console.log('📡 Calling Zadarma API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `${ZADARMA_API_KEY}:${signature}`
      }
    });

    const text = await response.text();
    console.log('📥 Response status:', response.status);
    console.log('📥 Response body:', text.substring(0, 500));

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('❌ Failed to parse response as JSON');
      return res.status(500).json({
        success: false,
        error: 'Invalid response from Zadarma',
        rawResponse: text.substring(0, 200)
      });
    }

    if (data.status === 'success' && data.key) {
      console.log('✅ WebRTC key obtained successfully');
      return res.json({
        success: true,
        key: data.key,
        sip_login: sipLogin,
        expiresIn: '72 hours',
        widget: {
          scriptUrl: 'https://my.zadarma.com/webphoneWebRTCWidget/v8/js/loader-phone-lib.js?v=23',
          fnUrl: 'https://my.zadarma.com/webphoneWebRTCWidget/v8/js/loader-phone-fn.js?v=23'
        }
      });
    } else {
      console.error('❌ Zadarma API error:', data);
      return res.status(500).json({
        success: false,
        error: data.message || 'Failed to get WebRTC key',
        zadarmaStatus: data.status,
        details: data
      });
    }
  } catch (error: any) {
    console.error('❌ Handler error:', error.message);
    console.error('   Stack:', error.stack?.substring(0, 500));
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      type: error.name
    });
  }
}
