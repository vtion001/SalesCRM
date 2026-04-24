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
        <div className="grid grid-cols-3 gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-6 my-4 sm:my-6 lg:my-10">
            {DIALER_KEYS.map(({ num, sub }) => (
                <motion.button
                    key={num}
                    whileTap={{ scale: disabled ? 1 : 0.9 }}
                    onClick={() => !disabled && onKeyPress(num)}
                    disabled={disabled}
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl sm:rounded-[24px] transition-all flex flex-col items-center justify-center group active:scale-95 ${disabled
                            ? 'bg-slate-100 cursor-not-allowed opacity-50'
                            : 'bg-slate-50 hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200 active:bg-brand-50'
                        }`}
                    style={{ touchAction: 'manipulation' }}
                >
                    <span className={`text-xl sm:text-2xl lg:text-2xl font-black leading-none mb-0.5 ${disabled ? 'text-slate-400' : 'text-slate-900 group-active:text-brand-600'
                        }`}>
                        {num}
                    </span>
                    <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest ${disabled ? 'text-slate-300' : 'text-slate-400 group-active:text-brand-400'
                        }`}>
                        {sub}
                    </span>
                </motion.button>
            ))}
        </div>
    );
};
