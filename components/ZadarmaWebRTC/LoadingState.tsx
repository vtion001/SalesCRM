import React from 'react';
import { Loader } from 'lucide-react';

/**
 * LoadingState - Atom component for loading state
 */
export const LoadingState: React.FC = () => {
    return (
        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Loader className="animate-spin text-blue-600" size={16} />
            <span className="text-sm text-blue-900">Loading Zadarma WebRTC...</span>
        </div>
    );
};
