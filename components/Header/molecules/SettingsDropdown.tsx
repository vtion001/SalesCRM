import React from 'react';
import { User, Shield, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { SettingsItem } from '../shared/SettingsItem';

export interface SettingsDropdownProps {
    onAccountSettings: () => void;
    onSecuritySettings: () => void;
}

/**
 * SettingsDropdown - Molecule component for settings dropdown
 * Displays settings menu items
 */
export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
    onAccountSettings,
    onSecuritySettings
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-[calc(100%+8px)] w-72 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50"
        >
            <div className="p-3 space-y-1">
                <SettingsItem
                    icon={<User size={18} />}
                    label="Account Settings"
                    onClick={onAccountSettings}
                />
                <SettingsItem
                    icon={<Shield size={18} />}
                    label="Privacy & Security"
                    onClick={onSecuritySettings}
                />
                <div className="h-px bg-slate-50 my-2 mx-3"></div>
                <SettingsItem icon={<Moon size={18} />} label="Dark Mode" toggle />
            </div>
        </motion.div>
    );
};
