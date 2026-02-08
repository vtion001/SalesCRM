import React, { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { getCallLogs } from '../services/twilioService';
import { Lead } from '../types';
import { formatDuration } from '../utils/formatter'; // Assuming there is one, or I will helper it

interface CallHistoryListProps {
  targetLead?: Lead;
}

export const CallHistoryList: React.FC<CallHistoryListProps> = ({ targetLead }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!targetLead) return;

    setIsLoading(true);
    setError(null);
    try {
      // Fetch calls where destination is lead's phone
      const data = await getCallLogs({ to: targetLead.phone, limit: 10 });
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load call logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [targetLead]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-brand-700 bg-brand-50';
      case 'busy': return 'text-accent-600 bg-accent-50';
      case 'no-answer': return 'text-accent-700 bg-accent-50';
      case 'failed': return 'text-accent-700 bg-accent-100';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getDirectionIcon = (direction: string) => {
    if (direction.includes('inbound')) return <PhoneIncoming size={14} className="text-brand-500" />;
    return <PhoneOutgoing size={14} className="text-accent-500" />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!targetLead) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
          <Clock size={24} />
        </div>
        <p className="text-sm font-medium">Select a lead to view call history</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Calls</h3>
        <button 
          onClick={fetchLogs}
          disabled={isLoading}
          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && logs.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw size={20} className="text-brand-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="m-4 p-4 bg-accent-50 border border-accent-100 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="text-accent-600 flex-shrink-0" />
            <div className="text-xs text-accent-700">{error}</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Phone size={24} />
            </div>
            <p className="text-sm font-medium">No calls found for this lead</p>
            <p className="text-[10px] mt-1">Logs from Twilio will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((call) => (
              <div key={call.sid} className="px-4 py-3 bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {getDirectionIcon(call.direction)}
                    <span className="text-sm font-semibold text-slate-900">
                      {call.direction.includes('inbound') ? 'Inbound' : 'Outbound'}
                    </span>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${getStatusColor(call.status)}`}>
                    {call.status}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock size={10} />
                    {formatDate(call.startTime)}
                  </span>
                  <span>{formatDuration(call.duration)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
