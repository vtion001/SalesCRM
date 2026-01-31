// Zadarma API configuration and authentication

import crypto from 'crypto';

export const ZADARMA_CONFIG = {
  API_KEY: process.env.ZADARMA_API_KEY || '9730a08f829a0b6b08ba',
  SECRET_KEY: process.env.ZADARMA_SECRET_KEY || 'cecf0fdc63df8efbc513',
  BASE_URL: 'https://api.zadarma.com/v1',
  SIP_NUMBER: process.env.ZADARMA_SIP_NUMBER || ''
};

/**
 * Generate Zadarma API signature
 * Algorithm: base64(sha1(method + params + md5(params), secret_key))
 */
export function generateZadarmaSignature(
  method: string,
  params: Record<string, any> = {}
): string {
  // Sort params by key
  const sortedKeys = Object.keys(params).sort();
  const sortedParams: Record<string, any> = {};
  sortedKeys.forEach(key => {
    sortedParams[key] = params[key];
  });

  // Build query string
  const paramsStr = new URLSearchParams(sortedParams).toString();
  
  // Create MD5 hash of params
  const paramsMd5 = crypto
    .createHash('md5')
    .update(paramsStr)
    .digest('hex');

  // Create signature string
  const signatureString = method + paramsStr + paramsMd5;

  // Create HMAC SHA1 hash with secret key
  const hash = crypto
    .createHmac('sha1', ZADARMA_CONFIG.SECRET_KEY)
    .update(signatureString)
    .digest();

  // Encode to base64
  return hash.toString('base64');
}

/**
 * Create authorization header for Zadarma API
 */
export function createZadarmaHeaders(
  method: string,
  params: Record<string, any> = {}
): Record<string, string> {
  const signature = generateZadarmaSignature(method, params);
  
  return {
    'Authorization': `${ZADARMA_CONFIG.API_KEY}:${signature}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
}

/**
 * Make authenticated request to Zadarma API
 */
export async function zadarmaRequest(
  endpoint: string,
  params: Record<string, any> = {},
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
): Promise<any> {
  try {
    const method = endpoint; // Method is the endpoint path for signature
    const headers = createZadarmaHeaders(method, params);
    
    let url = `${ZADARMA_CONFIG.BASE_URL}${endpoint}`;
    let body: string | undefined;

    if (httpMethod === 'GET' && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    } else if (httpMethod !== 'GET') {
      body = new URLSearchParams(params).toString();
    }

    console.log('🌐 Zadarma Request:', {
      method: httpMethod,
      url,
      hasBody: !!body
    });

    const response = await fetch(url, {
      method: httpMethod,
      headers,
      body
    });

    const responseText = await response.text();
    console.log('📡 Zadarma Response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText.substring(0, 500)
    });

    if (!response.ok) {
      throw new Error(`Zadarma API error: ${response.status} ${response.statusText} - ${responseText}`);
    }

    // Parse JSON response
    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse Zadarma response as JSON:', responseText);
      throw new Error(`Invalid JSON response from Zadarma: ${responseText.substring(0, 100)}`);
    }
  } catch (error: any) {
    console.error('❌ zadarmaRequest exception:', error.message);
    throw error;
  }
}
