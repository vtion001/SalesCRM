/**
 * ZadarmaWidgetService - Service for managing Zadarma WebRTC widget
 * Responsibility: Initialize, control, and interact with the Zadarma widget
 */

const DEFAULT_SIP_ID = '12825';
const WIDGET_POSITION = { right: '10px', bottom: '5px' };

export interface ZadarmaWidgetConfig {
  key: string;
  sipLogin: string;
  shape?: 'square' | 'rounded';
  language?: 'ru' | 'en' | 'es' | 'fr' | 'de' | 'pl' | 'ua';
  visible?: boolean;
}

export class ZadarmaWidgetService {
  /**
   * Get WebRTC key from API
   */
  async getWebRTCKey(sipLogin?: string): Promise<{ key: string; expiresIn: string }> {
    const sip = sipLogin || DEFAULT_SIP_ID;
    const url = `/api/zadarma/webrtc-key?sip_login=${sip}`;
    
    console.log('🔑 Fetching WebRTC key...');
    console.log('📡 Calling:', url);
    
    const response = await fetch(url);
    const text = await response.text();
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response text:', text.substring(0, 200));
    
    // Parse JSON response
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

    console.log('✅ WebRTC key obtained');
    console.log('⏰ Key valid for:', data.expiresIn);
    console.log('🔑 Key preview:', data.key.substring(0, 20) + '...');

    return {
      key: data.key,
      expiresIn: data.expiresIn
    };
  }

  /**
   * Initialize the Zadarma widget
   */
  initializeWidget(config: ZadarmaWidgetConfig): void {
    const zadarmaWidgetFn = (window as any).zadarmaWidgetFn;
    
    if (!zadarmaWidgetFn) {
      throw new Error('Zadarma widget function not found');
    }

    console.log('🚀 Initializing Zadarma widget...');
    console.log('   Key:', config.key.substring(0, 20) + '...');
    console.log('   SIP:', config.sipLogin);
    
    // Initialize widget with correct parameters
    zadarmaWidgetFn(
      config.key,
      config.sipLogin,
      config.shape || 'rounded',
      config.language || 'en',
      config.visible !== false,
      WIDGET_POSITION
    );
    
    console.log('✅ Zadarma widget initialized');
  }

  /**
   * Initialize widget with retry logic
   */
  async initializeWidgetWithRetry(
    config: ZadarmaWidgetConfig,
    retries = 3
  ): Promise<void> {
    try {
      this.initializeWidget(config);
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }
      console.warn(`⚠️ Widget init failed, retrying... (${retries})`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.initializeWidgetWithRetry(config, retries - 1);
    }
  }

  /**
   * Show the widget iframe
   */
  showWidget(): void {
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
  }

  /**
   * Hide the widget iframe
   */
  hideWidget(): void {
    const widgetApi = (window as any).zdrmWebrtcPhoneInterface;
    
    // Try to close via API first
    if (widgetApi && typeof widgetApi.close === 'function') {
      try {
        widgetApi.close();
        console.log('✅ Zadarma widget closed via API');
      } catch {
        // Fallback to manual hide
      }
    }

    // Fallback: hide widget elements
    const selectors = [
      'iframe[src*="webphoneWebRTCWidget"]',
      'iframe[src*="zadarma"]'
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.style.display = 'none';
      });
    });
  }

  /**
   * Open the widget UI
   */
  openWidget(): void {
    const widgetApi = (window as any).zdrmWebrtcPhoneInterface;
    if (!widgetApi) return;

    const openFn = widgetApi.open || widgetApi.show || widgetApi.toggle;
    if (typeof openFn === 'function') {
      try {
        openFn.call(widgetApi);
        console.log('✅ Zadarma widget opened');
      } catch {
        // Ignore errors
      }
    }
  }

  /**
   * Dial a number using the widget
   */
  async dial(phoneNumber: string): Promise<void> {
    console.log('📞 ZadarmaWebRTC.dial() called with:', phoneNumber);
    
    const widgetApi = (window as any).zdrmWebrtcPhoneInterface;
    if (!widgetApi) {
      throw new Error('WebRTC widget not initialized');
    }
    
    // Ensure widget is visible and open
    this.showWidget();
    this.openWidget();
    
    // Store the number for reference
    (window as any).zadarmaLastDialNumber = phoneNumber;
    
    // Try different dial methods
    if (typeof widgetApi.dial === 'function') {
      try {
        widgetApi.dial(phoneNumber);
        console.log('✅ Widget dial() called successfully');
        return;
      } catch (err) {
        console.error('⚠️ Widget dial() method failed:', err);
      }
    }
    
    if (typeof widgetApi.makeCall === 'function') {
      try {
        widgetApi.makeCall(phoneNumber);
        console.log('✅ Widget makeCall() called successfully');
        return;
      } catch (err) {
        console.error('⚠️ Widget makeCall() method failed:', err);
      }
    }
    
    // Try to inject number into input field
    try {
      const dialerInput = document.querySelector(
        'iframe[src*="webphoneWebRTCWidget"] ~ input, .zadarma-dialer-input, input[placeholder*="phone"], input[placeholder*="number"]'
      );
      
      if (dialerInput && dialerInput instanceof HTMLInputElement) {
        dialerInput.value = phoneNumber;
        dialerInput.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('✅ Widget input field populated with:', phoneNumber);
        return;
      }
    } catch (err) {
      console.error('⚠️ Failed to inject number into input:', err);
    }
    
    // Fallback: manual dial instruction
    console.warn('⚠️ Widget does not support programmatic dialing.');
    throw new Error(
      `Please dial ${phoneNumber} manually in the Zadarma widget that opened in the bottom-right corner.`
    );
  }

  /**
   * Register global dial function
   */
  registerGlobalDialFunction(): void {
    (window as any).zadarmaWebRTCDial = (phoneNumber: string) => {
      return this.dial(phoneNumber);
    };
  }

  /**
   * Unregister global dial function
   */
  unregisterGlobalDialFunction(): void {
    delete (window as any).zadarmaWebRTCDial;
    delete (window as any).zadarmaLastDialNumber;
  }
}

// Singleton instance
export const zadarmaWidgetService = new ZadarmaWidgetService();
