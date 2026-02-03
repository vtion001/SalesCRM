import { useState, useEffect, useRef, useCallback } from 'react';
import { Lead } from '../types';
import { useTelephony } from '../context';
import { useCallState } from './useCallState';
import { useIncomingCalls } from './useIncomingCalls';
import { useLeads } from './useLeads';
import { useContacts } from './useContacts';
import { callService } from '../services/telephony/CallService';
import { callHistoryService } from '../services/telephony/CallHistoryService';
import { validatePhoneNumber } from '../services/twilioService';

export interface UseDialerReturn {
  // Phone number state
  phoneNumber: string;
  setPhoneNumber: (number: string) => void;
  
  // Call state
  isCallInProgress: boolean;
  callDuration: number;
  callStatus: string | null;
  error: string | null;
  
  // Device state
  isDeviceReady: boolean;
  deviceError: string | null;
  
  // Incoming calls
  incomingCall: any;
  
  // Actions
  handleKeyPress: (num: string) => void;
  handleMakeCall: () => Promise<void>;
  handleEndCall: () => Promise<void>;
  handleAnswerCall: () => Promise<void>;
  handleRejectCall: () => Promise<void>;
  
  // Mute/Hold
  isMuted: boolean;
  isHold: boolean;
  setIsMuted: (muted: boolean) => void;
  setIsHold: (hold: boolean) => void;
}

/**
 * useDialer - Main hook orchestrating dialer functionality
 * Manages call state, device initialization, and call operations
 */
export function useDialer(targetLead?: Lead, onLogActivity?: (activity: any) => void): UseDialerReturn {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDeviceReady, setIsDeviceReady] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);

  const { provider } = useTelephony();
  const { callState, startDialing, connect, endCall: endCallState, setError: setCallError, resetState, incrementDuration } = useCallState();
  const { incomingCall, handleIncomingCall, acceptCall, rejectCall, clearIncomingCall } = useIncomingCalls();
  const { leads } = useLeads();
  const { contacts } = useContacts();

  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync phone number with target lead
  useEffect(() => {
    if (targetLead) {
      setPhoneNumber(targetLead.phone);
    }
  }, [targetLead]);

  // Initialize device based on provider
  useEffect(() => {
    const initDevice = async () => {
      try {
        setDeviceError(null);
        setIsDeviceReady(false);

        if (provider === 'zadarma') {
          // Zadarma uses callback API - no device init needed
          setIsDeviceReady(true);
          return;
        }

        if (provider === 'twilio') {
          const userId = 'user_default';
          const device = await callService.initializeTwilioDevice(
            userId,
            (call) => handleIncomingCall(call, leads, contacts)
          );
          
          callService.setTwilioDevice(device);
          setIsDeviceReady(true);
        }
      } catch (err: any) {
        setDeviceError(err?.message || `Failed to initialize ${provider} provider`);
        setIsDeviceReady(false);
      }
    };

    initDevice();

    return () => {
      if (provider === 'twilio') {
        callService.cleanup();
      }
    };
  }, [provider, leads, contacts, handleIncomingCall]);

  // Call timer
  useEffect(() => {
    if (callState.state === 'connected') {
      callTimerRef.current = setInterval(() => {
        incrementDuration();
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callState.state, incrementDuration]);

  const handleKeyPress = useCallback((num: string) => {
    // Send DTMF if call is in progress
    if (callState.state === 'connected' && currentCall && provider === 'twilio') {
      callService.sendDTMF(currentCall, num);
    }
    // Always update display
    setPhoneNumber(prev => prev + num);
  }, [callState.state, currentCall, provider]);

  const handleMakeCall = useCallback(async () => {
    if (!phoneNumber || callState.state !== 'idle' || !isDeviceReady) return;

    setError(null);

    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid || !validation.canCall) {
      setError(validation.errorMessage || 'Invalid phone number');
      return;
    }

    startDialing();
    setCallStatus('Connecting...');

    // Log outgoing call
    const dbRecord = await callHistoryService.logOutgoingCall(
      validation.formattedNumber,
      provider,
      targetLead?.id
    );

    try {
      let result;
      
      if (provider === 'twilio') {
        result = await callService.makeTwilioCall({
          phoneNumber: validation.formattedNumber,
          provider,
          onAccept: () => {
            setCallStatus('In call');
            connect(dbRecord?.id);
          },
          onDisconnect: () => {
            handleEndCall();
          },
          onError: (error: any) => {
            let errorMsg = error.message || 'Call failed';
            if (error.code === 31005 || errorMsg.includes('31005')) {
              errorMsg = '⚠️ Call rejected by carrier. Check Twilio console logs.';
            } else if (error.code === 31003 || error.code === 31000) {
              errorMsg = '⚠️ Permission denied for this number type.';
            }
            setError(errorMsg);
            handleEndCall();
          }
        });
      } else if (provider === 'zadarma') {
        result = await callService.makeZadarmaCall({
          phoneNumber: validation.formattedNumber,
          provider
        });
        
        if (result.success) {
          setCallStatus('Zadarma calling your device...');
          connect(dbRecord?.id);
        }
      }

      if (result && !result.success) {
        setError(result.error || 'Failed to initiate call');
        resetState();
        setCallStatus(null);
        return;
      }

      if (result?.call) {
        setCurrentCall(result.call);
        if (dbRecord?.id) {
          (result.call as any)._callHistoryId = dbRecord.id;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate call');
      resetState();
      setCallStatus(null);
    }
  }, [phoneNumber, callState.state, isDeviceReady, provider, targetLead, startDialing, connect, resetState]);

  const handleEndCall = useCallback(async () => {
    // Update database with final duration
    const callHistoryId = incomingCall?.callHistoryId || callState.callHistoryId;
    
    if (callHistoryId && callState.duration > 0) {
      await callHistoryService.updateCallDuration(callHistoryId, callState.duration);
    }

    // NOTE: We do NOT log to activities table here because calls are already
    // logged to call_history table. Logging to both creates duplicate pipeline records.
    // The onLogActivity callback should only be used for non-call activities (notes, emails, etc.)

    // Cleanup
    if (currentCall) {
      callService.endCall(currentCall);
    }
    
    endCallState();
    resetState();
    setCallStatus(null);
    clearIncomingCall();
    setIsMuted(false);
    setIsHold(false);
    setCurrentCall(null);
  }, [callState, incomingCall, currentCall, endCallState, resetState, clearIncomingCall]);

  const handleAnswerCall = useCallback(async () => {
    if (!incomingCall || !currentCall) return;

    try {
      setError(null);
      setCallStatus('Connected');
      acceptCall();
      connect(incomingCall.callHistoryId);

      // Update database
      if (incomingCall.callHistoryId) {
        await callHistoryService.markCallAnswered(incomingCall.callHistoryId);
      }

      await currentCall.accept();
    } catch (err: any) {
      setError(err.message || 'Failed to answer call');
      resetState();
    }
  }, [incomingCall, currentCall, acceptCall, connect, resetState]);

  const handleRejectCall = useCallback(async () => {
    if (!currentCall) return;

    // Update database
    if (incomingCall?.callHistoryId) {
      await callHistoryService.markCallRejected(incomingCall.callHistoryId);
    }

    rejectCall();
    setCallStatus(null);
    
    try {
      currentCall.reject();
    } catch (err) {
      console.error(err);
    }
    
    setCurrentCall(null);
  }, [currentCall, incomingCall, rejectCall]);

  return {
    phoneNumber,
    setPhoneNumber,
    isCallInProgress: callState.state === 'connected' || callState.state === 'dialing',
    callDuration: callState.duration,
    callStatus,
    error,
    isDeviceReady,
    deviceError,
    incomingCall,
    handleKeyPress,
    handleMakeCall,
    handleEndCall,
    handleAnswerCall,
    handleRejectCall,
    isMuted,
    isHold,
    setIsMuted,
    setIsHold
  };
}
