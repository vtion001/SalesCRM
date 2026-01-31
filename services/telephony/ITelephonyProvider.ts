// Interface for all telephony providers

import {
  CallSession,
  DeviceStatus,
  SMSResponse,
  CallLog,
  NumberValidation,
  TelephonyDevice,
  CallInstance,
  ProviderConfig
} from './TelephonyTypes';

export interface ITelephonyProvider {
  /**
   * Provider name identifier
   */
  readonly name: 'twilio' | 'zadarma';

  /**
   * Initialize the telephony device for WebRTC or callback-based calling
   * @param userId - User identifier for device registration
   * @param onIncomingCall - Callback for incoming calls
   * @returns Promise resolving to initialized device
   */
  initializeDevice(
    userId: string,
    onIncomingCall: (call: CallInstance) => void
  ): Promise<TelephonyDevice>;

  /**
   * Get current device status
   * @returns Device status including online state and errors
   */
  getDeviceStatus(): DeviceStatus;

  /**
   * Make an outgoing call
   * @param phoneNumber - Destination phone number
   * @param options - Optional call parameters (CallerID, SIP, etc.)
   * @returns Promise resolving to call session
   */
  makeCall(
    phoneNumber: string,
    options?: {
      callerId?: string;
      sip?: string;
      predicted?: boolean;
    }
  ): Promise<CallInstance>;

  /**
   * Hang up an active call
   * @param callId - Call identifier
   */
  hangupCall(callId: string): Promise<void>;

  /**
   * Answer an incoming call
   * @param callId - Call identifier
   */
  answerCall(callId: string): Promise<void>;

  /**
   * Reject an incoming call
   * @param callId - Call identifier
   */
  rejectCall(callId: string): Promise<void>;

  /**
   * Send an SMS message
   * @param to - Recipient phone number
   * @param message - Message text
   * @param from - Optional sender number
   * @returns Promise resolving to SMS response
   */
  sendSMS(to: string, message: string, from?: string): Promise<SMSResponse>;

  /**
   * Get call history/logs
   * @param params - Query parameters (date range, filters)
   * @returns Promise resolving to array of call logs
   */
  getCallLogs(params: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
  }): Promise<CallLog[]>;

  /**
   * Validate a phone number
   * @param phoneNumber - Phone number to validate
   * @returns Promise resolving to validation result
   */
  validatePhoneNumber(phoneNumber: string): Promise<NumberValidation>;

  /**
   * Cleanup and destroy provider instance
   */
  destroy(): Promise<void>;
}
