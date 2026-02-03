import React from 'react';

export interface DropdownTriggerProps {
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    badge?: boolean;
}

/**
 * DropdownTrigger - Atom component for dropdown trigger button
 * Generic button for opening dropdowns
 */
export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({
    icon,
    isActive,
    onClick,
    badge = false
}) => {
    return (
        <button
            onClick={onClick}
            className={`relative hover:bg-slate-50 transition-all p-2.5 rounded-xl text-slate-500 ${isActive ? 'bg-slate-50 text-indigo-600' : ''
                }`}
        >
            {icon}
            {badge && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            )}
        </button>
    );
};
