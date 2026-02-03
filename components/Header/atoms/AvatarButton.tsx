import React from 'react';
import { CurrentUser } from '../../../types';

export interface AvatarButtonProps {
    user: CurrentUser;
    isActive: boolean;
    onClick: () => void;
}

/**
 * AvatarButton - Atom component for user avatar button
 * Displays user avatar, name, and role
 */
export const AvatarButton: React.FC<AvatarButtonProps> = ({ user, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 cursor-pointer group p-1.5 pr-4 rounded-2xl hover:bg-slate-50 transition-all"
        >
            <img
                src={user.avatar}
                alt="User"
                className={`w-10 h-10 rounded-xl border-2 transition-all object-cover shadow-sm ${isActive ? 'border-indigo-500' : 'border-white'
                    }`}
            />
            <div className="text-left hidden lg:block">
                <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {user.name}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {user.role}
                </p>
            </div>
        </button>
    );
};
