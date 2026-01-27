/**
 * Twilio Service - Handles all Twilio API communication
 * This service bridges the frontend Dialer component with the backend Twilio API
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

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
 * Get Twilio access token from backend
 * This token allows the frontend to use Twilio.Device
 */
export const getAccessToken = async (identity: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get access token');
    }

    const data: TwilioToken = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error getting Twilio token:', error);
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
 * Returns the Twilio Device instance
 */
export const initializeTwilioDevice = async (
  token: string,
  onIncomingCall?: (call: any) => void
): Promise<any> => {
  try {
    // Dynamically import Twilio client
    const { Device } = await import('twilio-client');

    // Set event handlers
    Device.on('ready', () => {
      console.log('Twilio Device ready for calls');
    });

    Device.on('error', (error: any) => {
      console.error('Twilio Device error:', error);
    });

    if (onIncomingCall) {
      Device.on('incoming', onIncomingCall);
    }

    // Update token
    Device.updateToken(token);

    return Device;
  } catch (error) {
    console.error('Error initializing Twilio Device:', error);
    throw error;
  }
};
