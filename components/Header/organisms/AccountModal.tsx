import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { CurrentUser } from '../../../types';
import { UseProfileEditorReturn } from '../../../hooks/useProfileEditor';
import { ModalContainer } from '../shared/ModalContainer';
import { InputGroup } from '../shared/InputGroup';

export interface AccountModalProps {
    user: CurrentUser;
    profileEditor: UseProfileEditorReturn;
    onClose: () => void;
}

/**
 * AccountModal - Organism component for account settings modal
 * Handles profile editing with avatar upload
 */
export const AccountModal: React.FC<AccountModalProps> = ({
    user,
    profileEditor,
    onClose
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        await profileEditor.save();
        onClose();
    };

    return (
        <ModalContainer onClose={onClose}>
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h2>
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="p-8 space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img
                            src={profileEditor.editedProfile.avatar}
                            alt="Profile"
                            className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-xl mb-4 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-indigo-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest bg-indigo-600 px-2 py-1 rounded-lg">
                                Change
                            </span>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={profileEditor.handleAvatarUpload}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                {/* Profile Fields */}
                <div className="space-y-4">
                    <InputGroup
                        label="Full Name"
                        value={profileEditor.editedProfile.name}
                        onChange={(value) => profileEditor.updateField('name', value)}
                    />
                    <InputGroup label="Email Address" value={user.email} disabled />
                    <InputGroup
                        label="Job Title"
                        value={profileEditor.editedProfile.role}
                        onChange={(value) => profileEditor.updateField('role', value)}
                    />
                </div>
            </div>

            <div className="p-8 border-t border-slate-50 flex justify-end gap-4 bg-slate-50/50">
                <button
                    onClick={onClose}
                    className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-colors text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!profileEditor.isDirty || profileEditor.isLoading}
                    className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {profileEditor.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </ModalContainer>
    );
};
