// Test Zadarma authentication and API connection
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { zadarmaRequest, ZADARMA_CONFIG } from './config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
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
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack?.substring(0, 500)
    });
  }
}
