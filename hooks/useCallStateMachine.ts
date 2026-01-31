/**
 * useCallStateMachine - Manages call state transitions
 * Prevents invalid state combinations (e.g., muting a disconnected call)
 */

import { useReducer, useCallback } from 'react';

export type CallState = 'idle' | 'dialing' | 'ringing' | 'active' | 'ended';

export interface CallStateContext {
  state: CallState;
  phoneNumber: string;
  callDuration: number;
  isMuted: boolean;
  isHold: boolean;
  error: string | null;
  callStatus: string | null;
}

type CallAction =
  | { type: 'START_DIAL'; phoneNumber: string }
  | { type: 'CALL_RINGING' }
  | { type: 'CALL_CONNECTED' }
  | { type: 'CALL_ENDED' }
  | { type: 'CALL_FAILED'; error: string }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_HOLD' }
  | { type: 'UPDATE_DURATION'; duration: number }
  | { type: 'SET_PHONE_NUMBER'; phoneNumber: string }
  | { type: 'RESET' };

const initialState: CallStateContext = {
  state: 'idle',
  phoneNumber: '',
  callDuration: 0,
  isMuted: false,
  isHold: false,
  error: null,
  callStatus: null
};

const callStateReducer = (state: CallStateContext, action: CallAction): CallStateContext => {
  switch (action.type) {
    case 'START_DIAL':
      if (state.state !== 'idle') return state; // Can only dial from idle
      return {
        ...state,
        state: 'dialing',
        phoneNumber: action.phoneNumber,
        error: null,
        callStatus: `Dialing ${action.phoneNumber}...`
      };

    case 'CALL_RINGING':
      if (state.state !== 'dialing') return state;
      return {
        ...state,
        state: 'ringing',
        callStatus: 'Ringing...'
      };

    case 'CALL_CONNECTED':
      if (state.state !== 'ringing' && state.state !== 'dialing') return state;
      return {
        ...state,
        state: 'active',
        callStatus: 'Connected',
        callDuration: 0
      };

    case 'CALL_ENDED':
      return {
        ...state,
        state: 'ended',
        callStatus: 'Call ended',
        isMuted: false,
        isHold: false
      };

    case 'CALL_FAILED':
      return {
        ...state,
        state: 'idle',
        error: action.error,
        callStatus: null,
        isMuted: false,
        isHold: false
      };

    case 'TOGGLE_MUTE':
      // Can only mute during active call
      if (state.state !== 'active') return state;
      return {
        ...state,
        isMuted: !state.isMuted
      };

    case 'TOGGLE_HOLD':
      // Can only hold during active call
      if (state.state !== 'active') return state;
      return {
        ...state,
        isHold: !state.isHold
      };

    case 'UPDATE_DURATION':
      // Only update duration during active call
      if (state.state !== 'active') return state;
      return {
        ...state,
        callDuration: action.duration
      };

    case 'SET_PHONE_NUMBER':
      // Can only change phone number when idle
      if (state.state !== 'idle') return state;
      return {
        ...state,
        phoneNumber: action.phoneNumber
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
};

export const useCallStateMachine = () => {
  const [state, dispatch] = useReducer(callStateReducer, initialState);

  const startDial = useCallback((phoneNumber: string) => {
    dispatch({ type: 'START_DIAL', phoneNumber });
  }, []);

  const callRinging = useCallback(() => {
    dispatch({ type: 'CALL_RINGING' });
  }, []);

  const callConnected = useCallback(() => {
    dispatch({ type: 'CALL_CONNECTED' });
  }, []);

  const callEnded = useCallback(() => {
    dispatch({ type: 'CALL_ENDED' });
  }, []);

  const callFailed = useCallback((error: string) => {
    dispatch({ type: 'CALL_FAILED', error });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' });
  }, []);

  const toggleHold = useCallback(() => {
    dispatch({ type: 'TOGGLE_HOLD' });
  }, []);

  const updateDuration = useCallback((duration: number) => {
    dispatch({ type: 'UPDATE_DURATION', duration });
  }, []);

  const setPhoneNumber = useCallback((phoneNumber: string) => {
    dispatch({ type: 'SET_PHONE_NUMBER', phoneNumber });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    actions: {
      startDial,
      callRinging,
      callConnected,
      callEnded,
      callFailed,
      toggleMute,
      toggleHold,
      updateDuration,
      setPhoneNumber,
      reset
    }
  };
};
