import { Device } from '@twilio/voice-sdk';
import { initializeTwilioDevice, getAccessToken } from '../twilioService';

export interface CallParams {
  phoneNumber: string;
  provider: 'twilio' | 'zadarma';
  onAccept?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export interface CallResult {
  success: boolean;
  call?: any;
  error?: string;
}

/**
 * CallService - Handles call initiation and management across providers
 * Responsibility: Execute call operations via provider APIs
 */
export class CallService {
  private twilioDevice: Device | null = null;

  /**
   * Initialize Twilio device for making calls
   */
  async initializeTwilioDevice(
    userId: string,
    onIncomingCall: (call: any) => void
  ): Promise<Device> {
    try {
      const token = await getAccessToken(userId);
      const device = await initializeTwilioDevice(token, onIncomingCall);
      
      return new Promise<Device>((resolve, reject) => {
        let hasResolved = false;
        const readyTimeout = setTimeout(() => {
          if (!hasResolved) {
            hasResolved = true;
            resolve(device);
          }
        }, 10000);

        const onReady = () => {
          if (!hasResolved) {
            clearTimeout(readyTimeout);
            hasResolved = true;
            resolve(device);
          }
        };

        const onError = (error: any) => {
          if (!hasResolved) {
            clearTimeout(readyTimeout);
            hasResolved = true;
            reject(new Error(error?.message || 'Device error'));
          }
        };

        device.on('registered', onReady);
        device.on('error', onError);
        
        if (device.state === 'registered') {
          onReady();
        }
      });
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to initialize Twilio device');
    }
  }

  /**
   * Set the Twilio device instance
   */
  setTwilioDevice(device: Device | null): void {
    this.twilioDevice = device;
  }

  /**
   * Initiate a call via Twilio
   */
  async makeTwilioCall(params: CallParams): Promise<CallResult> {
    if (!this.twilioDevice) {
      return {
        success: false,
        error: 'Twilio device not initialized'
      };
    }

    try {
      const callParams = { To: params.phoneNumber };
      const call = await this.twilioDevice.connect({ params: callParams });

      // Attach event listeners
      if (params.onAccept) {
        call.on('accept', params.onAccept);
      }

      if (params.onDisconnect) {
        call.on('disconnect', params.onDisconnect);
      }

      if (params.onError) {
        call.on('error', params.onError);
      }

      return {
        success: true,
        call
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to initiate Twilio call'
      };
    }
  }

  /**
   * Initiate a call via Zadarma callback API
   */
  async makeZadarmaCall(params: CallParams): Promise<CallResult> {
    try {
      const response = await fetch('/api/zadarma/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: params.phoneNumber,
          predicted: true
        })
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `Zadarma API error (${response.status})`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        return {
          success: false,
          error: errorMessage
        };
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        return {
          success: false,
          error: 'Invalid response from Zadarma API'
        };
      }

      return {
        success: true,
        call: data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to initiate Zadarma call'
      };
    }
  }

  /**
   * Send DTMF tones during an active call
   */
  sendDTMF(call: any, digits: string): boolean {
    try {
      if (call && typeof call.sendDigits === 'function') {
        call.sendDigits(digits);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to send DTMF:', error);
      return false;
    }
  }

  /**
   * End an active call
   */
  endCall(call: any): void {
    try {
      if (call && typeof call.disconnect === 'function') {
        call.disconnect();
      }
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  }

  /**
   * Cleanup Twilio device
   */
  cleanup(): void {
    if (this.twilioDevice) {
      try {
        this.twilioDevice.disconnectAll?.();
        this.twilioDevice.destroy?.();
      } catch (error) {
        console.error('Failed to cleanup Twilio device:', error);
      }
      this.twilioDevice = null;
    }
  }
}

// Singleton instance
export const callService = new CallService();
