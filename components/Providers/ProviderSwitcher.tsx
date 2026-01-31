// Provider switcher component

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { TelephonyProvider } from '../../services/telephony/TelephonyTypes';
import { getProviderDisplayName, getProviderLogo } from '../../utils/telephonyConfig';
import toast from 'react-hot-toast';

interface ProviderSwitcherProps {
  currentProvider: TelephonyProvider;
  onSwitch: (provider: TelephonyProvider) => Promise<void>;
  isCallActive?: boolean;
  className?: string;
}

export const ProviderSwitcher: React.FC<ProviderSwitcherProps> = ({
  currentProvider,
  onSwitch,
  isCallActive = false,
  className = ''
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const targetProvider: TelephonyProvider = currentProvider === 'twilio' ? 'zadarma' : 'twilio';

  const handleSwitchClick = () => {
    if (isCallActive) {
      toast.error('Cannot switch provider during active call');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmSwitch = async () => {
    setIsSwitching(true);
    try {
      await onSwitch(targetProvider);
      toast.success(`Switched to ${getProviderDisplayName(targetProvider)}`);
      setShowConfirmation(false);
    } catch (error: any) {
      toast.error(`Failed to switch: ${error.message}`);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSwitchClick}
        disabled={isCallActive || isSwitching}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
          isCallActive || isSwitching
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95'
        } ${className}`}
      >
        <RefreshCw size={14} className={isSwitching ? 'animate-spin' : ''} />
        <span>Switch Provider</span>
      </button>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Switch Provider
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Change telephony provider
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getProviderLogo(currentProvider)}</span>
                    <span className="text-sm font-bold text-slate-600">
                      {getProviderDisplayName(currentProvider)}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Current
                  </span>
                </div>

                <div className="flex justify-center">
                  <RefreshCw size={20} className="text-slate-300" />
                </div>

                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getProviderLogo(targetProvider)}</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {getProviderDisplayName(targetProvider)}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    New
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-6">
                This will disconnect the current provider and reinitialize with the new provider.
                Your call history and settings will be preserved.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSwitch}
                  disabled={isSwitching}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSwitching && <RefreshCw size={14} className="animate-spin" />}
                  {isSwitching ? 'Switching...' : 'Confirm Switch'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
