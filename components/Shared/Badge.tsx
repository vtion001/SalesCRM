import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-brand-50 text-brand-700',
  warning: 'bg-accent-50 text-accent-700',
  error: 'bg-accent-50 text-accent-700',
  info: 'bg-brand-50 text-brand-700',
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  className = '',
}) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantStyles[variant]} ${className}`}
  >
    {label}
  </span>
);
