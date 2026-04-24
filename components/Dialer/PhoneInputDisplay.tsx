import React from 'react';
import { motion } from 'framer-motion';
import { Lead } from '../../types';

export interface PhoneInputDisplayProps {
    phoneNumber: string;
    targetLead?: Lead;
    onChange: (value: string) => void;
}

/**
 * PhoneInputDisplay - Molecule component for phone number input
 */
export const PhoneInputDisplay: React.FC<PhoneInputDisplayProps> = ({
    phoneNumber,
    targetLead,
    onChange
}) => {
    return (
        <motion.div layoutId="phone-input" className="w-full text-center">
            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => onChange(e.target.value)}
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 text-center w-full bg-transparent outline-none mb-1 sm:mb-2 tracking-tight px-2"
                placeholder="000-000-0000"
                style={{ touchAction: 'manipulation' }}
            />
            <p className="text-[9px] sm:text-[10px] font-black text-brand-500 uppercase tracking-widest bg-brand-50 inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg max-w-full truncate">
                {targetLead ? `${targetLead.name} \u2022 ${targetLead.company}` : 'Awaiting Selection'}
            </p>
        </motion.div>
    );
};
