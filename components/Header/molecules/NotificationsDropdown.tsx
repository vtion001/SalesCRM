import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * NotificationsDropdown - Molecule component for notifications dropdown
 * Displays notification list with empty state
 */
export const NotificationsDropdown: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-[calc(100%+8px)] w-96 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50"
        >
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-wider">
                    Mark all read
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="text-slate-300" size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-900">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">No new notifications at the moment.</p>
                </div>
            </div>
        </motion.div>
    );
};
