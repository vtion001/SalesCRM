/**
 * ZadarmaAudioService - Service for managing audio permissions and monitoring
 * Responsibility: Handle microphone permissions and audio connection monitoring
 */

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

export interface AudioStatus {
  hasPermission: boolean;
  permissionState: PermissionState;
  isActive: boolean;
  hint: string;
}

export class ZadarmaAudioService {
  /**
   * Check microphone permission status
   */
  async checkMicrophonePermission(): Promise<AudioStatus> {
    if (!('permissions' in navigator)) {
      return {
        hasPermission: false,
        permissionState: 'unknown',
        isActive: false,
        hint: ''
      };
    }

    try {
      const status = await (navigator as any).permissions.query({ name: 'microphone' });
      
      let hint = '';
      if (status.state === 'denied') {
        hint = 'Microphone permission is blocked. Allow mic access to hear audio.';
      } else if (status.state === 'prompt') {
        hint = 'Microphone permission is not granted yet. Click the widget to allow access.';
      }

      return {
        hasPermission: status.state === 'granted',
        permissionState: status.state,
        isActive: status.state === 'granted',
        hint
      };
    } catch (error) {
      console.error('Failed to check microphone permission:', error);
      return {
        hasPermission: false,
        permissionState: 'unknown',
        isActive: false,
        hint: ''
      };
    }
  }

  /**
   * Request microphone access
   */
  async requestMicrophoneAccess(): Promise<AudioStatus> {
    if (!navigator.mediaDevices?.getUserMedia) {
      return {
        hasPermission: false,
        permissionState: 'unknown',
        isActive: false,
        hint: 'Browser does not support microphone access'
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Immediately stop tracks; we only need to prompt for permission
      stream.getTracks().forEach((track) => track.stop());
      
      return {
        hasPermission: true,
        permissionState: 'granted',
        isActive: true,
        hint: ''
      };
    } catch (error: any) {
      const name = error?.name || '';
      let hint = '';
      
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        hint = 'Microphone permission is blocked. Allow mic access to hear audio.';
      } else if (name === 'NotFoundError') {
        hint = 'No microphone detected. Connect a mic to enable audio.';
      } else {
        hint = 'Microphone access failed. Check browser audio settings.';
      }
      
      return {
        hasPermission: false,
        permissionState: 'denied',
        isActive: false,
        hint
      };
    }
  }

  /**
   * Monitor audio levels to detect active microphone
   */
  async monitorAudioLevels(
    durationMs = 5000,
    onAudioDetected?: () => void
  ): Promise<boolean> {
    if (!navigator.mediaDevices?.getUserMedia || typeof window === 'undefined') {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false }
      });
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      microphone.connect(analyser);

      let audioDetected = false;

      // Monitor for specified duration
      const monitorInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const hasAudio = dataArray.some((value) => value > 30);
        
        if (hasAudio && !audioDetected) {
          console.log('✅ Microphone active - audio detected');
          audioDetected = true;
          onAudioDetected?.();
        }
      }, 100);

      // Cleanup after duration
      setTimeout(() => {
        clearInterval(monitorInterval);
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
      }, durationMs);

      return audioDetected;
    } catch (err) {
      console.warn('⚠️ Could not monitor audio levels:', err);
      return false;
    }
  }

  /**
   * Start audio monitoring with delay
   */
  startMonitoringWithDelay(
    delayMs = 2000,
    durationMs = 5000,
    onAudioDetected?: () => void
  ): void {
    setTimeout(() => {
      this.monitorAudioLevels(durationMs, onAudioDetected);
    }, delayMs);
  }
}

// Singleton instance
export const zadarmaAudioService = new ZadarmaAudioService();
