import React, { useState, useEffect, useRef } from 'react';
import { MicOff, Pause, PhoneForwarded, Headphones, Phone, PhoneOff, Clock, MessageSquare, Send, ArrowDownLeft, ArrowUpRight, Ban } from 'lucide-react';
import { DIALER_KEYS } from '../constants';
import { Lead } from '../types';

interface DialerProps {
  targetLead: Lead | undefined;
}

export const Dialer: React.FC<DialerProps> = ({ targetLead }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeTab, setActiveTab] = useState('Dialer');
  
  // SMS State
  const [smsMessage, setSmsMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetLead) {
      setPhoneNumber(targetLead.phone);
      // Seed dummy messages for the selected lead
      setMessages([
        { id: 1, sender: 'them', text: 'Hi Alex, I got your proposal.', time: 'Yesterday' },
        { id: 2, sender: 'me', text: 'Great! Do you have any questions?', time: 'Yesterday' },
        { id: 3, sender: 'them', text: 'Can we discuss the pricing tier?', time: '9:41 AM' },
      ]);
    } else {
      setPhoneNumber('');
      setMessages([]);
    }
  }, [targetLead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleKeyPress = (num: string) => {
    setPhoneNumber(prev => prev + num);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim()) return;
    
    setMessages([...messages, { 
      id: Date.now(), 
      sender: 'me', 
      text: smsMessage, 
      time: 'Just now' 
    }]);
    setSmsMessage('');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Dialer Tabs */}
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
        
        {/* --- DIALER TAB --- */}
        {activeTab === 'Dialer' && (
          <div className="flex-1 flex flex-col items-center justify-between p-8 animate-fade-in">
            <div className="w-full flex flex-col items-center mt-4">
              {targetLead ? (
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 mb-6">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Ready to call
                </div>
              ) : (
                <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 mb-6">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  Offline
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

            {/* Keypad */}
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

            {/* Call Action */}
            <div className="mb-8">
              <button 
                disabled={!phoneNumber}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                  phoneNumber 
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Phone size={28} fill="currentColor" />
              </button>
            </div>

            {/* Controls */}
            <div className="w-full flex justify-between px-8 mb-4">
              <ControlButton icon={<MicOff size={20} />} label="Mute" disabled={!targetLead} />
              <ControlButton icon={<Pause size={20} fill="currentColor" />} label="Hold" disabled={!targetLead} />
              <ControlButton icon={<PhoneForwarded size={20} />} label="Transfer" disabled={!targetLead} />
            </div>
          </div>
        )}

        {/* --- HISTORY TAB --- */}
        {activeTab === 'History' && (
          <div className="flex-1 overflow-y-auto p-0 animate-fade-in">
             {!targetLead ? (
               <EmptyState icon={<Clock size={24} />} text="Select a lead to view call history" />
             ) : (
               <div className="divide-y divide-gray-100">
                  <HistoryItem type="missed" number={targetLead.phone} time="2 hours ago" duration="0:00" />
                  <HistoryItem type="outgoing" number={targetLead.phone} time="Yesterday, 2:30 PM" duration="5:23" />
                  <HistoryItem type="incoming" number={targetLead.phone} time="Mon, 10:15 AM" duration="2:12" />
                  <HistoryItem type="outgoing" number={targetLead.phone} time="Last week" duration="1:45" />
               </div>
             )}
          </div>
        )}

        {/* --- SMS TAB --- */}
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

      {/* Footer Device Select */}
      <div className="h-14 border-t border-gray-100 flex items-center justify-between px-6 bg-gray-50/50 flex-shrink-0 z-10">
        <div className="flex items-center gap-3 text-gray-500">
           <Headphones size={16} />
           <span className="text-xs font-medium text-gray-600">Jabra Evolve2 65</span>
        </div>
        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
          Change
        </button>
      </div>
    </div>
  );
};

const ControlButton = ({ icon, label, disabled }: { icon: React.ReactNode; label: string; disabled?: boolean }) => (
  <button 
    disabled={disabled}
    className={`flex flex-col items-center gap-2 transition-colors group ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <div className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white ${
      !disabled && 'group-hover:border-gray-300 group-hover:bg-gray-50'
    }`}>
      {icon}
    </div>
    <span className="text-[10px] uppercase font-bold tracking-wide">{label}</span>
  </button>
);

const EmptyState = ({ icon, text }: { icon: any; text: string }) => (
  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
      {icon}
    </div>
    <p className="text-sm font-medium">{text}</p>
  </div>
);

const HistoryItem = ({ type, number, time, duration }: any) => {
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