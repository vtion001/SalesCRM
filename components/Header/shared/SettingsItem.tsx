import React from 'react';

export interface SettingsItemProps {
    icon: React.ReactNode;
    label: string;
    toggle?: boolean;
    onClick?: () => void;
}

/**
 * SettingsItem - Shared settings menu item component
 * Used in settings dropdown
 */
export const SettingsItem: React.FC<SettingsItemProps> = ({
    icon,
    label,
    toggle = false,
    onClick
}) => {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl group transition-all text-left"
        >
            <div className="flex items-center gap-3">
                <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {icon}
                </span>
                <span>{label}</span>
            </div>
            {toggle && (
                <div className="w-10 h-5 bg-slate-100 rounded-full relative border border-slate-200">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm border border-slate-200"></div>
                </div>
            )}
        </button>
    );
};
