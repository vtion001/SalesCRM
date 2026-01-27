import React, { useState, useEffect, useRef } from 'react';
import { MicOff, Pause, PhoneForwarded, Headphones, Phone, PhoneOff, Clock, MessageSquare, Send, ArrowDownLeft, ArrowUpRight, Ban, AlertCircle, Volume2 } from 'lucide-react';
import { DIALER_KEYS } from '../constants';
import { Lead } from '../types';
import { initiateCall, sendSMS, initializeTwilioDevice, getAccessToken } from '../services/twilioService';

interface DialerProps {
  targetLead: Lead | undefined;
}

interface IncomingCall {
  id: string;
  from: string;
  timestamp: Date;
  accepted?: boolean;
}

export const Dialer: React.FC<DialerProps> = ({ targetLead }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeTab, setActiveTab] = useState('Dialer');
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Twilio Device on component mount
  useEffect(() => {
    const initDevice = async () => {
      try {
        setDeviceError(null);
        const userId = targetLead?.id || 'user-' + Date.now().toString();
        const token = await getAccessToken(userId);
        const device = await initializeTwilioDevice(token, handleIncomingCall);
        setTwilioDevice(device);
        setIsDeviceReady(true);
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to initialize Twilio Device';
        setDeviceError(errorMsg);
        console.error('Device initialization error:', err);
      }
    };

    initDevice();

    return () => {
      if (twilioDevice) {
        try {
          twilioDevice.disconnectAll?.();
        } catch (err) {
          console.error('Error disconnecting device:', err);
        }
      }
    };
  }, []);

  // Update phone number when target lead changes
  useEffect(() => {
    if (targetLead) {
      setPhoneNumber(targetLead.phone);
      setMessages([]);
    } else {
      setPhoneNumber('');
      setMessages([]);
    }
  }, [targetLead]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  // Handle incoming calls
  const handleIncomingCall = (call: any) => {
    const callData: IncomingCall = {
      id: call.sid || Date.now().toString(),
      from: call.parameters?.From || 'Unknown',
      timestamp: new Date(),
    };
    setIncomingCall(callData);
    setCallStatus(`Incoming call from ${callData.from}`);
  };

  // Answer incoming call
  const handleAnswerCall = async () => {
    if (!incomingCall || !twilioDevice) return;

    try {
      setError(null);
      setCallStatus(`Connected to ${incomingCall.from}`);
      setIsCallInProgress(true);
      setCallDuration(0);
      setIncomingCall({ ...incomingCall, accepted: true });

      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      await twilioDevice.activeCall?.accept?.();
    } catch (err: any) {
      setError(err.message || 'Failed to answer call');
      setIsCallInProgress(false);
    }
  };

  // Reject incoming call
  const handleRejectCall = () => {
    if (!incomingCall) return;
    setIncomingCall(null);
    setCallStatus(null);
    try {
      twilioDevice?.activeCall?.reject?.();
    } catch (err) {
      console.error('Error rejecting call:', err);
    }
  };

  // End active call
  const handleEndCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    setIsCallInProgress(false);
    setCallDuration(0);
    setCallStatus(null);
    setIncomingCall(null);
    setIsMuted(false);
    setIsHold(false);
    
    try {
      twilioDevice?.activeCall?.disconnect?.();
    } catch (err) {
      console.error('Error ending call:', err);
    }
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (num: string) => {
    setPhoneNumber(prev => prev + num);
  };

  const handleMakeCall = async () => {
    if (!phoneNumber || isCallInProgress || !isDeviceReady) return;

    setError(null);
    setIsCallInProgress(true);
    setCallDuration(0);
    setCallStatus('Initiating call...');

    try {
      const response = await initiateCall(phoneNumber, targetLead?.name || 'Unknown');
      setCallStatus(`Connected to ${phoneNumber}`);
      
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      console.log('Call SID:', response.callSid);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate call');
      setCallStatus(null);
      setIsCallInProgress(false);
    }
  };

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim() || !phoneNumber || isSending) return;

    setError(null);
    setIsSending(true);

    try {
      await sendSMS(phoneNumber, smsMessage);
      setMessages([...messages, { 
        id: Date.now(), 
        sender: 'me', 
        text: smsMessage, 
        time: 'Just now' 
      }]);
      setSmsMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send SMS');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {deviceError && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-red-700">Device Connection Error</p>
              <p className="text-xs text-red-600 mt-0.5">{deviceError}</p>
            </div>
          </div>
        </div>
      )}

      {incomingCall && !incomingCall.accepted && (
        <div className="px-4 py-4 bg-blue-50 border-b-2 border-blue-500 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 size={20} className="text-blue-600 animate-bounce" />
              <div>
                <p className="text-sm font-bold text-blue-900">Incoming Call</p>
                <p className="text-xs text-blue-700">{incomingCall.from}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAnswerCall}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Phone size={14} className="inline mr-1" />
                Answer
              </button>
              <button
                onClick={handleRejectCall}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <PhoneOff size={14} className="inline mr-1" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex border-b border-gray-200">
        {['Dialer', 'History', 'SMS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-colors relative ${
              activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'Dialer' && (
          <div className="flex-1 flex flex-col items-center justify-between p-8 animate-fade-in">
            <div className="w-full flex flex-col items-center mt-4">
              {isCallInProgress && (
                <div className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 mb-6 animate-pulse">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Call in Progress • {formatDuration(callDuration)}
                </div>
              )}

              {!isCallInProgress && (
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 mb-6 ${
                  isDeviceReady && targetLead
                    ? 'bg-green-100 text-green-700'
                    : isDeviceReady
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isDeviceReady && targetLead
                      ? 'bg-green-500'
                      : isDeviceReady
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}></span>
                  {isDeviceReady && targetLead ? 'Ready to call' : isDeviceReady ? 'No lead selected' : 'Connecting...'}
                </div>
              )}

              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-3xl font-bold text-gray-900 text-center w-full bg-transparent outline-none mb-2"
                placeholder="Dial Number..."
              />
              <p className="text-sm text-gray-500 font-medium min-h-[20px]">
                {targetLead ? `${targetLead.name} • ${targetLead.company}` : 'Enter number or select lead'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-5 my-8">
              {DIALER_KEYS.map(({ num, sub }) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="w-16 h-16 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center group active:scale-95 duration-100"
                >
                  <span className="text-2xl font-medium text-gray-900 leading-none mb-0.5">{num}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{sub}</span>
                </button>
              ))}
            </div>

            <div className="mb-8 flex gap-4 items-center">
              {isCallInProgress && (
                <button 
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-600 text-white transition-all active:scale-95"
                >
                  <PhoneOff size={28} fill="currentColor" />
                </button>
              )}

              {!isCallInProgress && (
                <button 
                  onClick={handleMakeCall}
                  disabled={!phoneNumber || isCallInProgress || !isDeviceReady}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                    phoneNumber && !isCallInProgress && isDeviceReady
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Phone size={28} fill="currentColor" />
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-red-600">{error}</span>
              </div>
            )}
            {callStatus && !error && (
              <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-xs text-blue-600">{callStatus}</span>
              </div>
            )}

            {isCallInProgress && (
              <div className="w-full flex justify-between px-8 mb-4">
                <ControlButton 
                  icon={<MicOff size={20} />} 
                  label="Mute" 
                  active={isMuted}
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={false}
                />
                <ControlButton 
                  icon={<Pause size={20} fill="currentColor" />} 
                  label="Hold" 
                  active={isHold}
                  onClick={() => setIsHold(!isHold)}
                  disabled={false}
                />
                <ControlButton 
                  icon={<PhoneForwarded size={20} />} 
                  label="Transfer" 
                  disabled={true}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'History' && (
          <div className="flex-1 overflow-y-auto p-0 animate-fade-in">
             {!targetLead ? (
               <EmptyState icon={<Clock size={24} />} text="Select a lead to view call history" />
             ) : (
               <EmptyState icon={<Clock size={24} />} text="No call history yet" />
             )}
          </div>
        )}

        {activeTab === 'SMS' && (
          <div className="flex-1 flex flex-col h-full animate-fade-in">
            {!targetLead ? (
              <EmptyState icon={<MessageSquare size={24} />} text="Select a lead to view messages" />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                  <div className="text-center text-xs text-gray-400 my-4">Today</div>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        msg.sender === 'me' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={handleSendSms} className="p-4 bg-white border-t border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={smsMessage}
                      onChange={(e) => setSmsMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!smsMessage.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>

      <div className="h-14 border-t border-gray-100 flex items-center justify-between px-6 bg-gray-50/50 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isDeviceReady ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-xs font-medium text-gray-600">
            {isDeviceReady ? 'Device Ready' : 'Device Connecting...'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-500">
          {isCallInProgress ? `Duration: ${formatDuration(callDuration)}` : 'Idle'}
        </span>
      </div>
    </div>
  );
};

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const ControlButton = ({ 
  icon, 
  label, 
  disabled, 
  active, 
  onClick 
}: ControlButtonProps) => (
  <button 
    disabled={disabled}
    onClick={onClick}
    className={`flex flex-col items-center gap-2 transition-colors group ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600 cursor-pointer'
    }`}
  >
    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
      active
        ? 'border-red-500 bg-red-50 text-red-600'
        : `border-gray-200 bg-white ${!disabled && 'group-hover:border-gray-300 group-hover:bg-gray-50'}`
    }`}>
      {icon}
    </div>
    <span className="text-[10px] uppercase font-bold tracking-wide">{label}</span>
  </button>
);

interface EmptyStateProps {
  icon: React.ReactNode;
  text: string;
}

const EmptyState = ({ icon, text }: EmptyStateProps) => (
  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
      {icon}
    </div>
    <p className="text-sm font-medium">{text}</p>
  </div>
);

interface HistoryItemProps {
  type: 'missed' | 'outgoing' | 'incoming';
  number: string;
  time: string;
  duration: string;
}

const HistoryItem = ({ type, number, time, duration }: HistoryItemProps) => {
  const getIcon = () => {
    switch (type) {
      case 'missed': return <Ban size={14} className="text-red-500" />;
      case 'outgoing': return <ArrowUpRight size={14} className="text-green-500" />;
      case 'incoming': return <ArrowDownLeft size={14} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
           type === 'missed' ? 'bg-red-50' : type === 'outgoing' ? 'bg-green-50' : 'bg-blue-50'
        }`}>
          {getIcon()}
        </div>
        <div>
           <p className={`text-sm font-semibold ${type === 'missed' ? 'text-red-600' : 'text-gray-900'}`}>
             {type === 'missed' ? 'Missed Call' : number}
           </p>
           <p className="text-xs text-gray-400">{time}</p>
        </div>
      </div>
      <span className="text-xs font-mono text-gray-500">{duration}</span>
    </div>
  );
};
