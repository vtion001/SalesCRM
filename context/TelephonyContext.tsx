// React context for telephony provider

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ITelephonyProvider, TelephonyFactory } from '../services/telephony';
import { TelephonyProvider } from '../services/telephony/TelephonyTypes';
import { useTelephonyProvider } from '../hooks/useTelephonyProvider';

interface TelephonyContextValue {
  provider: TelephonyProvider;
  providerInstance: ITelephonyProvider | null;
  isReady: boolean;
  error: string | null;
  switchProvider: (newProvider: TelephonyProvider) => Promise<void>;
}

const TelephonyContext = createContext<TelephonyContextValue | undefined>(undefined);

interface TelephonyProviderWrapperProps {
  children: ReactNode;
}

export function TelephonyProviderWrapper({ children }: TelephonyProviderWrapperProps) {
  const { provider, setProvider } = useTelephonyProvider();
  const [providerInstance, setProviderInstance] = useState<ITelephonyProvider | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize provider on mount or when provider changes
    const initProvider = async () => {
      try {
        setIsReady(false);
        setError(null);
        
        const instance = TelephonyFactory.create(provider);
        setProviderInstance(instance);
        setIsReady(true);
        
        console.log(`✅ ${provider} provider initialized`);
      } catch (err: any) {
        setError(err.message);
        setIsReady(false);
        console.error(`❌ Failed to initialize ${provider} provider:`, err);
      }
    };

    initProvider();

    // Cleanup on unmount or provider change
    return () => {
      TelephonyFactory.destroy().catch(console.error);
    };
  }, [provider]);

  const switchProvider = async (newProvider: TelephonyProvider) => {
    try {
      setIsReady(false);
      setError(null);
      
      // Destroy current provider
      await TelephonyFactory.destroy();
      
      // Update provider selection
      setProvider(newProvider);
      
      // New provider will be initialized by useEffect
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Failed to switch provider:', err);
      throw err;
    }
  };

  const value: TelephonyContextValue = {
    provider,
    providerInstance,
    isReady,
    error,
    switchProvider
  };

  return (
    <TelephonyContext.Provider value={value}>
      {children}
    </TelephonyContext.Provider>
  );
}

export function useTelephony(): TelephonyContextValue {
  const context = useContext(TelephonyContext);
  if (context === undefined) {
    throw new Error('useTelephony must be used within TelephonyProviderWrapper');
  }
  return context;
}
