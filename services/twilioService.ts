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
        31204: 'Invalid JWT token - token is malformed or has expired',
        31202: 'JWT signature validation failed - token signature is invalid',
        31205: 'JWT token expired - please refresh',
        31207: 'JWT token expiration time is too long',
        31102: 'Authorization token missing from request',
        31105: 'Invalid client name/identity in token',
        31203: 'No valid account associated with this token',
        53000: 'Signaling connection timeout - websocket failed',
        53405: 'Media connection failed - ICE connection failed'
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

