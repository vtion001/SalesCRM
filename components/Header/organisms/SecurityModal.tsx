import React from 'react';
import { X, Lock, Smartphone, Shield, ChevronRight } from 'lucide-react';
import { UsePasswordChangeReturn } from '../../../hooks/usePasswordChange';
import { ModalContainer } from '../shared/ModalContainer';

export interface SecurityModalProps {
    passwordChange: UsePasswordChangeReturn;
    onClose: () => void;
    onOpenMFA: () => void;
}

/**
 * SecurityModal - Organism component for security settings modal
 * Handles password change and MFA setup
 */
export const SecurityModal: React.FC<SecurityModalProps> = ({
    passwordChange,
    onClose,
    onOpenMFA
}) => {
    const handlePasswordChange = async () => {
        try {
            await passwordChange.changePassword();
            onClose();
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    const handleMFAClick = () => {
        onClose();
        onOpenMFA();
    };

    return (
        <ModalContainer onClose={onClose}>
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Security</h2>
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="p-8 space-y-8">
                {/* Password Management */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={14} /> Password Management
                    </h3>
                    <div className="space-y-3">
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={passwordChange.currentPassword}
                            onChange={(e) => passwordChange.setCurrentPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-2xl text-sm font-bold outline-none transition-all"
                        />
                        <input
                            type="password"
                            placeholder="New Password (min 12 chars)"
                            value={passwordChange.newPassword}
                            onChange={(e) => passwordChange.setNewPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-2xl text-sm font-bold outline-none transition-all"
                        />
                        <p className="text-[10px] text-slate-400 font-medium px-1">
                            Must include uppercase, lowercase, number, and special character
                        </p>
                    </div>
                </div>

                {/* Multi-Factor Auth */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Smartphone size={14} /> Multi-Factor Auth
                    </h3>
                    <button
                        onClick={handleMFAClick}
                        className="w-full flex items-center justify-between p-5 bg-indigo-50 border-2 border-indigo-100 rounded-2xl group hover:bg-indigo-100 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                <Shield size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-indigo-900">Authenticator App</p>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">
                                    Highly Recommended
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            size={20}
                            className="text-indigo-300 group-hover:translate-x-1 transition-transform"
                        />
                    </button>
                </div>
            </div>

            <div className="p-8 border-t border-slate-50 flex justify-end gap-4 bg-slate-50/50">
                <button
                    onClick={onClose}
                    disabled={passwordChange.isChanging}
                    className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-colors text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handlePasswordChange}
                    disabled={
                        passwordChange.isChanging ||
                        !passwordChange.currentPassword ||
                        !passwordChange.newPassword
                    }
                    className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {passwordChange.isChanging ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Updating...
                        </>
                    ) : (
                        'Update Security'
                    )}
                </button>
            </div>
        </ModalContainer>
    );
};
