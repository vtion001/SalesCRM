import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader, Phone } from 'lucide-react';

interface ZadarmaWebRTCProps {
  sipLogin?: string;
  onReady?: () => void;
  onError?: (error: string) => void;
}

/**
 * Zadarma WebRTC Widget Component
 * Loads the Zadarma webphone widget into the page
 * 
 * This is a simpler alternative to the REST API - the widget handles all call logic
 */
export const ZadarmaWebRTC: React.FC<ZadarmaWebRTCProps> = ({ sipLogin, onReady, onError }) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [webrtcKey, setWebrtcKey] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    async function initializeWebRTC() {
      try {
        console.log('🔑 Fetching WebRTC key...');
        setStatus('loading');

        // Get WebRTC key from dedicated endpoint (not the router)
        const params = new URLSearchParams();
        if (sipLogin) params.set('sip_login', sipLogin);

        const url = `/api/zadarma/webrtc-key?${params}`;
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
        setWebrtcKey(data.key);

        // Load Zadarma scripts
        await loadZadarmaScripts(data.widget.scriptUrl, data.widget.fnUrl);

        if (!mounted) return;

        // Initialize widget
        initializeWidget(data.key, data.sip_login);

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
    };
  }, [sipLogin]);

  const loadZadarmaScripts = (scriptUrl: string, fnUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).zadarmaWidgetFn) {
        resolve();
        return;
      }

      // Load lib script
      const libScript = document.createElement('script');
      libScript.src = scriptUrl;
      libScript.async = true;
      
      libScript.onload = () => {
        // Load fn script
        const fnScript = document.createElement('script');
        fnScript.src = fnUrl;
        fnScript.async = true;
        
        fnScript.onload = () => {
          console.log('✅ Zadarma scripts loaded');
          resolve();
        };
        
        fnScript.onerror = () => {
          reject(new Error('Failed to load Zadarma fn script'));
        };
        
        document.head.appendChild(fnScript);
      };
      
      libScript.onerror = () => {
        reject(new Error('Failed to load Zadarma lib script'));
      };
      
      document.head.appendChild(libScript);
    });
  };

  const initializeWidget = (key: string, login: string) => {
    const zadarmaWidgetFn = (window as any).zadarmaWidgetFn;
    
    if (!zadarmaWidgetFn) {
      throw new Error('Zadarma widget function not found');
    }

    console.log('🚀 Initializing Zadarma widget...');
    
    // Initialize widget
    // Parameters: key, login, style (square|rounded), language, isVisible, position
    zadarmaWidgetFn(
      key,
      login,
      'square',
      'en',
      true,
      "{right:'20px',bottom:'100px'}" // Position above our dialer
    );
    
    console.log('✅ Zadarma widget initialized');
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
        <p className="text-xs text-green-700">Widget loaded in bottom-right corner</p>
      </div>
    </div>
  );
};
