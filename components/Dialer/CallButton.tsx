import React from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff } from 'lucide-react';

export interface CallButtonProps {
    isCallInProgress: boolean;
    isDeviceReady: boolean;
    phoneNumber: string;
    onMakeCall: () => void;
    onEndCall: () => void;
}

/**
 * CallButton - Molecule component for call/end call button
 * Handles visual state based on call progress
 */
export const CallButton: React.FC<CallButtonProps> = ({
    isCallInProgress,
    isDeviceReady,
    phoneNumber,
    onMakeCall,
    onEndCall
}) => {
    if (isCallInProgress) {
        return (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={onEndCall}
                className="w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl shadow-rose-200 bg-rose-500 hover:bg-rose-600 text-white transition-all active:scale-90"
            >
                <PhoneOff size={32} />
            </motion.button>
        );
    }

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={onMakeCall}
            disabled={!phoneNumber || !isDeviceReady}
            className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl transition-all active:scale-90 ${phoneNumber && isDeviceReady
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                }`}
        >
            <Phone size={32} />
        </motion.button>
    );
};
