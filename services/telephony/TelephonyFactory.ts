// Telephony provider factory

import { ITelephonyProvider } from './ITelephonyProvider';
import { TwilioProvider } from './TwilioProvider';
import { ZadarmaProvider } from './ZadarmaProvider';
import { TelephonyProvider } from './TelephonyTypes';

export class TelephonyFactory {
  private static instance: ITelephonyProvider | null = null;

  /**
   * Create and return a telephony provider instance
   * @param provider - Provider name ('twilio' or 'zadarma')
   * @returns ITelephonyProvider instance
   */
  static create(provider: TelephonyProvider): ITelephonyProvider {
    // Clean up existing instance if switching providers
    if (this.instance && this.instance.name !== provider) {
      this.instance.destroy().catch(console.error);
      this.instance = null;
    }

    // Return existing instance if same provider
    if (this.instance && this.instance.name === provider) {
      return this.instance;
    }

    // Create new instance
    switch (provider) {
      case 'twilio':
        this.instance = new TwilioProvider();
        break;
      case 'zadarma':
        this.instance = new ZadarmaProvider();
        break;
      default:
        throw new Error(`Unknown telephony provider: ${provider}`);
    }

    return this.instance;
  }

  /**
   * Get the currently active provider instance
   */
  static getInstance(): ITelephonyProvider | null {
    return this.instance;
  }

  /**
   * Destroy the current provider instance
   */
  static async destroy(): Promise<void> {
    if (this.instance) {
      await this.instance.destroy();
      this.instance = null;
    }
  }
}
