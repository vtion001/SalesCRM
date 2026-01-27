import React from 'react';
import { Database, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useSupabaseHealth } from '../hooks/useSupabaseHealth';
import { motion, AnimatePresence } from 'framer-motion';

export const SupabaseHealthIndicator: React.FC = () => {
  const { health, refetch } = useSupabaseHealth();
  const [showDetails, setShowDetails] = React.useState(false);

  if (health.isConnected && health.isAuthenticated && !health.error) {
    return null; // Hide if everything is working
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          {health.error ? (
            <AlertCircle className="text-rose-500 shrink-0" size={20} />
          ) : (
            <Loader2 className="text-indigo-500 shrink-0 animate-spin" size={20} />
          )}
          <div className="flex-1">
            <h3 className="text-sm font-black text-slate-900 mb-1">
              {health.error ? 'Connection Issue' : 'Connecting...'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-3">
              {health.error || 'Establishing secure connection to database'}
            </p>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs overflow-hidden"
            >
              <StatusRow label="Authenticated" status={health.isAuthenticated} />
              <StatusRow label="Leads Table" status={health.tablesAccessible.leads} count={health.rlsStatus.leads} />
              <StatusRow label="Contacts Table" status={health.tablesAccessible.contacts} count={health.rlsStatus.contacts} />
              <StatusRow label="Deals Table" status={health.tablesAccessible.deals} count={health.rlsStatus.deals} />
              
              {health.userEmail && (
                <div className="text-[10px] text-slate-400 pt-2">
                  Logged in as: {health.userEmail}
                </div>
              )}
              
              <button
                onClick={refetch}
                className="w-full mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Retry Connection
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const StatusRow: React.FC<{ label: string; status: boolean; count?: number }> = ({ label, status, count }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600 font-medium">{label}</span>
    <div className="flex items-center gap-2">
      {count !== undefined && <span className="text-slate-400">({count})</span>}
      {status ? (
        <CheckCircle2 className="text-emerald-500" size={14} />
      ) : (
        <AlertCircle className="text-rose-500" size={14} />
      )}
    </div>
  </div>
);
