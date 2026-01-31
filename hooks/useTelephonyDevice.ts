/**
 * useTelephonyDevice - Abstracts Twilio device operations
 * Separates telephony logic from UI components
 */

import { useState, useEffect, useCallback } from 'react';
import { getAccessToken, initializeTwilioDevice } from '../services/twilioService';

export interface TelephonyDeviceState {
  device: any | null;
  isReady: boolean;
  error: string | null;
  currentCall: any | null;
}

export const useTelephonyDevice = (onIncomingCall?: (call: any) => void) => {
  const [deviceState, setDeviceState] = useState<TelephonyDeviceState>({
    device: null,
    isReady: false,
    error: null,
    currentCall: null
  });

  useEffect(() => {
    let isMounted = true;

    const initDevice = async () => {
      try {
        setDeviceState(prev => ({ ...prev, error: null, isReady: false }));
        
        const userId = 'user_default';
        const token = await getAccessToken(userId);
        const device = await initializeTwilioDevice(token, onIncomingCall);

        const readyPromise = new Promise<void>((resolve, reject) => {
          let hasResolved = false;
          const readyTimeout = setTimeout(() => {
            if (!hasResolved) {
              hasResolved = true;
              resolve();
            }
          }, 10000);

          const onReady = () => {
            if (!hasResolved) {
              clearTimeout(readyTimeout);
              hasResolved = true;
              resolve();
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

          if (device.state === 'registered') onReady();
        });

        await readyPromise;

        if (isMounted) {
          setDeviceState({
            device,
            isReady: true,
            error: null,
            currentCall: null
          });
        }
      } catch (err: any) {
        if (isMounted) {
          setDeviceState(prev => ({
            ...prev,
            error: err?.message || 'Failed to initialize Twilio Device',
            isReady: false
          }));
        }
      }
    };

    initDevice();

    return () => {
      isMounted = false;
      if (deviceState.device) {
        try {
          deviceState.device.disconnectAll?.();
          deviceState.device.destroy?.();
        } catch (err) {
          console.error('Error cleaning up Twilio device:', err);
        }
      }
    };
  }, [onIncomingCall]);

  const makeCall = useCallback(async (phoneNumber: string) => {
    if (!deviceState.device || !deviceState.isReady) {
      throw new Error('Device not ready');
    }

    try {
      const call = await deviceState.device.connect({ params: { To: phoneNumber } });
      setDeviceState(prev => ({ ...prev, currentCall: call }));
      return call;
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to make call');
    }
  }, [deviceState.device, deviceState.isReady]);

  const hangup = useCallback(() => {
    if (deviceState.currentCall) {
      deviceState.currentCall.disconnect();
      setDeviceState(prev => ({ ...prev, currentCall: null }));
    }
  }, [deviceState.currentCall]);

  const acceptCall = useCallback((call: any) => {
    call.accept();
    setDeviceState(prev => ({ ...prev, currentCall: call }));
  }, []);

  const rejectCall = useCallback((call: any) => {
    call.reject();
  }, []);

  return {
    ...deviceState,
    makeCall,
    hangup,
    acceptCall,
    rejectCall
  };
};
