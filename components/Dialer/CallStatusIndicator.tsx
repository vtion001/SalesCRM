import React from 'react';
import { motion } from 'framer-motion';

export interface CallStatusIndicatorProps {
    isCallInProgress: boolean;
    duration: number;
}

/**
 * CallStatusIndicator - Molecule component for displaying call duration
 */
export const CallStatusIndicator: React.FC<CallStatusIndicatorProps> = ({
    isCallInProgress,
    duration
}) => {
    if (!isCallInProgress) return null;

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-brand-50 text-brand-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 mb-8 border border-brand-100"
        >
            <div className="relative flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
            </div>
            In Call • {formatDuration(duration)}
        </motion.div>
    );
};
