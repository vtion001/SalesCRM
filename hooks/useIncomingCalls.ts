import { useState, useCallback } from 'react';
import { Lead, Contact } from '../types';
import { callerIdentificationService, CallerInfo } from '../services/telephony/CallerIdentificationService';
import { callHistoryService } from '../services/telephony/CallHistoryService';

export interface IncomingCall {
  id: string;
  from: string;
  timestamp: Date;
  accepted?: boolean;
  callerName?: string;
  callerCompany?: string;
  callerAvatar?: string;
  callHistoryId?: string;
}

export interface UseIncomingCallsReturn {
  incomingCall: IncomingCall | null;
  handleIncomingCall: (call: any, leads: Lead[], contacts: Contact[]) => Promise<void>;
  acceptCall: () => void;
  rejectCall: () => void;
  clearIncomingCall: () => void;
}

/**
 * useIncomingCalls - Manages incoming call state and caller identification
 */
export function useIncomingCalls(): UseIncomingCallsReturn {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);

  const handleIncomingCall = useCallback(async (
    call: any,
    leads: Lead[],
    contacts: Contact[]
  ) => {
    const callerNumber = call.parameters?.From || 'Unknown';
    const callSid = call.parameters?.CallSid || Date.now().toString();

    // Identify caller
    const callerInfo = await callerIdentificationService.identifyCaller(
      callerNumber,
      leads,
      contacts
    );

    // Log to database
    const dbRecord = await callHistoryService.logIncomingCall(
      callerNumber,
      callSid,
      callerInfo.leadId
    );

    const callData: IncomingCall = {
      id: callSid,
      from: callerNumber,
      timestamp: new Date(),
      callerName: callerInfo.name,
      callerCompany: callerInfo.company,
      callerAvatar: callerInfo.avatar,
      callHistoryId: dbRecord?.id
    };

    setIncomingCall(callData);
  }, []);

  const acceptCall = useCallback(() => {
    setIncomingCall(prev => 
      prev ? { ...prev, accepted: true } : null
    );
  }, []);

  const rejectCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  const clearIncomingCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  return {
    incomingCall,
    handleIncomingCall,
    acceptCall,
    rejectCall,
    clearIncomingCall
  };
}
