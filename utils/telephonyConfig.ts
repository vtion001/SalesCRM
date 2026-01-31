// Telephony configuration utilities

import { TelephonyProvider } from '../services/telephony/TelephonyTypes';

export function getCurrentProvider(): TelephonyProvider {
  const stored = localStorage.getItem('telephony_provider');
  if (stored === 'twilio' || stored === 'zadarma') {
    return stored;
  }
  
  // Check environment variable
  const envProvider = import.meta.env.VITE_TELEPHONY_PROVIDER;
  if (envProvider === 'zadarma') {
    return 'zadarma';
  }
  
  return 'twilio'; // Default
}

export function setCurrentProvider(provider: TelephonyProvider): void {
  localStorage.setItem('telephony_provider', provider);
}

export function isProviderAvailable(provider: TelephonyProvider): boolean {
  switch (provider) {
    case 'twilio':
      return !!(
        import.meta.env.VITE_TWILIO_ACCOUNT_SID &&
        import.meta.env.VITE_TWILIO_AUTH_TOKEN
      );
    case 'zadarma':
      // Zadarma credentials are server-side only, always available
      return true;
    default:
      return false;
  }
}

export function getProviderDisplayName(provider: TelephonyProvider): string {
  switch (provider) {
    case 'twilio':
      return 'Twilio';
    case 'zadarma':
      return 'Zadarma';
    default:
      return provider;
  }
}

export function getProviderLogo(provider: TelephonyProvider): string {
  switch (provider) {
    case 'twilio':
      return '🔴'; // Twilio red dot
    case 'zadarma':
      return '🟢'; // Zadarma green dot
    default:
      return '📞';
  }
}
