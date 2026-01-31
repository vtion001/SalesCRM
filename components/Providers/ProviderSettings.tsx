// Provider settings panel

import React from 'react';
import { TelephonyProvider } from '../../services/telephony/TelephonyTypes';
import { getProviderDisplayName, getProviderLogo } from '../../utils/telephonyConfig';
import { CheckCircle, XCircle } from 'lucide-react';

interface ProviderSettingsProps {
  provider: TelephonyProvider;
  isOnline: boolean;
  isReady: boolean;
  error?: string | null;
}

export const ProviderSettings: React.FC<ProviderSettingsProps> = ({
  provider,
  isOnline,
  isReady,
  error
}) => {
  const displayName = getProviderDisplayName(provider);
  const logo = getProviderLogo(provider);

  const capabilities = getProviderCapabilities(provider);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">
          {logo}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-black text-slate-900">{displayName}</h3>
          <div className="flex items-center gap-2 mt-1">
            {isReady ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <CheckCircle size={12} /> Ready
              </span>
            ) : error ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600">
                <XCircle size={12} /> Error
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-600">Connecting...</span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl">
          <p className="text-xs font-bold text-rose-600">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
          Capabilities
        </p>
        {capabilities.map((capability, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-500" />
            <span className="text-xs text-slate-600">{capability}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function getProviderCapabilities(provider: TelephonyProvider): string[] {
  switch (provider) {
    case 'twilio':
      return [
        'WebRTC calling',
        'Instant call connection',
        'SMS sending/receiving',
        'Call recording',
        'Call mute/unmute',
        'Australian premium numbers'
      ];
    case 'zadarma':
      return [
        'Callback-based calling',
        'SMS sending',
        'Call recording',
        'PBX integration',
        'International coverage',
        'Cost-effective rates'
      ];
    default:
      return [];
  }
}
