import React from 'react';

export interface InputGroupProps {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    type?: 'text' | 'password' | 'email';
    placeholder?: string;
}

/**
 * InputGroup - Shared form input component
 * Provides consistent styling for form inputs
 */
export const InputGroup: React.FC<InputGroupProps> = ({
    label,
    value,
    onChange,
    disabled = false,
    type = 'text',
    placeholder
}) => {
    return (
        <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full px-5 py-3.5 border-2 border-transparent rounded-2xl text-sm font-bold outline-none transition-all ${disabled
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-50 focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 text-slate-900'
                    }`}
            />
        </div>
    );
};
