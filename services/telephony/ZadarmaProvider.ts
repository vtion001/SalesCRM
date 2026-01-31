// Zadarma telephony provider implementation

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

export class ZadarmaProvider implements ITelephonyProvider {
  readonly name = 'zadarma' as const;
  
  private device: TelephonyDevice | null = null;
  private deviceStatus: DeviceStatus;
  private activeCall: CallInstance | null = null;

  constructor() {
    this.deviceStatus = {
      isOnline: false,
      isReady: false,
      provider: 'zadarma'
    };
  }

  async initializeDevice(
    userId: string,
    onIncomingCall: (call: CallInstance) => void
  ): Promise<TelephonyDevice> {
    try {
      // Initialize Zadarma device using callback method
      // This will use Supabase realtime subscriptions for incoming call notifications
      const response = await fetch('/api/zadarma/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize Zadarma device: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Create device adapter that listens to Supabase for incoming calls
      this.device = await this.createDeviceAdapter(userId, onIncomingCall);
      
      this.deviceStatus = {
        isOnline: true,
        isReady: true,
        provider: 'zadarma'
      };

      return this.device;
    } catch (error: any) {
      this.deviceStatus = {
        isOnline: false,
        isReady: false,
        provider: 'zadarma',
        error: error.message
      };
      throw error;
    }
  }

  private async createDeviceAdapter(
    userId: string,
    onIncomingCall: (call: CallInstance) => void
  ): Promise<TelephonyDevice> {
    const eventHandlers = new Map<string, Function[]>();
    
    const device: TelephonyDevice = {
      state: 'registered',
      
      on(event: string, handler: Function) {
        if (!eventHandlers.has(event)) {
          eventHandlers.set(event, []);
        }
        eventHandlers.get(event)?.push(handler);
      },
      
      off(event: string, handler?: Function) {
        if (!handler) {
          eventHandlers.delete(event);
          return;
        }
        const handlers = eventHandlers.get(event);
        if (handlers) {
          const index = handlers.indexOf(handler);
          if (index > -1) handlers.splice(index, 1);
        }
      },
      
      async destroy() {
        eventHandlers.clear();
      }
    };

    // Emit ready event
    setTimeout(() => {
      const readyHandlers = eventHandlers.get('ready');
      readyHandlers?.forEach(handler => handler());
    }, 100);

    return device;
  }

  getDeviceStatus(): DeviceStatus {
    return { ...this.deviceStatus };
  }

  async makeCall(
    phoneNumber: string,
    options?: { callerId?: string; sip?: string; predicted?: boolean }
  ): Promise<CallInstance> {
    try {
      // Use Zadarma callback API to make call
      const response = await fetch('/api/zadarma/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          from: options?.sip || options?.callerId,
          predicted: options?.predicted || false
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to make call: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Create call instance
      const call = this.createCallInstance(data.callId, phoneNumber);
      this.activeCall = call;
      
      return call;
    } catch (error: any) {
      throw new Error(`Zadarma call failed: ${error.message}`);
    }
  }

  private createCallInstance(callId: string, phoneNumber: string): CallInstance {
    const eventHandlers = new Map<string, Function[]>();
    
    return {
      parameters: {
        CallSid: callId,
        From: '',
        To: phoneNumber
      },
      
      async accept() {
        const handlers = eventHandlers.get('accept');
        handlers?.forEach(handler => handler());
      },
      
      async reject() {
        await fetch('/api/zadarma/reject-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callId })
        });
      },
      
      async disconnect() {
        await fetch('/api/zadarma/hangup-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callId })
        });
        const handlers = eventHandlers.get('disconnect');
        handlers?.forEach(handler => handler());
      },
      
      mute(muted: boolean) {
        // Zadarma callback method doesn't support mute
        console.warn('Zadarma callback method does not support mute');
      },
      
      hold(hold: boolean) {
        // Zadarma callback method doesn't support hold
        console.warn('Zadarma callback method does not support hold');
      },
      
      on(event: string, handler: Function) {
        if (!eventHandlers.has(event)) {
          eventHandlers.set(event, []);
        }
        eventHandlers.get(event)?.push(handler);
      }
    };
  }

  async hangupCall(callId: string): Promise<void> {
    if (this.activeCall) {
      await this.activeCall.disconnect();
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
      await this.activeCall.reject();
      this.activeCall = null;
    }
  }

  async sendSMS(to: string, message: string, from?: string): Promise<SMSResponse> {
    try {
      const response = await fetch('/api/zadarma/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message, from })
      });

      if (!response.ok) {
        throw new Error(`Failed to send SMS: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        messageId: data.messageId || Date.now().toString(),
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
      const queryParams = new URLSearchParams();
      
      if (params.startDate) {
        queryParams.append('start', this.formatDate(params.startDate));
      }
      if (params.endDate) {
        queryParams.append('end', this.formatDate(params.endDate));
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params.skip) {
        queryParams.append('skip', params.skip.toString());
      }

      const response = await fetch(`/api/zadarma/call-logs?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch call logs: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.calls.map((call: any) => this.normalizeCallLog(call));
    } catch (error: any) {
      console.error('Failed to fetch Zadarma call logs:', error);
      return [];
    }
  }

  private normalizeCallLog(zadarmaCall: any): CallLog {
    return {
      id: zadarmaCall.id,
      callId: zadarmaCall.call_id || zadarmaCall.id,
      from: zadarmaCall.from,
      to: zadarmaCall.to,
      direction: zadarmaCall.direction === 'out' ? 'outbound' : 'inbound',
      status: this.mapZadarmaStatus(zadarmaCall.disposition),
      duration: zadarmaCall.billseconds || 0,
      cost: zadarmaCall.billcost,
      currency: zadarmaCall.currency,
      timestamp: new Date(zadarmaCall.callstart),
      recordingUrl: zadarmaCall.recording_url,
      provider: 'zadarma'
    };
  }

  private mapZadarmaStatus(disposition: string): CallStatus {
    switch (disposition?.toLowerCase()) {
      case 'answered':
        return 'completed';
      case 'busy':
        return 'busy';
      case 'cancel':
      case 'no answer':
        return 'no-answer';
      case 'failed':
        return 'failed';
      default:
        return 'completed';
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  async validatePhoneNumber(phoneNumber: string): Promise<NumberValidation> {
    try {
      const response = await fetch('/api/zadarma/validate-number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      if (!response.ok) {
        return {
          isValid: false,
          formattedNumber: phoneNumber,
          canCall: false,
          canSMS: false,
          errorMessage: 'Validation failed'
        };
      }

      const data = await response.json();
      
      return {
        isValid: data.isValid,
        formattedNumber: data.formattedNumber || phoneNumber,
        canCall: data.canCall !== false,
        canSMS: data.canSMS !== false,
        numberType: data.numberType,
        country: data.country
      };
    } catch (error: any) {
      return {
        isValid: false,
        formattedNumber: phoneNumber,
        canCall: false,
        canSMS: false,
        errorMessage: error.message
      };
    }
  }

  async destroy(): Promise<void> {
    if (this.device) {
      await this.device.destroy();
      this.device = null;
    }
    this.activeCall = null;
    this.deviceStatus = {
      isOnline: false,
      isReady: false,
      provider: 'zadarma'
    };
  }
}
