/**
 * EditableField - Reusable component for inline editing
 * Handles the edit/save/cancel pattern used across detail views
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface EditableFieldProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isEditing: boolean;
  inputType?: 'text' | 'number';
  inputValue?: string | number;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onInputChange?: (value: any) => void;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  icon,
  color,
  isEditing,
  inputType = 'number',
  inputValue,
  onEdit,
  onSave,
  onCancel,
  onInputChange
}) => {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className={`bg-slate-50/50 rounded-[32px] p-6 border border-transparent transition-all ${
        !isEditing && onEdit ? 'hover:bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-slate-200/50 cursor-pointer' : ''
      }`}
      onClick={!isEditing && onEdit ? onEdit : undefined}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-400">{icon}</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-3"
            onClick={e => e.stopPropagation()}
          >
            <input
              type={inputType}
              autoFocus
              className="w-full text-xl font-black border-b-2 border-indigo-500 focus:outline-none bg-transparent"
              value={inputValue}
              onChange={e => onInputChange?.(inputType === 'number' ? Number(e.target.value) : e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={onSave}
                className="p-1.5 bg-indigo-600 text-white rounded-lg active:scale-90 transition-all"
              >
                <Check size={14} />
              </button>
              <button
                onClick={onCancel}
                className="p-1.5 bg-slate-200 text-slate-600 rounded-lg active:scale-90 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.span
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-2xl font-black tracking-tighter ${color}`}
          >
            {value}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
