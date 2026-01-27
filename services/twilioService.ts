/**
 * Twilio Service - Handles all Twilio API communication
 * This service bridges the frontend Dialer component with Vercel API Routes
 * 
 * Migration to Vercel Serverless Functions:
 * - Token endpoint: /api/twilio/token
 * - Voice TwiML: /api/twiml/voice
 * - Incoming SMS: /api/incoming-sms
 */

// Use relative API paths for Vercel deployment
// These routes are relative to the deployed Vercel domain
const API_BASE = '';  // Empty string = same origin (Vercel domain)

console.log('Twilio Service initialized for Vercel API Routes deployment');

interface TwilioToken {
  token: string;
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
export const getAccessToken = async (identity: string): Promise<string> => {
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
    console.log('   Token format: valid JWT (3 parts)');
    console.log('   Token preview:', token.substring(0, 50) + '...' + token.substring(token.length - 20));
    
    return token;
  } catch (error: any) {
    console.error('❌ Error getting Twilio token:', {
      message: error?.message,
      endpoint: '/api/twilio/token',
      fullError: error
    });
    throw error;
  }
};

/**
 * Initiate an outgoing call
 */
export const initiateCall = async (phoneNumber: string, userId: string): Promise<CallResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/call`, {
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
 * Send SMS message via Twilio
 */
export const sendSMS = async (phoneNumber: string, message: string): Promise<SMSResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/sms`, {
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
 * Follows Twilio Voice JS SDK v1 best practices from official documentation
 * Returns the Twilio Device instance
 */
export const initializeTwilioDevice = async (
  token: string,
  onIncomingCall?: (call: any) => void
): Promise<any> => {
  try {
    // Dynamically import Twilio client
    const { Device } = await import('twilio-client');

    // Check if WebRTC is supported in the browser
    console.log('🌐 Browser WebRTC support check:', Device.isSupported);
    if (!Device.isSupported) {
      throw new Error('WebRTC is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.');
    }

    console.log('🔧 Setting up Twilio Device with token:', token?.substring(0, 30) + '...');
    if (!token || token.length === 0) {
      throw new Error('Token is required to setup Twilio Device');
    }

    // IMPORTANT: Register event listeners BEFORE calling setup()
    // This ensures we catch all events including any errors during setup
    
    // Register ready event handler - triggered when device is ready
    Device.on('ready', (device: any) => {
      console.log('✅ Twilio Device ready for calls');
      console.log('📱 Device status:', device.status?.());
    });

    // Register offline event handler - triggered when connection drops
    Device.on('offline', (device: any) => {
      console.log('⚠️  Twilio Device offline - cannot make/receive calls');
      console.log('📱 Device status:', device.status?.());
    });

    // Register error event handler
    Device.on('error', (error: any) => {
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
        connection: error?.connection?.parameters,
        fullError: error
      });
    });

    // Register connect event handler - triggered when connection established
    Device.on('connect', (connection: any) => {
      console.log('✅ Twilio Connection established');
      console.log('📞 Connection parameters:', connection?.parameters);
    });

    // Register disconnect event handler - triggered when connection ends
    Device.on('disconnect', (connection: any) => {
      console.log('⚠️  Twilio Connection disconnected');
    });

    // Register cancel event handler - incoming call cancelled before accept
    Device.on('cancel', (connection: any) => {
      console.log('⚠️  Incoming call cancelled by caller');
    });

    // Register incoming event handler for receiving calls
    if (onIncomingCall) {
      Device.on('incoming', (connection: any) => {
        console.log('📞 Incoming call received from:', connection?.parameters?.From);
        onIncomingCall(connection);
      });
    }

    // NOW call setup() with token and configuration options
    // Per SDK docs: Device.setup(token, params)
    console.log('📡 Calling Device.setup() with token and configuration...');
    Device.setup(token, {
      debug: true, // Enable debug logging to console
      codecPreferences: ['opus', 'pcmu'], // Prefer Opus codec for better quality
      fakeLocalDTMF: true, // Prevent double-tone DTMF
      enableRingingState: true, // Enable ringing state for better UX
      allowIncomingWhileBusy: false, // Don't allow calls when busy
      maxAverageBitrate: 32000 // Opus bitrate
    });

    console.log('✅ Device.setup() called with configuration');

    // Verify Device status after setup
    const status = Device.status?.();
    console.log('📊 Device status after setup:', status);
    
    if (status === 'offline') {
      console.log('ℹ️  Device offline after setup - waiting for ready event or error');
    }

    console.log('✅ Twilio Device initialization complete');
    return Device;
  } catch (error: any) {
    console.error('❌ Error initializing Twilio Device:', {
      message: error?.message || error?.toString?.(),
      name: error?.name,
      code: error?.code,
      stack: error?.stack,
      fullError: error
    });
    throw error;
  }
};
