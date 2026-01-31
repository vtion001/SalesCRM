// Hook for managing telephony provider selection

import { useState, useEffect, useCallback } from 'react';
import { TelephonyProvider } from '../services/telephony/TelephonyTypes';

const STORAGE_KEY = 'telephony_provider';
const DEFAULT_PROVIDER: TelephonyProvider = 'twilio';

export function useTelephonyProvider() {
  const [provider, setProviderState] = useState<TelephonyProvider>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'twilio' || stored === 'zadarma') {
      return stored;
    }
    return DEFAULT_PROVIDER;
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const setProvider = useCallback((newProvider: TelephonyProvider) => {
    setProviderState(newProvider);
    localStorage.setItem(STORAGE_KEY, newProvider);
    console.log(`🔄 Telephony provider switched to: ${newProvider}`);
  }, []);

  const switchProvider = useCallback(() => {
    const newProvider: TelephonyProvider = provider === 'twilio' ? 'zadarma' : 'twilio';
    setProvider(newProvider);
    return newProvider;
  }, [provider, setProvider]);

  return {
    provider,
    setProvider,
    switchProvider,
    isInitialized
  };
}
