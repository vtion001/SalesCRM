/**
 * Twilio Service - Handles all Twilio API communication
 * This service bridges the frontend Dialer component with Vercel API Routes
 * 
 * All endpoints now use Vercel Serverless Functions:
 * - Token endpoint: /api/twilio/token
 * - Voice TwiML: /api/twiml/voice
 * - SMS: /api/sms
 * - Incoming SMS: /api/incoming-sms
 */
import { Device, Call } from '@twilio/voice-sdk';

// Use relative API paths for Vercel deployment
// Empty string means same origin - works for both local dev and production
const API_BASE = '';

// Environment detection for better debugging
const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';
console.log('🌍 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('📡 Using API Base:', API_BASE || '(same origin)');

console.log('Twilio Service initialized for Vercel API Routes deployment');

/**
 * SIP Trunk Configuration
 * Elastic SIP Trunking for outbound calls through Twilio's carrier network
 */
export interface SIPTrunkConfig {
  domain: string;
  trunkSid: string;
  username: string;
  password: string;
}

// Load SIP trunk config from environment
export const getSIPTrunkConfig = (): SIPTrunkConfig | null => {
  const domain = process.env.TWILIO_SIP_DOMAIN;
  const trunkSid = process.env.TWILIO_SIP_TRUNK_SID;
  const username = process.env.TWILIO_SIP_USERNAME;
  const password = process.env.TWILIO_SIP_PASSWORD;

  if (!domain || !trunkSid || !username || !password) {
    if (isDevelopment) {
      console.warn('⚠️  SIP Trunk not fully configured. Some carriers may not be supported.');
    }
    return null;
  }

  console.log('✅ SIP Trunk configured:', domain);
  return { domain, trunkSid, username, password };
};

interface TwilioToken {
  token: string;
  method?: string;
}

interface CallResponse {
  success: boolean;
  callSid: string;
  message: string;
}

interface SMSResponse {
  success: boolean;
  messageSid: string;
  message: string;
}

/**
 * Number Type Detection for Australian Numbers
 */
export enum NumberType {
  MOBILE = 'mobile',
  LANDLINE = 'landline',
  PREMIUM_1300 = 'premium_1300',  // 1300 shared-cost numbers
  PREMIUM_1800 = 'premium_1800',  // 1800 toll-free numbers
  PREMIUM_13 = 'premium_13',      // 13/1300 short numbers
  INTERNATIONAL = 'international',
  INVALID = 'invalid'
}

interface NumberValidation {
  isValid: boolean;
  type: NumberType;
  canCall: boolean;
  errorMessage?: string;
  formattedNumber: string;
}

/**
 * Detect Australian number type and validate for calling
 * @param phoneNumber - Phone number in E.164 format (+61...)
 * @returns NumberValidation object with type and calling permissions
 */
export const validatePhoneNumber = (phoneNumber: string): NumberValidation => {
  // Remove spaces and dashes
  const cleaned = phoneNumber.replace(/[\s-]/g, '');
  
  // Check if it's a valid format
  if (!cleaned.match(/^\+?[0-9]{10,15}$/)) {
    return {
      isValid: false,
      type: NumberType.INVALID,
      canCall: false,
      errorMessage: 'Invalid phone number format. Use international format (e.g., +61466123456)',
      formattedNumber: phoneNumber
    };
  }

  // Check if SIP trunk is configured for premium numbers
  const sipTrunkConfigured = !!(
    typeof process !== 'undefined' &&
    process.env.TWILIO_SIP_DOMAIN &&
    process.env.TWILIO_SIP_TRUNK_SID &&
    process.env.TWILIO_SIP_USERNAME &&
    process.env.TWILIO_SIP_PASSWORD
  );

  // Australian number detection
  if (cleaned.match(/^\+?61/)) {
    // 1300 numbers: +61 1300 xxx xxx or +61 300 xxx xxx
    // Supported via SIP Trunk, otherwise blocked by Twilio
    if (cleaned.match(/^\+?61\s?1?300/)) {
      if (sipTrunkConfigured) {
        console.log('✅ 1300 number allowed via SIP Trunk');
        return {
          isValid: true,
          type: NumberType.PREMIUM_1300,
          canCall: true,
          formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
        };
      }
      return {
        isValid: true,
        type: NumberType.PREMIUM_1300,
        canCall: false,
        errorMessage: '❌ 1300 numbers require SIP Trunk configuration. Please contact your administrator.',
        formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
      };
    }

    // 1800 toll-free numbers: +61 1800 xxx xxx or +61 800 xxx xxx
    if (cleaned.match(/^\+?61\s?1?800/)) {
      if (sipTrunkConfigured) {
        console.log('✅ 1800 number allowed via SIP Trunk');
        return {
          isValid: true,
          type: NumberType.PREMIUM_1800,
          canCall: true,
          formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
        };
      }
      return {
        isValid: true,
        type: NumberType.PREMIUM_1800,
        canCall: false,
        errorMessage: '❌ 1800 numbers require SIP Trunk configuration. Please contact your administrator.',
        formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
      };
    }

    // 13/1300 short numbers
    if (cleaned.match(/^\+?61\s?13[0-9]{4,6}$/)) {
      if (sipTrunkConfigured) {
        console.log('✅ 13xx number allowed via SIP Trunk');
        return {
          isValid: true,
          type: NumberType.PREMIUM_13,
          canCall: true,
          formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
        };
      }
      return {
        isValid: true,
        type: NumberType.PREMIUM_13,
        canCall: false,
        errorMessage: '❌ 13xx numbers require SIP Trunk configuration. Please contact your administrator.',
        formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
      };
    }

    // Australian mobile: +61 4xx xxx xxx
    if (cleaned.match(/^\+?61\s?4[0-9]{8}$/)) {
      return {
        isValid: true,
        type: NumberType.MOBILE,
        canCall: true,
        formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
      };
    }

    // Australian landline: +61 [2,3,7,8] xxxx xxxx
    if (cleaned.match(/^\+?61\s?[2378][0-9]{8}$/)) {
      return {
        isValid: true,
        type: NumberType.LANDLINE,
        canCall: true,
        formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
      };
    }
  }

  // International or other numbers
  return {
    isValid: true,
    type: NumberType.INTERNATIONAL,
    canCall: true,
    formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
  };
};

/**
 * Get Twilio access token from Vercel API
 * This token allows the frontend to use Twilio.Device
 */
export const getAccessToken = async (identity: string, retryCount = 0): Promise<string> => {
  const MAX_RETRIES = 2;
  
  try {
    console.log('🔐 Requesting token for identity:', identity);
    
    // Use relative API path - works on Vercel domain
    const response = await fetch(`${API_BASE}/api/twilio/token?identity=${encodeURIComponent(identity)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Token fetch failed with status:', response.status, error);
      if (error.debug) {
        console.error('API Debug Info:', error.debug);
      }
      throw new Error(error.error || 'Failed to get access token');
    }

    const data: TwilioToken = await response.json();
    const token = data.token;
    
    // Validate token format
    if (!token || typeof token !== 'string') {
      throw new Error('Token response is not a string');
    }

    // Validate JWT format (should have 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('❌ Invalid JWT format - expected 3 parts, got', tokenParts.length);
      throw new Error(`Invalid JWT format - expected 3 parts separated by dots, got ${tokenParts.length}`);
    }

    console.log('✅ Token received successfully');
    console.log('   Token length:', token.length);
    console.log('   Token method:', data.method || 'Unknown');
    console.log('   Token format: valid JWT (3 parts)');
    console.log('   Token preview:', token.substring(0, 50) + '...' + token.substring(token.length - 20));
    
    return token;
  } catch (error: any) {
    console.error('❌ Error getting Twilio token:', {
      message: error?.message,
      endpoint: '/api/twilio/token',
      retryCount,
      fullError: error
    });
    
    // Retry on network failures or 5xx errors
    if (retryCount < MAX_RETRIES && (error?.message?.includes('fetch') || error?.message?.includes('network'))) {
      console.log(`🔄 Retrying token request (${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return getAccessToken(identity, retryCount + 1);
    }
    
    throw error;
  }
};

/**
 * Initiate an outgoing call via REST API (alternative to Device.connect)
 * Note: For browser-based calling, use Device.connect() instead.
 * This function is kept for server-side call initiation if needed.
 */
export const initiateCall = async (phoneNumber: string, userId: string): Promise<CallResponse> => {
  try {
    // Use Vercel API route
    const response = await fetch(`${API_BASE}/api/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phoneNumber, from: userId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate call');
    }

    return await response.json();
  } catch (error) {
    console.error('Error initiating call:', error);
    throw error;
  }
};

/**
 * Send SMS message via Vercel API Route
 */
export const sendSMS = async (phoneNumber: string, message: string): Promise<SMSResponse> => {
  try {
    // Use Vercel API route
    const response = await fetch(`${API_BASE}/api/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phoneNumber, body: message })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send SMS');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

/**
 * Fetch call logs from Twilio REST API
 */
export const getCallLogs = async (params: { to?: string, from?: string, limit?: number } = {}): Promise<any[]> => {
  try {
    const query = new URLSearchParams();
    if (params.to) query.append('to', params.to);
    if (params.from) query.append('from', params.from);
    if (params.limit) query.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE}/api/twilio/list-calls?${query.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch call logs');
    }

    const data = await response.json();
    return data.calls || [];
  } catch (error) {
    console.error('Error getting call logs:', error);
    throw error;
  }
};

/**
 * Initialize Twilio Device with token
 * Follows Twilio Voice JS SDK v2 best practices from official documentation
 * Returns the Twilio Device instance
 */
export const initializeTwilioDevice = async (
  token: string,
  onIncomingCall?: (call: Call) => void
): Promise<Device> => {
  try {
    // Check if WebRTC is supported in the browser
    // Note: In v2, we assume modern browser or check manually if needed, 
    // but the SDK handles compat checks internally usually.
    // However, explicitly checking navigator is good practice.
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
       console.warn('⚠️ WebRTC might not be supported in this environment');
    }

    console.log('🔧 Setting up Twilio Device instance with token:', token?.substring(0, 30) + '...');
    if (!token || token.length === 0) {
      throw new Error('Token is required to setup Twilio Device');
    }

    // Initialize Device instance (v2 style)
    const options = {
      // Enable SDK debug logs for repro and debugging
      logLevel: 'debug' as const,
      codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
      fakeLocalDTMF: true,
      enableRingingState: true,
      allowIncomingWhileBusy: false,
      // maxAverageBitrate is not a direct option in v2 DeviceOptions root, 
      // often handled via connection constraints or it's legacy. 
      // We will omit it for standard v2 setup unless specifically required.
      logLevel: 'debug' as const
    };

    const device = new Device(token, options);

    // Register event listeners
    
    // 'registered' event replaces 'ready' in some contexts, but 'registered' 
    // means it can receive calls.
    device.on('registered', () => {
      console.log('✅ Twilio Device registered and ready for calls');
      console.log('📱 Device state:', device.state);
    });

    device.on('unregistered', () => {
      console.log('⚠️  Twilio Device unregistered');
    });

    // Register error event handler
    device.on('error', (error: any) => {
      const errorCode = error?.code;
      const errorMessage = error?.message || 'Unknown error';
      
      // Map error codes to user-friendly messages
      const errorCodeMap: {[key: number]: string} = {
        31005: 'Call rejected by carrier - number may be restricted or require premium permissions (1300/1800 numbers)',
        31204: 'Invalid JWT token - token is malformed or has expired',
        31202: 'JWT signature validation failed - token signature is invalid',
        31205: 'JWT token expired - please refresh',
        31207: 'JWT token expiration time is too long',
        31102: 'Authorization token missing from request',
        31105: 'Invalid client name/identity in token',
        31203: 'No valid account associated with this token',
        31206: 'Access token does not have the required grants',
        53000: 'Signaling connection timeout - websocket failed',
        53405: 'Media connection failed - ICE connection failed',
        31000: 'Authorization error - check Twilio account permissions',
        31002: 'Invalid phone number format',
        31003: 'Forbidden - account does not have permission to call this number',
        31201: 'Authentication failed - invalid credentials'
      };
      
      const friendlyMessage = errorCode ? errorCodeMap[errorCode] || `Twilio error ${errorCode}` : errorMessage;
      
      console.error('❌ Twilio Device error occurred:', {
        message: errorMessage,
        code: errorCode,
        friendlyMessage: friendlyMessage,
        name: error?.name,
        twilioError: error?.twilioError,
        fullError: error
      });
    });

    // 'incoming' event (v2)
    if (onIncomingCall) {
      device.on('incoming', (call: Call) => {
        console.log('📞 Incoming call received from:', call.parameters.From);
        onIncomingCall(call);
      });
    }

    // Register the device to receive calls
    console.log('📡 Registering Device...');
    await device.register();

    console.log('✅ Twilio Device initialization complete');
    return device;
  } catch (error: any) {
    const errorMessage = error?.message || (typeof error === 'string' ? error : 'Unknown error during device initialization');
    console.error('❌ Error initializing Twilio Device:', {
      message: errorMessage,
      name: error?.name,
      code: error?.code,
      fullError: error
    });
    throw error;
  }
};

