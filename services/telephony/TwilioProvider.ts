// Twilio provider wrapper implementing ITelephonyProvider interface

import {
  ITelephonyProvider,
  CallInstance,
  DeviceStatus,
  SMSResponse,
  CallLog,
  NumberValidation,
  TelephonyDevice,
  CallStatus
} from './';

// Import existing Twilio service functions (no changes to twilioService.ts)
import {
  getAccessToken,
  initializeTwilioDevice,
  sendSMS as twilioSendSMS,
  getCallLogs as twilioGetCallLogs,
  validatePhoneNumber as twilioValidatePhoneNumber
} from '../twilioService';

export class TwilioProvider implements ITelephonyProvider {
  readonly name = 'twilio' as const;
  
  private device: any = null; // Twilio Device instance
  private deviceStatus: DeviceStatus;
  private activeCall: any = null;

  constructor() {
    this.deviceStatus = {
      isOnline: false,
      isReady: false,
      provider: 'twilio'
    };
  }

  async initializeDevice(
    userId: string,
    onIncomingCall: (call: CallInstance) => void
  ): Promise<TelephonyDevice> {
    try {
      // Use existing Twilio service functions
      const token = await getAccessToken(userId);
      const device = await initializeTwilioDevice(token, (call: any) => {
        // Wrap Twilio call in our CallInstance interface
        onIncomingCall(this.wrapTwilioCall(call));
      });

      this.device = device;
      this.deviceStatus = {
        isOnline: true,
        isReady: device.state === 'registered',
        provider: 'twilio'
      };

      // Return device adapter
      return this.createDeviceAdapter(device);
    } catch (error: any) {
      this.deviceStatus = {
        isOnline: false,
        isReady: false,
        provider: 'twilio',
        error: error.message
      };
      throw error;
    }
  }

  private createDeviceAdapter(twilioDevice: any): TelephonyDevice {
    return {
      state: twilioDevice.state,
      on: twilioDevice.on.bind(twilioDevice),
      off: twilioDevice.off.bind(twilioDevice),
      destroy: async () => {
        twilioDevice.disconnectAll?.();
        twilioDevice.destroy?.();
      }
    };
  }

  private wrapTwilioCall(twilioCall: any): CallInstance {
    return {
      parameters: twilioCall.parameters,
      accept: () => twilioCall.accept(),
      reject: () => twilioCall.reject(),
      disconnect: () => twilioCall.disconnect(),
      mute: (muted: boolean) => twilioCall.mute(muted),
      hold: (hold: boolean) => {
        // Twilio Device SDK doesn't have native hold, implement via mute
        twilioCall.mute(hold);
      },
      on: twilioCall.on.bind(twilioCall)
    };
  }

  getDeviceStatus(): DeviceStatus {
    if (this.device) {
      return {
        isOnline: this.device.state !== 'offline',
        isReady: this.device.state === 'registered',
        provider: 'twilio'
      };
    }
    return { ...this.deviceStatus };
  }

  async makeCall(
    phoneNumber: string,
    options?: { callerId?: string; sip?: string; predicted?: boolean }
  ): Promise<CallInstance> {
    if (!this.device) {
      throw new Error('Device not initialized');
    }

    try {
      const params = { To: phoneNumber };
      const twilioCall = await this.device.connect({ params });
      this.activeCall = twilioCall;
      
      return this.wrapTwilioCall(twilioCall);
    } catch (error: any) {
      throw new Error(`Twilio call failed: ${error.message}`);
    }
  }

  async hangupCall(callId: string): Promise<void> {
    if (this.activeCall) {
      this.activeCall.disconnect();
      this.activeCall = null;
    }
  }

  async answerCall(callId: string): Promise<void> {
    if (this.activeCall) {
      await this.activeCall.accept();
    }
  }

  async rejectCall(callId: string): Promise<void> {
    if (this.activeCall) {
      this.activeCall.reject();
      this.activeCall = null;
    }
  }

  async sendSMS(to: string, message: string, from?: string): Promise<SMSResponse> {
    try {
      await twilioSendSMS(to, message);
      
      return {
        success: true,
        messageId: `twilio_${Date.now()}`,
        to,
        from: from || '',
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        messageId: '',
        to,
        from: from || '',
        timestamp: new Date(),
        error: error.message
      };
    }
  }

  async getCallLogs(params: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
  }): Promise<CallLog[]> {
    try {
      const twilioLogs = await twilioGetCallLogs();
      
      // Normalize Twilio logs to our CallLog interface
      return twilioLogs.map((log: any) => ({
        id: log.sid,
        callId: log.sid,
        from: log.from,
        to: log.to,
        direction: log.direction === 'inbound' ? 'inbound' : 'outbound',
        status: this.mapTwilioStatus(log.status),
        duration: parseInt(log.duration) || 0,
        cost: log.price ? Math.abs(parseFloat(log.price)) : undefined,
        currency: log.priceUnit,
        timestamp: new Date(log.dateCreated),
        recordingUrl: log.recordingUrl,
        provider: 'twilio' as const
      }));
    } catch (error: any) {
      console.error('Failed to fetch Twilio call logs:', error);
      return [];
    }
  }

  private mapTwilioStatus(status: string): CallStatus {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'busy':
        return 'busy';
      case 'no-answer':
      case 'canceled':
        return 'no-answer';
      case 'failed':
        return 'failed';
      case 'ringing':
        return 'ringing';
      case 'in-progress':
        return 'in-progress';
      default:
        return 'completed';
    }
  }

  async validatePhoneNumber(phoneNumber: string): Promise<NumberValidation> {
    const validation = twilioValidatePhoneNumber(phoneNumber);
    
    return {
      isValid: validation.isValid,
      formattedNumber: validation.formattedNumber,
      canCall: validation.canCall,
      canSMS: true, // Assume SMS capable
      numberType: validation.numberType as any,
      errorMessage: validation.errorMessage
    };
  }

  async destroy(): Promise<void> {
    if (this.device) {
      try {
        this.device.disconnectAll?.();
        this.device.destroy?.();
      } catch (error) {
        console.error('Error destroying Twilio device:', error);
      }
      this.device = null;
    }
    this.activeCall = null;
    this.deviceStatus = {
      isOnline: false,
      isReady: false,
      provider: 'twilio'
    };
  }
}
