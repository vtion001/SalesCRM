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
                className="text-4xl font-black text-slate-900 text-center w-full bg-transparent outline-none mb-2 tracking-tight"
                placeholder="000-000-0000"
            />
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 inline-block px-3 py-1 rounded-lg">
                {targetLead ? `${targetLead.name} • ${targetLead.company}` : 'Awaiting Selection'}
            </p>
        </motion.div>
    );
};
