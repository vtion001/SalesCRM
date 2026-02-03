import React from 'react';
import { User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { CurrentUser } from '../../../types';

export interface ProfileDropdownProps {
    user: CurrentUser;
    onEditProfile: () => void;
    onLogout: () => void;
}

/**
 * ProfileDropdown - Molecule component for profile dropdown
 * Displays user info and profile actions
 */
export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
    user,
    onEditProfile,
    onLogout
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50"
        >
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <p className="font-black text-slate-900">{user.name}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">{user.email}</p>
            </div>
            <div className="p-3">
                <button
                    onClick={onEditProfile}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl flex items-center gap-3 transition-colors"
                >
                    <User size={18} className="text-slate-400" /> Edit Profile
                </button>
                <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-2xl flex items-center gap-3 mt-1 transition-colors"
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </motion.div>
    );
};
