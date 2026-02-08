import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export type StatusMessageType = 'error' | 'success' | 'info';

interface StatusMessageProps {
  type: StatusMessageType;
  message: string;
  onClose?: () => void;
}

const statusConfig = {
  error: {
    bgColor: 'bg-accent-50',
    borderColor: 'border-accent-100',
    textColor: 'text-accent-700',
    icon: AlertCircle,
  },
  success: {
    bgColor: 'bg-brand-50',
    borderColor: 'border-brand-100',
    textColor: 'text-brand-700',
    icon: CheckCircle,
  },
  info: {
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-600',
    icon: AlertCircle,
  },
};

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  message,
  onClose,
}) => {
  const config = statusConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={`${config.bgColor} border ${config.borderColor} rounded-lg flex items-start gap-2 p-3`}
    >
      <IconComponent size={16} className={`${config.textColor} mt-0.5 flex-shrink-0`} />
      <span className={`text-xs ${config.textColor}`}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-auto text-xs ${config.textColor} hover:opacity-70`}
        >
          ✕
        </button>
      )}
    </div>
  );
};
