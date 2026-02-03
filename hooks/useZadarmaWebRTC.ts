import { useState, useEffect, useCallback } from 'react';
import { zadarmaScriptLoader } from '../services/telephony/ZadarmaScriptLoader';
import { zadarmaWidgetService } from '../services/telephony/ZadarmaWidgetService';
import { zadarmaAudioService, AudioStatus } from '../services/telephony/ZadarmaAudioService';

export type ZadarmaStatus = 'loading' | 'ready' | 'error';

export interface UseZadarmaWebRTCReturn {
  status: ZadarmaStatus;
  errorMessage: string;
  audioStatus: AudioStatus;
  dial: (phoneNumber: string) => Promise<void>;
}

/**
 * useZadarmaWebRTC - Main hook for Zadarma WebRTC functionality
 * Orchestrates script loading, widget initialization, and audio management
 */
export function useZadarmaWebRTC(
  sipLogin?: string,
  onReady?: () => void,
  onError?: (error: string) => void
): UseZadarmaWebRTCReturn {
  const [status, setStatus] = useState<ZadarmaStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [audioStatus, setAudioStatus] = useState<AudioStatus>({
    hasPermission: false,
    permissionState: 'unknown',
    isActive: false,
    hint: ''
  });

  // Initialize WebRTC
  useEffect(() => {
    let mounted = true;

    async function initializeWebRTC() {
      try {
        setStatus('loading');

        // Step 1: Get WebRTC key from API
        const { key, expiresIn } = await zadarmaWidgetService.getWebRTCKey(sipLogin);

        if (!mounted) return;

        // Step 2: Load Zadarma scripts
        await zadarmaScriptLoader.loadScripts();

        if (!mounted) return;

        // Step 3: Initialize widget
        await zadarmaWidgetService.initializeWidgetWithRetry({
          key,
          sipLogin: sipLogin || '12825'
        });

        // Step 4: Show and open widget
        zadarmaWidgetService.showWidget();
        zadarmaWidgetService.openWidget();

        // Step 5: Request microphone access
        const micStatus = await zadarmaAudioService.requestMicrophoneAccess();
        if (mounted) {
          setAudioStatus(micStatus);
        }

        // Step 6: Check microphone permission
        const permStatus = await zadarmaAudioService.checkMicrophonePermission();
        if (mounted) {
          setAudioStatus(prev => ({ ...prev, ...permStatus }));
        }

        // Step 7: Monitor audio connection
        zadarmaAudioService.startMonitoringWithDelay(2000, 5000, () => {
          if (mounted) {
            setAudioStatus(prev => ({ ...prev, isActive: true }));
          }
        });

        // Step 8: Register global dial function
        zadarmaWidgetService.registerGlobalDialFunction();

        if (mounted) {
          setStatus('ready');
          onReady?.();
        }
      } catch (error: any) {
        console.error('❌ WebRTC initialization error:', error);
        
        if (!mounted) return;
        
        const msg = error.message || 'Failed to initialize WebRTC';
        setErrorMessage(msg);
        setStatus('error');
        onError?.(msg);
      }
    }

    initializeWebRTC();

    return () => {
      mounted = false;
      zadarmaWidgetService.hideWidget();
      zadarmaWidgetService.unregisterGlobalDialFunction();
    };
  }, [sipLogin, onReady, onError]);

  // Dial function
  const dial = useCallback(async (phoneNumber: string) => {
    return zadarmaWidgetService.dial(phoneNumber);
  }, []);

  return {
    status,
    errorMessage,
    audioStatus,
    dial
  };
}
