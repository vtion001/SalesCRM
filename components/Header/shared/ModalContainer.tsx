import React from 'react';
import { motion } from 'framer-motion';

export interface ModalContainerProps {
    children: React.ReactNode;
    onClose: () => void;
}

/**
 * ModalContainer - Shared modal wrapper component
 * Provides backdrop, centering, and animations
 */
export const ModalContainer: React.FC<ModalContainerProps> = ({ children, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-white"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </motion.div>
        </div>
    );
};
