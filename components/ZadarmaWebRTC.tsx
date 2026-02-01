import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader, Phone } from 'lucide-react';

interface ZadarmaWebRTCProps {
  sipLogin?: string;
  onReady?: () => void;
  onError?: (error: string) => void;
}

// Zadarma WebRTC widget script URLs (v9)
const ZADARMA_SCRIPTS = {
  lib: 'https://my.zadarma.com/webphoneWebRTCWidget/v9/js/loader-phone-lib.js?sub_v=1',
  fn: 'https://my.zadarma.com/webphoneWebRTCWidget/v9/js/loader-phone-fn.js?sub_v=1'
};

// Default SIP ID (found via /api/zadarma/list-sip)
const DEFAULT_SIP_ID = '12825';

// Widget placement
const WIDGET_POSITION = { right: '10px', bottom: '5px' };

/**
 * Zadarma WebRTC Widget Component
 * Loads the Zadarma webphone widget into the page
 * 
 * This handles browser-based WebRTC calls directly (no callback API needed)
 */
export const ZadarmaWebRTC: React.FC<ZadarmaWebRTCProps> = ({ sipLogin, onReady, onError }) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [permissionHint, setPermissionHint] = useState<string>('');
  
  // Expose dial method via window for external access from Dialer component
  React.useEffect(() => {
    (window as any).zadarmaWebRTCDial = async (phoneNumber: string) => {
      console.log('📞 ZadarmaWebRTC.dial() called with:', phoneNumber);
      
      const widgetApi = (window as any).zdrmWebrtcPhoneInterface;
      if (!widgetApi) {
        console.error('❌ Widget API not available');
        throw new Error('WebRTC widget not initialized');
      }
      
      // Ensure widget is visible and open
      showWidget();
      openWidget();
      
      // Store the number for user reference
      (window as any).zadarmaLastDialNumber = phoneNumber;
      
      // Try different methods to programmatically dial
      // Method 1: dial()
      if (typeof widgetApi.dial === 'function') {
        try {
          widgetApi.dial(phoneNumber);
          console.log('✅ Widget dial() called successfully');
          return;
        } catch (err) {
          console.error('⚠️ Widget dial() method failed:', err);
        }
      }
      
      // Method 2: makeCall()
      if (typeof widgetApi.makeCall === 'function') {
        try {
          widgetApi.makeCall(phoneNumber);
          console.log('✅ Widget makeCall() called successfully');
          return;
        } catch (err) {
          console.error('⚠️ Widget makeCall() method failed:', err);
        }
      }
      
      // Method 3: Try to inject number into widget's input field (if it exists)
      try {
        const dialerInput = document.querySelector('iframe[src*="webphoneWebRTCWidget"] ~ input, .zadarma-dialer-input, input[placeholder*="phone"], input[placeholder*="number"]');
        if (dialerInput && dialerInput instanceof HTMLInputElement) {
          dialerInput.value = phoneNumber;
          dialerInput.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('✅ Widget input field populated with:', phoneNumber);
          return;
        }
      } catch (err) {
        console.error('⚠️ Failed to inject number into input:', err);
      }
      
      // Fallback: Log message for user to dial manually
      console.warn('⚠️ Widget does not support programmatic dialing. Showing manual dial instructions...');
      throw new Error(`Please dial ${phoneNumber} manually in the Zadarma widget that opened in the bottom-right corner.`);
    };
    
    return () => {
      delete (window as any).zadarmaWebRTCDial;
      delete (window as any).zadarmaLastDialNumber;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initializeWebRTC() {
      try {
        console.log('🔑 Fetching WebRTC key...');
        setStatus('loading');

        // Use provided SIP login or default
        const sip = sipLogin || DEFAULT_SIP_ID;
        
        // Get WebRTC key from API
        const url = `/api/zadarma/webrtc-key?sip_login=${sip}`;
        console.log('📡 Calling:', url);
        
        const response = await fetch(url);
        const text = await response.text();
        
        console.log('📥 Response status:', response.status);
        console.log('📥 Response text:', text.substring(0, 200));
        
        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error('❌ Response is not JSON:', text.substring(0, 100));
          throw new Error(`Server returned non-JSON response: ${text.substring(0, 50)}...`);
        }

        if (!response.ok || !data.success) {
          throw new Error(data.error || data.message || 'Failed to get WebRTC key');
        }

        if (!mounted) return;

        console.log('✅ WebRTC key obtained');
        console.log('⏰ Key valid for:', data.expiresIn);
        console.log('🔑 Key preview:', data.key.substring(0, 20) + '...');

        // Load Zadarma scripts (v9)
        await loadZadarmaScripts();

        if (!mounted) return;

        // Initialize widget with key and SIP (with retry)
        await initializeWidgetWithRetry(data.key, sip);

        // Ensure iframe is visible and widget is opened when switching back to WebRTC
        showWidget();
        openWidget();

        // Request microphone access and surface permission status
        await requestMicrophoneAccess();
        await checkMicrophonePermission();

        setStatus('ready');
        onReady?.();
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
      hideWidget();
    };
  }, [sipLogin]);

  const loadZadarmaScripts = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded and ready
      if ((window as any).zadarmaWidgetFn && (window as any).zdrmWebrtcPhoneInterface) {
        console.log('✅ Zadarma scripts already loaded');
        resolve();
        return;
      }

      console.log('📦 Loading Zadarma scripts (v9)...');

      // Load lib script first
      const libScript = document.createElement('script');
      libScript.src = ZADARMA_SCRIPTS.lib;
      libScript.async = false; // Load synchronously to ensure order
      
      libScript.onload = () => {
        console.log('✅ Loaded loader-phone-lib.js');
        
        // Wait for lib to fully initialize before loading fn
        const waitForLib = () => {
          if ((window as any).zdrmWebrtcPhoneInterface) {
            console.log('✅ zdrmWebrtcPhoneInterface is ready');
            loadFnScript();
          } else {
            console.log('⏳ Waiting for zdrmWebrtcPhoneInterface...');
            setTimeout(waitForLib, 100);
          }
        };
        
        const loadFnScript = () => {
          // Load fn script after lib is fully initialized
          const fnScript = document.createElement('script');
          fnScript.src = ZADARMA_SCRIPTS.fn;
          fnScript.async = false;
          
          fnScript.onload = () => {
            console.log('✅ Loaded loader-phone-fn.js');
            
            // Wait for zadarmaWidgetFn to be available
            const waitForWidget = () => {
              if ((window as any).zadarmaWidgetFn) {
                console.log('✅ zadarmaWidgetFn is ready');
                resolve();
              } else {
                console.log('⏳ Waiting for zadarmaWidgetFn...');
                setTimeout(waitForWidget, 100);
              }
            };
            waitForWidget();
          };
          
          fnScript.onerror = () => {
            reject(new Error('Failed to load Zadarma fn script'));
          };
          
          document.head.appendChild(fnScript);
        };
        
        waitForLib();
      };
      
      libScript.onerror = () => {
        reject(new Error('Failed to load Zadarma lib script'));
      };
      
      document.head.appendChild(libScript);
    });
  };

  const initializeWidget = (key: string, sip: string) => {
    const zadarmaWidgetFn = (window as any).zadarmaWidgetFn;
    
    if (!zadarmaWidgetFn) {
      throw new Error('Zadarma widget function not found');
    }

    console.log('🚀 Initializing Zadarma widget...');
    console.log('   Key:', key.substring(0, 20) + '...');
    console.log('   SIP:', sip);
    
    // Initialize widget with correct parameters matching Zadarma documentation
    // zadarmaWidgetFn(key, sip, shape, language, visible, position)
    zadarmaWidgetFn(
      key,           // WebRTC key from API
      sip,           // SIP ID (e.g., "12825")
      'rounded',     // Shape: 'square' or 'rounded'
      'en',          // Language: ru, en, es, fr, de, pl, ua
      true,          // Visible
      WIDGET_POSITION  // Position object (not string!)
    );
    
    console.log('✅ Zadarma widget initialized');
  };

  const initializeWidgetWithRetry = (key: string, sip: string, retries = 3): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        initializeWidget(key, sip);
        resolve();
      } catch (error) {
        if (retries <= 0) {
          reject(error);
          return;
        }
        console.warn(`⚠️ Widget init failed, retrying... (${retries})`);
        setTimeout(() => {
          initializeWidgetWithRetry(key, sip, retries - 1)
            .then(resolve)
            .catch(reject);
        }, 300);
      }
    });
  };

  const showWidget = () => {
    const selectors = [
      'iframe[src*="webphoneWebRTCWidget"]',
      'iframe[src*="zadarma"]'
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.style.display = 'block';
        el.style.visibility = 'visible';
      });
    });
  };

  const openWidget = () => {
    const widgetApi = (window as any).zdrmWebrtcPhoneInterface;
    if (!widgetApi) return;

    const openFn = widgetApi.open || widgetApi.show || widgetApi.toggle;
    if (typeof openFn === 'function') {
      try {
        openFn.call(widgetApi);
        console.log('✅ Zadarma widget opened');
      } catch {
        // ignore
      }
    }
  };

  const checkMicrophonePermission = async () => {
    if (!('permissions' in navigator)) return;

    try {
      const status = await (navigator as any).permissions.query({ name: 'microphone' });
      if (status.state === 'denied') {
        setPermissionHint('Microphone permission is blocked. Allow mic access to hear audio.');
      } else if (status.state === 'prompt') {
        setPermissionHint('Microphone permission is not granted yet. Click the widget to allow access.');
      } else {
        setPermissionHint('');
      }
    } catch {
      // ignore
    }
  };

  const requestMicrophoneAccess = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately stop tracks; we only need to prompt for permission
      stream.getTracks().forEach((track) => track.stop());
      setPermissionHint('');
    } catch (error: any) {
      const name = error?.name || '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setPermissionHint('Microphone permission is blocked. Allow mic access to hear audio.');
      } else if (name === 'NotFoundError') {
        setPermissionHint('No microphone detected. Connect a mic to enable audio.');
      } else {
        setPermissionHint('Microphone access failed. Check browser audio settings.');
      }
    }
  };

  const hideWidget = () => {
    // Attempt to hide/close widget if API is available
    const widgetApi = (window as any).zdrmWebrtcPhoneInterface;
    if (widgetApi && typeof widgetApi.close === 'function') {
      try {
        widgetApi.close();
        console.log('✅ Zadarma widget closed via API');
      } catch {
        // ignore
      }
    }

    // Fallback: hide widget elements if present
    const selectors = [
      'iframe[src*="webphoneWebRTCWidget"]',
      'iframe[src*="zadarma"]'
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.style.display = 'none';
      });
    });
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Loader className="animate-spin text-blue-600" size={16} />
        <span className="text-sm text-blue-900">Loading Zadarma WebRTC...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-900">WebRTC Error</p>
          <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
      <Phone className="text-green-600" size={16} />
      <div className="flex-1">
        <p className="text-sm font-medium text-green-900">WebRTC Ready</p>
        <p className="text-xs text-green-700">Widget loaded. Dial numbers using the widget in bottom-right corner.</p>
        {permissionHint && (
          <p className="text-[10px] text-amber-700 mt-1">⚠️ {permissionHint}</p>
        )}
        <p className="text-[10px] text-green-600 mt-1">💡 Make sure your iPhone microphone is enabled in browser settings (⚙️ → Microphone)</p>
      </div>
    </div>
  );
};
