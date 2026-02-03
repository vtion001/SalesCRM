import React from 'react';
import { useZadarmaWebRTC } from '../../hooks/useZadarmaWebRTC';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { ReadyState } from './ReadyState';

export interface ZadarmaWebRTCProps {
    sipLogin?: string;
    onReady?: () => void;
    onError?: (error: string) => void;
}

/**
 * ZadarmaWebRTC - Refactored component for Zadarma WebRTC widget
 * Reduced from 465 lines to ~30 lines by extracting logic to services and hooks
 */
export const ZadarmaWebRTC: React.FC<ZadarmaWebRTCProps> = ({
    sipLogin,
    onReady,
    onError
}) => {
    const { status, errorMessage, audioStatus } = useZadarmaWebRTC(
        sipLogin,
        onReady,
        onError
    );

    if (status === 'loading') {
        return <LoadingState />;
    }

    if (status === 'error') {
        return <ErrorState message={errorMessage} />;
    }

    return <ReadyState audioStatus={audioStatus} />;
};
