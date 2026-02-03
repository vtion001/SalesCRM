import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, MessageSquare, Send } from 'lucide-react';
import { Lead, Activity } from '../../types';
import { useTelephony } from '../../context';
import { useDialer } from '../../hooks/useDialer';
import { sendSMS } from '../../services/twilioService';
import { TelephonyProviderBadge, ProviderSwitcher } from '../Providers';
import { CallLogs } from '../CallLogs';
import { DialPad } from './DialPad';
import { CallButton } from './CallButton';
import { IncomingCallBanner } from './IncomingCallBanner';
import { CallStatusIndicator } from './CallStatusIndicator';
import { PhoneInputDisplay } from './PhoneInputDisplay';

export interface DialerProps {
    targetLead: Lead | undefined;
    onLogActivity?: (activity: Omit<Activity, 'id'>) => void;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

/**
 * Dialer - Main dialer component (refactored)
 * Orchestrates UI components and business logic via useDialer hook
 */
export const Dialer: React.FC<DialerProps> = ({
    targetLead,
    onLogActivity,
    activeTab: propsActiveTab,
    onTabChange
}) => {
    const [internalActiveTab, setInternalActiveTab] = useState('Dialer');
    const [smsMessage, setSmsMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [missedCallCount, setMissedCallCount] = useState(0);

    const { provider, isReady: providerReady, switchProvider } = useTelephony();

    const {
        phoneNumber,
        setPhoneNumber,
        isCallInProgress,
        callDuration,
        callStatus,
        error,
        isDeviceReady,
        deviceError,
        incomingCall,
        handleKeyPress,
        handleMakeCall,
        handleEndCall,
        handleAnswerCall,
        handleRejectCall
    } = useDialer(targetLead, onLogActivity);

    const activeTab = propsActiveTab || internalActiveTab;
    const setActiveTab = onTabChange || setInternalActiveTab;

    const handleSendSms = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!smsMessage.trim() || !phoneNumber || isSending) return;

        setIsSending(true);
        try {
            await sendSMS(phoneNumber, smsMessage);
            setMessages([...messages, {
                id: Date.now(),
                sender: 'me',
                text: smsMessage,
                time: 'Just now'
            }]);

            if (targetLead && onLogActivity) {
                onLogActivity({
                    type: 'email',
                    title: 'SMS Sent',
                    description: smsMessage,
                    timestamp: 'Just now'
                });
            }

            setSmsMessage('');
        } catch (err: any) {
            console.error('Failed to send SMS:', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            {/* Device Error Banner */}
            <AnimatePresence>
                {deviceError && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="bg-rose-50 overflow-hidden border-b border-rose-100"
                    >
                        <div className="px-6 py-3 flex items-start gap-3">
                            <AlertCircle size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">
                                    Device Offline
                                </p>
                                <p className="text-[11px] text-rose-600 font-bold leading-tight">
                                    {deviceError}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Incoming Call Banner */}
            <AnimatePresence>
                {incomingCall && !incomingCall.accepted && (
                    <IncomingCallBanner
                        caller={{
                            name: incomingCall.callerName,
                            company: incomingCall.callerCompany,
                            avatar: incomingCall.callerAvatar,
                            from: incomingCall.from
                        }}
                        onAnswer={handleAnswerCall}
                        onReject={handleRejectCall}
                    />
                )}
            </AnimatePresence>

            {/* Provider Status Bar */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-slate-50/30 flex-shrink-0">
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

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100 p-2 bg-slate-50/50">
                {['Dialer', 'History', 'SMS'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            if (tab === 'History') setMissedCallCount(0);
                        }}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all relative rounded-xl ${activeTab === tab
                                ? 'text-indigo-600 bg-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
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

            {/* Tab Content */}
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
                            {/* Zadarma Info Banner */}
                            {provider === 'zadarma' && (
                                <div className="w-full max-w-md mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-center">
                                    <p className="text-sm font-medium text-green-900">
                                        📞 Zadarma Callback Mode
                                    </p>
                                    <p className="text-xs text-green-700">
                                        When you dial, Zadarma will call your SIP device first, then connect to the destination.
                                    </p>
                                </div>
                            )}

                            <div className="w-full flex flex-col items-center">
                                <CallStatusIndicator
                                    isCallInProgress={isCallInProgress}
                                    duration={callDuration}
                                />

                                <PhoneInputDisplay
                                    phoneNumber={phoneNumber}
                                    targetLead={targetLead}
                                    onChange={setPhoneNumber}
                                />
                            </div>

                            <DialPad
                                onKeyPress={handleKeyPress}
                                disabled={false}
                            />

                            <div className="mb-4">
                                <CallButton
                                    isCallInProgress={isCallInProgress}
                                    isDeviceReady={isDeviceReady}
                                    phoneNumber={phoneNumber}
                                    onMakeCall={handleMakeCall}
                                    onEndCall={handleEndCall}
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-100"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'History' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 overflow-hidden flex flex-col"
                        >
                            <CallLogs
                                onDial={(number) => {
                                    setPhoneNumber(number);
                                    setActiveTab('Dialer');
                                }}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'SMS' && (
                        <motion.div
                            key="sms"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col h-full"
                        >
                            {!targetLead ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">Select a lead</p>
                                    <p className="text-xs text-slate-400 mt-1">Choose a lead to view messages</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
                                        <div className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] my-4">
                                            Today
                                        </div>
                                        {messages.map((msg, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={msg.id}
                                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm font-medium shadow-sm ${msg.sender === 'me'
                                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                                            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                                                        }`}
                                                >
                                                    <p className="leading-relaxed">{msg.text}</p>
                                                    <p
                                                        className={`text-[9px] font-black uppercase tracking-widest mt-2 ${msg.sender === 'me' ? 'text-indigo-200' : 'text-slate-400'
                                                            }`}
                                                    >
                                                        {msg.time}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <form onSubmit={handleSendSms} className="p-6 bg-white border-t border-slate-100">
                                        <div className="relative flex gap-3">
                                            <input
                                                type="text"
                                                value={smsMessage}
                                                onChange={(e) => setSmsMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 px-6 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-[20px] outline-none text-sm font-medium transition-all"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!smsMessage.trim()}
                                                className="w-14 h-14 bg-indigo-600 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-indigo-600/20 disabled:opacity-30 transition-all active:scale-90"
                                            >
                                                <Send size={20} />
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
