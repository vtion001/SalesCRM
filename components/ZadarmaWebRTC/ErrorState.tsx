import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface ErrorStateProps {
    message: string;
}

/**
 * ErrorState - Atom component for error state
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
    return (
        <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
            <div className="flex-1">
                <p className="text-sm font-medium text-red-900">WebRTC Error</p>
                <p className="text-xs text-red-700 mt-1">{message}</p>
            </div>
        </div>
    );
};
