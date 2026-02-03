import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, User } from 'lucide-react';

export interface IncomingCallBannerProps {
    caller: {
        name?: string;
        company?: string;
        avatar?: string;
        from: string;
    };
    onAnswer: () => void;
    onReject: () => void;
}

/**
 * IncomingCallBanner - Organism component for incoming call notification
 * Displays caller information and answer/reject actions
 */
export const IncomingCallBanner: React.FC<IncomingCallBannerProps> = ({
    caller,
    onAnswer,
    onReject
}) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="px-6 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl relative z-20"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {caller.avatar ? (
                            <img
                                src={caller.avatar}
                                alt={caller.name}
                                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30"
                            />
                        ) : (
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                {caller.name && caller.name !== 'Unknown Caller' ? (
                                    <span className="text-xl font-black text-white">
                                        {caller.name.charAt(0)}
                                    </span>
                                ) : (
                                    <User size={24} className="text-white" />
                                )}
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">
                                📞 Incoming Call
                            </p>
                            <p className="text-xl font-black text-white leading-tight">
                                {caller.name || 'Unknown Caller'}
                            </p>
                            {caller.company && (
                                <p className="text-xs font-semibold text-white/80 mt-0.5">
                                    {caller.company}
                                </p>
                            )}
                            <p className="text-[11px] font-medium text-white/70 mt-1">
                                {caller.from}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onAnswer}
                            className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-emerald-600"
                        >
                            <Phone size={22} />
                        </button>
                        <button
                            onClick={onReject}
                            className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-rose-600"
                        >
                            <PhoneOff size={22} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
