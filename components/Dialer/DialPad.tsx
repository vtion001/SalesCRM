import React from 'react';
import { motion } from 'framer-motion';
import { DIALER_KEYS } from '../../constants';

export interface DialPadProps {
    onKeyPress: (num: string) => void;
    disabled?: boolean;
}

/**
 * DialPad - Atomic component for numeric keypad
 * Pure UI component with no business logic
 */
export const DialPad: React.FC<DialPadProps> = ({ onKeyPress, disabled = false }) => {
    return (
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 my-10">
            {DIALER_KEYS.map(({ num, sub }) => (
                <motion.button
                    key={num}
                    whileTap={{ scale: disabled ? 1 : 0.9 }}
                    onClick={() => !disabled && onKeyPress(num)}
                    disabled={disabled}
                    className={`w-16 h-16 rounded-[24px] transition-all flex flex-col items-center justify-center group ${disabled
                            ? 'bg-slate-100 cursor-not-allowed opacity-50'
                            : 'bg-slate-50 hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200 active:bg-indigo-50'
                        }`}
                >
                    <span className={`text-2xl font-black leading-none mb-1 ${disabled ? 'text-slate-400' : 'text-slate-900 group-active:text-indigo-600'
                        }`}>
                        {num}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${disabled ? 'text-slate-300' : 'text-slate-400 group-active:text-indigo-400'
                        }`}>
                        {sub}
                    </span>
                </motion.button>
            ))}
        </div>
    );
};
