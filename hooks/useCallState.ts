import { useState, useCallback } from 'react';

export type CallState = 
  | 'idle'
  | 'dialing'
  | 'ringing'
  | 'connected'
  | 'ended'
  | 'error';

export interface CallStateData {
  state: CallState;
  duration: number;
  error: string | null;
  callHistoryId?: string;
}

export interface UseCallStateReturn {
  callState: CallStateData;
  startDialing: () => void;
  startRinging: () => void;
  connect: (callHistoryId?: string) => void;
  endCall: () => void;
  setError: (error: string) => void;
  resetState: () => void;
  incrementDuration: () => void;
}

/**
 * useCallState - Manages call state machine
 * States: idle → dialing → ringing → connected → ended
 */
export function useCallState(): UseCallStateReturn {
  const [callState, setCallState] = useState<CallStateData>({
    state: 'idle',
    duration: 0,
    error: null
  });

  const startDialing = useCallback(() => {
    setCallState({
      state: 'dialing',
      duration: 0,
      error: null
    });
  }, []);

  const startRinging = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      state: 'ringing'
    }));
  }, []);

  const connect = useCallback((callHistoryId?: string) => {
    setCallState(prev => ({
      ...prev,
      state: 'connected',
      callHistoryId
    }));
  }, []);

  const endCall = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      state: 'ended'
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setCallState(prev => ({
      ...prev,
      state: 'error',
      error
    }));
  }, []);

  const resetState = useCallback(() => {
    setCallState({
      state: 'idle',
      duration: 0,
      error: null
    });
  }, []);

  const incrementDuration = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      duration: prev.duration + 1
    }));
  }, []);

  return {
    callState,
    startDialing,
    startRinging,
    connect,
    endCall,
    setError,
    resetState,
    incrementDuration
  };
}
