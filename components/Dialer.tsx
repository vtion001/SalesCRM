import React, { useState, useEffect, useRef } from 'react';
import { MicOff, Pause, PhoneForwarded, Headphones, Phone, PhoneOff, Clock, MessageSquare, Send, ArrowDownLeft, ArrowUpRight, Ban, AlertCircle, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIALER_KEYS } from '../constants';
import { Lead, Activity } from '../types';
import { sendSMS, initializeTwilioDevice, getAccessToken } from '../services/twilioService';
import { CallHistoryList } from './CallHistoryList';

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
      } catch (err: any) {
        setDeviceError(err?.message || 'Failed to initialize Twilio Device');
      }
    };
    initDevice();
    return () => {
      if (twilioDevice) {
        try { twilioDevice.disconnectAll?.(); twilioDevice.destroy?.(); } catch (err) { console.error(err); }
      }
    };
  }, []);

  useEffect(() => {
    if (targetLead) setPhoneNumber(targetLead.phone);
  }, [targetLead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleIncomingCall = (call: any) => {
    const callData: IncomingCall = {
      id: call.parameters.CallSid || Date.now().toString(),
      from: call.parameters.From || 'Unknown',
      timestamp: new Date(),
    };
    setCurrentCall(call);
    setIncomingCall(callData);
    setCallStatus(`Incoming call from ${callData.from}`);
    call.on('disconnect', () => handleEndCall());
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
      await currentCall.accept();
    } catch (err: any) {
      setError(err.message || 'Failed to answer call');
      setIsCallInProgress(false);
    }
  };

  const handleRejectCall = () => {
    if (!currentCall) return;
    setIncomingCall(null);
    setCallStatus(null);
    try { currentCall.reject(); } catch (err) { console.error(err); }
    setCurrentCall(null);
  };

  const handleEndCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (targetLead && callDuration > 0 && onLogActivity) {
      onLogActivity({ type: 'call', title: 'Outgoing Call', description: `Completed call to ${phoneNumber}`, duration: formatDuration(callDuration), timestamp: 'Just now' });
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
    if (!phoneNumber || isCallInProgress || !isDeviceReady || !twilioDevice) return;
    setError(null);
    setIsCallInProgress(true);
    setCallDuration(0);
    setCallStatus('Connecting...');
    try {
      const params = { To: phoneNumber };
      const call = await twilioDevice.connect({ params });
      setCurrentCall(call);
      call.on('accept', () => {
         setCallStatus(`In call`);
         callTimerRef.current = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
      });
      call.on('disconnect', () => handleEndCall());
      call.on('error', (error: any) => { setError(error.message || 'Call failed'); handleEndCall(); });
    } catch (err: any) {
      setError(err.message || 'Failed to initiate call');
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
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="px-6 py-6 bg-indigo-600 shadow-2xl relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Volume2 size={24} className="text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-black text-indigo-100 uppercase tracking-widest">Incoming Call</p>
                  <p className="text-xl font-black text-white">{incomingCall.from}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAnswerCall} className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"><Phone size={20} /></button>
                <button onClick={handleRejectCall} className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"><PhoneOff size={20} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex border-b border-slate-100 p-2 bg-slate-50/50">
        {['Dialer', 'History', 'SMS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all relative rounded-xl ${
              activeTab === tab ? 'text-indigo-600 bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
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
            </motion.div>
          )}

          {activeTab === 'History' && (
            <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 overflow-hidden flex flex-col">
              <CallHistoryList targetLead={targetLead} />
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
          <div className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${isDeviceReady ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {isDeviceReady ? 'Client Ready' : 'Connecting...'}
          </span>
        </div>
        <div className="flex items-center gap-4">
           <Headphones size={14} className="text-slate-300" />
           <Volume2 size={14} className="text-slate-300" />
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