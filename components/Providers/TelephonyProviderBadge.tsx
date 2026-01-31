// Provider badge component showing current telephony provider

import React from 'react';
import { Phone } from 'lucide-react';
import { TelephonyProvider } from '../../services/telephony/TelephonyTypes';
import { getProviderDisplayName, getProviderLogo } from '../../utils/telephonyConfig';

interface TelephonyProviderBadgeProps {
  provider: TelephonyProvider;
  isOnline: boolean;
  isReady: boolean;
}

export const TelephonyProviderBadge: React.FC<TelephonyProviderBadgeProps> = ({
  provider,
  isOnline,
  isReady
}) => {
  const displayName = getProviderDisplayName(provider);
  const logo = getProviderLogo(provider);
  
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{logo}</span>
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
          {displayName}
        </span>
      </div>
      <div className={`w-2 h-2 rounded-full ${
        isReady ? 'bg-emerald-500' : isOnline ? 'bg-amber-500' : 'bg-slate-300'
      }`} />
    </div>
  );
};
