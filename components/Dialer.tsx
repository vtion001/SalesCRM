import React, { useState, useEffect, useRef } from 'react';
import { MicOff, Pause, PhoneForwarded, Headphones, Phone, PhoneOff, Clock, MessageSquare, Send, ArrowDownLeft, ArrowUpRight, Ban, AlertCircle, Volume2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIALER_KEYS } from '../constants';
import { Lead, Activity } from '../types';
import { sendSMS, initializeTwilioDevice, getAccessToken } from '../services/twilioService';
import { CallLogs } from './CallLogs';
import { useCallHistory } from '../hooks/useCallHistory';
import { useLeads } from '../hooks/useLeads';
import { useContacts } from '../hooks/useContacts';
import { supabase } from '../services/supabaseClient';
import { useTelephony } from '../context';
import { TelephonyProviderBadge, ProviderSwitcher } from './Providers';
import { ZadarmaWebRTC } from './ZadarmaWebRTC';

interface DialerProps {
  targetLead: Lead | undefined;
  onLogActivity?: (activity: Omit<Activity, 'id'>) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface IncomingCall {
  id: string;
  from: string;
  timestamp: Date;
  accepted?: boolean;
  callerName?: string;
  callerCompany?: string;
  callerAvatar?: string;
  callHistoryId?: string; // Link to database record
}

export const Dialer: React.FC<DialerProps> = ({ targetLead, onLogActivity, activeTab: propsActiveTab, onTabChange }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [internalActiveTab, setInternalActiveTab] = useState('Dialer');
  const [twilioDevice, setTwilioDevice] = useState<any>(null);
  const [isDeviceReady, setIsDeviceReady] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [missedCallCount, setMissedCallCount] = useState(0);
  const [useWebRTC, setUseWebRTC] = useState(false); // Toggle between API and WebRTC
  
  // Hooks for data access
  const { callHistory, addCallRecord, updateCallRecord } = useCallHistory(targetLead?.id);
  const { leads } = useLeads();
  const { contacts } = useContacts();
  const { provider, isReady: providerReady, switchProvider } = useTelephony();
  
  const activeTab = propsActiveTab || internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!targetLead) {
      setMessages([]);
    }
  }, [targetLead?.id]);

  useEffect(() => {
    const initDevice = async () => {
      try {
        setDeviceError(null);
        setIsDeviceReady(false);
        
        // Skip initialization if using WebRTC (widget handles everything)
        if (useWebRTC && provider === 'zadarma') {
          console.log('📞 Using Zadarma WebRTC widget - no device init needed');
          return;
        }
        
        // Only initialize the selected provider, not both
        if (provider === 'twilio') {
          console.log('📞 Initializing Twilio provider...');
          const userId = 'user_default'; 
          const token = await getAccessToken(userId);
          const device = await initializeTwilioDevice(token, handleIncomingCall);
          
          const readyPromise = new Promise<void>((resolve, reject) => {
            let hasResolved = false;
            const readyTimeout = setTimeout(() => { if (!hasResolved) { hasResolved = true; resolve(); } }, 10000);
            const onReady = () => { if (!hasResolved) { clearTimeout(readyTimeout); hasResolved = true; resolve(); } };
            const onError = (error: any) => { if (!hasResolved) { clearTimeout(readyTimeout); hasResolved = true; reject(new Error(error?.message || 'Device error')); } };
            device.on('registered', onReady);
            device.on('error', onError);
            if (device.state === 'registered') onReady();
          });

          await readyPromise;
          setTwilioDevice(device);
          setIsDeviceReady(true);
          console.log('✅ Twilio provider ready');
        } else if (provider === 'zadarma') {
          console.log('📞 Initializing Zadarma provider...');
          // Zadarma uses callback API - no device initialization needed
          // It will call our webhook, so just mark as ready
          setIsDeviceReady(true);
          console.log('✅ Zadarma provider ready');
        }
      } catch (err: any) {
        console.error('❌ Device initialization error:', err);
        setDeviceError(err?.message || `Failed to initialize ${provider} provider`);
        setIsDeviceReady(false);
      }
    };
    
    // Only initialize when provider changes
    initDevice();
    
    return () => {
      if (provider === 'twilio' && twilioDevice) {
        try { twilioDevice.disconnectAll?.(); twilioDevice.destroy?.(); } catch (err) { console.error(err); }
      }
    };
  }, [provider]);

  useEffect(() => {
    if (targetLead) setPhoneNumber(targetLead.phone);
  }, [targetLead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleIncomingCall = async (call: any) => {
    const callerNumber = call.parameters.From || 'Unknown';
    const callSid = call.parameters.CallSid || Date.now().toString();
    
    // Identify caller from leads/contacts
    let callerInfo = await identifyCaller(callerNumber);
    
    // Create database record immediately (status: ringing)
    let callHistoryId: string | undefined;
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        const dbRecord = await addCallRecord({
          lead_id: callerInfo.leadId || null, // Use null instead of empty string
          phone_number: callerNumber,
          call_type: 'incoming',
          duration_seconds: 0,
          call_sid: callSid,
          notes: 'Ringing...',
          user_id: user.user.id
        });
        callHistoryId = dbRecord?.id;
      }
    } catch (err) {
      console.error('Failed to log incoming call:', err);
    }
    
    const callData: IncomingCall = {
      id: callSid,
      from: callerNumber,
      timestamp: new Date(),
      callerName: callerInfo.name,
      callerCompany: callerInfo.company,
      callerAvatar: callerInfo.avatar,
      callHistoryId
    };
    
    setCurrentCall(call);
    setIncomingCall(callData);
    setCallStatus(`Incoming call from ${callerInfo.name || callerNumber}`);
    
    call.on('disconnect', () => handleEndCall());
  };
  
  // Identify caller from leads or contacts database
  const identifyCaller = async (phoneNumber: string): Promise<{name?: string, company?: string, avatar?: string, leadId?: string}> => {
    try {
      // Check leads first
      const matchingLead = leads.find(l => l.phone === phoneNumber);
      if (matchingLead) {
        return {
          name: matchingLead.name,
          company: matchingLead.company,
          avatar: matchingLead.avatar,
          leadId: matchingLead.id
        };
      }
      
      // Check contacts
      const matchingContact = contacts.find(c => c.phone === phoneNumber);
      if (matchingContact) {
        return {
          name: matchingContact.name,
          company: matchingContact.company,
          leadId: undefined
        };
      }
      
      return { name: 'Unknown Caller' };
    } catch (err) {
      console.error('Error identifying caller:', err);
      return { name: 'Unknown Caller' };
    }
  };

  const handleAnswerCall = async () => {
    if (!incomingCall || !currentCall) return;
    try {
      setError(null);
      setCallStatus(`Connected`);
      setIsCallInProgress(true);
      setCallDuration(0);
      setIncomingCall({ ...incomingCall, accepted: true });
      callTimerRef.current = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
      
      // Update database: call answered
      if (incomingCall.callHistoryId) {
        await updateCallRecord(incomingCall.callHistoryId, {
          notes: 'Answered'
        });
      }
      
      await currentCall.accept();
    } catch (err: any) {
      setError(err.message || 'Failed to answer call');
      setIsCallInProgress(false);
    }
  };

  const handleRejectCall = async () => {
    if (!currentCall) return;
    
    // Update database: call rejected/missed
    if (incomingCall?.callHistoryId) {
      await updateCallRecord(incomingCall.callHistoryId, {
        notes: 'Rejected',
        duration_seconds: 0
      });
      setMissedCallCount(prev => prev + 1);
    }
    
    setIncomingCall(null);
    setCallStatus(null);
    try { currentCall.reject(); } catch (err) { console.error(err); }
    setCurrentCall(null);
  };

  const handleEndCall = async () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    
    // Update database with final call duration
    const callHistoryIdToUpdate = incomingCall?.callHistoryId || (currentCall as any)?._callHistoryId;
    
    if (callHistoryIdToUpdate && callDuration > 0) {
      try {
        await updateCallRecord(callHistoryIdToUpdate, {
          duration_seconds: callDuration,
          notes: `Call completed - ${formatDuration(callDuration)}`
        });
        console.log('✅ Call duration updated in database:', callDuration, 'seconds');
      } catch (err) {
        console.error('❌ Failed to update call duration:', err);
      }
    }
    
    if (targetLead && callDuration > 0 && onLogActivity) {
      onLogActivity({ 
        type: 'call', 
        title: incomingCall ? 'Incoming Call' : 'Outgoing Call', 
        description: `Completed call ${incomingCall ? 'from' : 'to'} ${phoneNumber}`, 
        duration: formatDuration(callDuration), 
        timestamp: 'Just now' 
      });
    }
    
    setIsCallInProgress(false);
    setCallDuration(0);
    setCallStatus(null);
    setIncomingCall(null);
    setIsMuted(false);
    setIsHold(false);
    try { if (currentCall) currentCall.disconnect(); } catch (err) { console.error(err); }
    setCurrentCall(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (num: string) => setPhoneNumber(prev => prev + num);

  const handleMakeCall = async () => {
    if (!phoneNumber || isCallInProgress || !isDeviceReady) return;
    setError(null);
    
    // Import validatePhoneNumber dynamically
    const { validatePhoneNumber } = await import('../services/twilioService');
    
    // Validate phone number before attempting call
    const validation = validatePhoneNumber(phoneNumber);
    
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Invalid phone number');
      return;
    }
    
    if (!validation.canCall) {
      setError(validation.errorMessage || 'Cannot call this number type');
      return;
    }
    
    // Check provider-specific requirements
    if (provider === 'twilio' && !twilioDevice) {
      setError('Twilio device not ready');
      return;
    }
    
    setIsCallInProgress(true);
    setCallDuration(0);
    setCallStatus('Connecting...');
    
    // Log outgoing call to database
    let outgoingCallHistoryId: string | undefined;
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        const dbRecord = await addCallRecord({
          lead_id: targetLead?.id || null,
          phone_number: validation.formattedNumber,
          call_type: 'outgoing',
          duration_seconds: 0,
          notes: `Dialing via ${provider}...`,
          user_id: user.user.id
        });
        outgoingCallHistoryId = dbRecord?.id;
        console.log('📝 Outgoing call logged to database:', dbRecord?.id);
      }
    } catch (err) {
      console.error('❌ Failed to log outgoing call:', err);
    }
    
    try {
      if (provider === 'twilio') {
        // Twilio: Use device.connect()
        const params = { To: validation.formattedNumber };
        console.log('📞 Initiating Twilio call to:', validation.formattedNumber);
        console.log('📡 Using Twilio device:', twilioDevice?.state);
        
        const call = await twilioDevice!.connect({ params });
        setCurrentCall(call);
        
        if (outgoingCallHistoryId) {
          (call as any)._callHistoryId = outgoingCallHistoryId;
        }
        
        call.on('accept', () => {
          console.log('✅ Twilio call accepted');
          setCallStatus(`In call`);
          callTimerRef.current = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
        });
        
        call.on('disconnect', () => {
          console.log('📴 Twilio call disconnected');
          handleEndCall();
        });
        
        call.on('error', (error: any) => {
          let errorMsg = error.message || 'Call failed';
          console.error('❌ Twilio call error:', error);
          if (error.code === 31005 || errorMsg.includes('31005')) {
            errorMsg = '⚠️ Call rejected by carrier. Check Twilio console logs.';
          } else if (error.code === 31003 || error.code === 31000) {
            errorMsg = '⚠️ Permission denied for this number type.';
          }
          setError(errorMsg);
          handleEndCall();
        });
      } else if (provider === 'zadarma') {
        // Zadarma: Use callback API
        console.log('📞 Initiating Zadarma call to:', validation.formattedNumber);
        
        const response = await fetch('/api/zadarma/make-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: validation.formattedNumber,
            predicted: true
          })
        });
        
        // Get response text first to handle non-JSON responses
        const responseText = await response.text();
        console.log('📡 Zadarma API response status:', response.status);
        console.log('📡 Zadarma API response:', responseText.substring(0, 200));
        
        if (!response.ok) {
          // Try to parse as JSON, fallback to text error
          let errorMessage = `Failed to initiate Zadarma call (${response.status})`;
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        
        // Parse successful response
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('❌ Failed to parse Zadarma response as JSON:', responseText);
          throw new Error('Invalid response from Zadarma API: ' + responseText.substring(0, 100));
        }
        
        console.log('✅ Zadarma call initiated:', data);
        
        setCallStatus('Zadarma connecting...');
        callTimerRef.current = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
      }
    } catch (err: any) {
      let errorMsg = err.message || 'Failed to initiate call';
      console.error('❌ Exception during call initiation:', err);
      setError(errorMsg);
      setCallStatus(null);
      setIsCallInProgress(false);
      setCurrentCall(null);
    }
  };

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim() || !phoneNumber || isSending) return;
    setError(null);
    setIsSending(true);
    try {
      await sendSMS(phoneNumber, smsMessage);
      setMessages([...messages, { id: Date.now(), sender: 'me', text: smsMessage, time: 'Just now' }]);
      if (targetLead && onLogActivity) {
        onLogActivity({ type: 'email', title: 'SMS Sent', description: smsMessage, timestamp: 'Just now' });
      }
      setSmsMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send SMS');
    } finally { setIsSending(false); }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <AnimatePresence>
        {deviceError && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-rose-50 overflow-hidden border-b border-rose-100">
            <div className="px-6 py-3 flex items-start gap-3">
              <AlertCircle size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Device Offline</p>
                <p className="text-[11px] text-rose-600 font-bold leading-tight">{deviceError}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {incomingCall && !incomingCall.accepted && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="px-6 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {incomingCall.callerAvatar ? (
                  <img src={incomingCall.callerAvatar} alt={incomingCall.callerName} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30" />
                ) : (
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    {incomingCall.callerName && incomingCall.callerName !== 'Unknown Caller' ? (
                      <span className="text-xl font-black text-white">{incomingCall.callerName.charAt(0)}</span>
                    ) : (
                      <User size={24} className="text-white" />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">📞 Incoming Call</p>
                  <p className="text-xl font-black text-white leading-tight">
                    {incomingCall.callerName || 'Unknown Caller'}
                  </p>
                  {incomingCall.callerCompany && (
                    <p className="text-xs font-semibold text-white/80 mt-0.5">{incomingCall.callerCompany}</p>
                  )}
                  <p className="text-[11px] font-medium text-white/70 mt-1">{incomingCall.from}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAnswerCall} className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-emerald-600">
                  <Phone size={22} />
                </button>
                <button onClick={handleRejectCall} className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-rose-600">
                  <PhoneOff size={22} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zadarma Mode Switcher - only show for Zadarma provider */}
      {provider === 'zadarma' && activeTab === 'Dialer' && (
        <div className="px-4 pt-3 pb-2 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUseWebRTC(false)}
              className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                !useWebRTC 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              API Mode
            </button>
            <button
              onClick={() => setUseWebRTC(true)}
              className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                useWebRTC 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              WebRTC Mode
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 text-center">
            {useWebRTC ? 'Widget handles calls automatically' : 'API-based call control'}
          </p>
        </div>
      )}

      <div className="flex border-b border-slate-100 p-2 bg-slate-50/50">
        {['Dialer', 'History', 'SMS'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'History') setMissedCallCount(0); // Clear badge when viewing history
            }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all relative rounded-xl ${
              activeTab === tab ? 'text-indigo-600 bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {tab === 'History' && missedCallCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg">
                {missedCallCount > 9 ? '9+' : missedCallCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'Dialer' && (
            <motion.div 
              key="dialer" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col items-center justify-between p-10"
            >
              {/* WebRTC Mode - Show Widget Status */}
              {provider === 'zadarma' && useWebRTC ? (
                <div className="w-full flex flex-col items-center justify-center flex-1">
                  <ZadarmaWebRTC
                    sipLogin={process.env.ZADARMA_SIP_NUMBER}
                    onReady={() => {
                      setIsDeviceReady(true);
                      setDeviceError(null);
                    }}
                    onError={(err) => {
                      setDeviceError(err);
                      setIsDeviceReady(false);
                    }}
                  />
                  <div className="mt-6 text-center max-w-md">
                    <p className="text-sm text-slate-600 mb-2">
                      The Zadarma webphone widget is loaded in the bottom-right corner of your browser.
                    </p>
                    <p className="text-xs text-slate-500">
                      Click the widget to make calls, receive calls, and manage your phone settings.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Normal Dialer UI */}
                  <div className="w-full flex flex-col items-center">
                    {isCallInProgress && (
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 mb-8 border border-indigo-100">
                        <div className="relative flex">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </div>
                    In Call • {formatDuration(callDuration)}
                  </motion.div>
                )}

                <motion.div layoutId="phone-input" className="w-full text-center">
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-4xl font-black text-slate-900 text-center w-full bg-transparent outline-none mb-2 tracking-tight"
                    placeholder="000-000-0000"
                  />
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 inline-block px-3 py-1 rounded-lg">
                    {targetLead ? `${targetLead.name} • ${targetLead.company}` : 'Awaiting Selection'}
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-x-8 gap-y-6 my-10">
                {DIALER_KEYS.map(({ num, sub }) => (
                  <motion.button
                    key={num}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleKeyPress(num)}
                    className="w-16 h-16 rounded-[24px] bg-slate-50 hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200 transition-all flex flex-col items-center justify-center group active:bg-indigo-50"
                  >
                    <span className="text-2xl font-black text-slate-900 leading-none mb-1 group-active:text-indigo-600">{num}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-active:text-indigo-400">{sub}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mb-4">
                {isCallInProgress ? (
                  <motion.button 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    onClick={handleEndCall}
                    className="w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl shadow-rose-200 bg-rose-500 hover:bg-rose-600 text-white transition-all active:scale-90"
                  >
                    <PhoneOff size={32} />
                  </motion.button>
                ) : (
                  <motion.button 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    onClick={handleMakeCall}
                    disabled={!phoneNumber || !isDeviceReady}
                    className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
                      phoneNumber && isDeviceReady
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Phone size={32} />
                  </motion.button>
                )}
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-100">
                  {error}
                </motion.div>
              )}
              </>
              )}
            </motion.div>
          )}

          {activeTab === 'History' && (
            <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 overflow-hidden flex flex-col">
              <CallLogs onDial={(number) => {
                setPhoneNumber(number);
                setActiveTab('Dialer');
              }} />
            </motion.div>
          )}

          {activeTab === 'SMS' && (
            <motion.div key="sms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col h-full">
              {!targetLead ? (
                <EmptyState icon={<MessageSquare size={24} />} text="Select a lead to view messages" />
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
                    <div className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] my-4">Today</div>
                    {(messages || []).map((msg, idx) => (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm font-medium shadow-sm ${
                          msg.sender === 'me' 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                          <p className={`text-[9px] font-black uppercase tracking-widest mt-2 ${msg.sender === 'me' ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <form onSubmit={handleSendSms} className="p-6 bg-white border-t border-slate-100">
                    <div className="relative flex gap-3">
                      <input type="text" value={smsMessage} onChange={(e) => setSmsMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-6 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-[20px] outline-none text-sm font-medium transition-all" />
                      <button type="submit" disabled={!smsMessage.trim()} className="w-14 h-14 bg-indigo-600 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-indigo-600/20 disabled:opacity-30 transition-all active:scale-90"><Send size={20} /></button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-16 border-t border-slate-50 flex items-center justify-between px-8 bg-slate-50/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <TelephonyProviderBadge
            provider={provider}
            isOnline={true}
            isReady={isDeviceReady && providerReady}
          />
        </div>
        <div className="flex items-center gap-4">
          <ProviderSwitcher
            currentProvider={provider}
            onSwitch={switchProvider}
            isCallActive={isCallInProgress}
          />
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ icon, label, disabled, active, onClick }: any) => (
  <button disabled={disabled} onClick={onClick} className={`flex flex-col items-center gap-2 transition-all group ${disabled ? 'opacity-30 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600 active:scale-90'}`}>
    <div className={`w-14 h-14 rounded-[20px] border-2 flex items-center justify-center transition-all ${active ? 'border-rose-500 bg-rose-50 text-rose-600' : `border-slate-100 bg-white group-hover:border-slate-200 group-hover:shadow-lg`}`}>
      {icon}
    </div>
    <span className="text-[9px] uppercase font-black tracking-widest">{label}</span>
  </button>
);

const EmptyState = ({ icon, text }: any) => (
  <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-300">
    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100">
      {React.cloneElement(icon as React.ReactElement, { size: 32 })}
    </div>
    <p className="text-xs font-black uppercase tracking-widest">{text}</p>
  </div>
);