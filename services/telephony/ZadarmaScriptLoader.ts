/**
 * ZadarmaScriptLoader - Service for loading Zadarma WebRTC scripts
 * Responsibility: Load and manage third-party Zadarma scripts
 */

const ZADARMA_SCRIPTS = {
  lib: 'https://my.zadarma.com/webphoneWebRTCWidget/v9/js/loader-phone-lib.js?sub_v=1',
  fn: 'https://my.zadarma.com/webphoneWebRTCWidget/v9/js/loader-phone-fn.js?sub_v=1'
};

export class ZadarmaScriptLoader {
  private scriptsLoaded = false;

  /**
   * Check if Zadarma scripts are already loaded
   */
  isLoaded(): boolean {
    return !!(
      (window as any).zadarmaWidgetFn &&
      (window as any).zdrmWebrtcPhoneInterface
    );
  }

  /**
   * Load Zadarma WebRTC scripts in correct order
   */
  async loadScripts(): Promise<void> {
    if (this.isLoaded()) {
      console.log('✅ Zadarma scripts already loaded');
      return;
    }

    console.log('📦 Loading Zadarma scripts (v9)...');

    // Load lib script first
    await this.loadLibScript();
    
    // Wait for lib to initialize
    await this.waitForLibInterface();
    
    // Load fn script
    await this.loadFnScript();
    
    // Wait for widget function
    await this.waitForWidgetFunction();
    
    this.scriptsLoaded = true;
    console.log('✅ All Zadarma scripts loaded successfully');
  }

  /**
   * Load the lib script
   */
  private loadLibScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const libScript = document.createElement('script');
      libScript.src = ZADARMA_SCRIPTS.lib;
      libScript.async = false;
      
      libScript.onload = () => {
        console.log('✅ Loaded loader-phone-lib.js');
        resolve();
      };
      
      libScript.onerror = () => {
        reject(new Error('Failed to load Zadarma lib script'));
      };
      
      document.head.appendChild(libScript);
    });
  }

  /**
   * Load the fn script
   */
  private loadFnScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fnScript = document.createElement('script');
      fnScript.src = ZADARMA_SCRIPTS.fn;
      fnScript.async = false;
      
      fnScript.onload = () => {
        console.log('✅ Loaded loader-phone-fn.js');
        resolve();
      };
      
      fnScript.onerror = () => {
        reject(new Error('Failed to load Zadarma fn script'));
      };
      
      document.head.appendChild(fnScript);
    });
  }

  /**
   * Wait for zdrmWebrtcPhoneInterface to be available
   */
  private waitForLibInterface(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if ((window as any).zdrmWebrtcPhoneInterface) {
          console.log('✅ zdrmWebrtcPhoneInterface is ready');
          resolve();
        } else {
          console.log('⏳ Waiting for zdrmWebrtcPhoneInterface...');
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  /**
   * Wait for zadarmaWidgetFn to be available
   */
  private waitForWidgetFunction(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if ((window as any).zadarmaWidgetFn) {
          console.log('✅ zadarmaWidgetFn is ready');
          resolve();
        } else {
          console.log('⏳ Waiting for zadarmaWidgetFn...');
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  /**
   * Cleanup loaded scripts
   */
  cleanup(): void {
    // Remove script tags
    document.querySelectorAll('script[src*="zadarma"]').forEach(script => {
      script.remove();
    });
    
    // Clean up global variables
    delete (window as any).zadarmaWidgetFn;
    delete (window as any).zdrmWebrtcPhoneInterface;
    
    this.scriptsLoaded = false;
  }
}

// Singleton instance
export const zadarmaScriptLoader = new ZadarmaScriptLoader();
