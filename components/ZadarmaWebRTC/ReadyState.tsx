import React from 'react';
import { Phone } from 'lucide-react';
import { AudioStatus } from '../../services/telephony/ZadarmaAudioService';

export interface ReadyStateProps {
    audioStatus: AudioStatus;
}

/**
 * ReadyState - Molecule component for ready state with audio status
 */
export const ReadyState: React.FC<ReadyStateProps> = ({ audioStatus }) => {
    return (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
            <Phone className="text-green-600" size={16} />
            <div className="flex-1">
                <p className="text-sm font-medium text-green-900">
                    WebRTC Ready {audioStatus.isActive && <span className="text-green-600 ml-1">🎤</span>}
                </p>
                <p className="text-xs text-green-700">
                    Widget loaded. Dial numbers using the widget in bottom-right corner.
                </p>

                {audioStatus.hint && (
                    <p className="text-[10px] text-amber-700 mt-1">⚠️ {audioStatus.hint}</p>
                )}

                {!audioStatus.isActive && (
                    <p className="text-[10px] text-amber-600 mt-1">
                        📍 Microphone connection pending - try clicking the widget to activate
                    </p>
                )}

                <p className="text-[10px] text-green-600 mt-1">
                    💡 Tip: Make sure your iPhone microphone is enabled in Safari settings (⚙️ → Microphone)
                </p>
            </div>
        </div>
    );
};
