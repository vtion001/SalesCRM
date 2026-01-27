import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center h-64 text-center px-6">
    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
      {icon}
    </div>
    {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
    {description && (
      <p className="text-xs text-gray-500 mt-1 mb-4">{description}</p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        className="text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);
