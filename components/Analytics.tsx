import React, { useMemo } from 'react';
import { Phone, MessageSquare, TrendingUp, DollarSign, BarChart3, Target } from 'lucide-react';
import { Lead } from '../types';
import { useAllActivities } from '../hooks/useAllActivities';

interface AnalyticsProps {
  items: Lead[]; // Combined leads and contacts
}

export const Analytics: React.FC<AnalyticsProps> = ({ items }) => {
  const { activities, loading: loadingActivities } = useAllActivities();

  // 1. Calculate Pipeline Metrics
  const metrics = useMemo(() => {
    const totalPipelineValue = items.reduce((sum, item) => sum + (item.dealValue || 0), 0);
    const weightedValue = items.reduce((sum, item) => sum + ((item.dealValue || 0) * (item.probability || 0) / 100), 0);
    const avgProbability = items.length > 0 
      ? Math.round(items.reduce((sum, item) => sum + (item.probability || 0), 0) / items.length)
      : 0;

    return { totalPipelineValue, weightedValue, avgProbability };
  }, [items]);

  // 2. Interaction Metrics
  const interactions = useMemo(() => {
    const calls = activities.filter(a => a.type === 'call').length;
    const sms = activities.filter(a => a.type === 'email' || a.type === 'message' || (a.title && a.title.includes('SMS'))).length;
    const total = calls + sms;
    
    return {
      calls,
      sms,
      callRate: total > 0 ? Math.round((calls / total) * 100) : 0,
      smsRate: total > 0 ? Math.round((sms / total) * 100) : 0
    };
  }, [activities]);

  // 3. Daily Call Tracking (Last 7 Days)
  const dailyCallData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const count = activities.filter(a => 
        a.type === 'call' && 
        (a as any).created_at && 
        (a as any).created_at.startsWith(date)
      ).length;
      
      // For display, if count is 0 but we have "Just now" activities that don't have created_at yet in local state
      // This is a fallback for better demo feel
      return { date, count: count || (date === new Date().toISOString().split('T')[0] ? 0 : 0) };
    });
  }, [activities]);

  const maxCalls = Math.max(...dailyCallData.map(d => d.count), 5);

  return (
    <div className="h-full overflow-y-auto bg-gray-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Performance Analytics</h1>
            <p className="text-gray-500 font-medium">Real-time tracking of your sales operations</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              LIVE DATA
            </span>
          </div>
        </div>

        {/* Top Level KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPIBox 
            label="Pipeline Value" 
            value={`$${metrics.totalPipelineValue.toLocaleString()}`} 
            icon={<DollarSign className="text-blue-600" size={20} />}
            color="border-blue-100"
          />
          <KPIBox 
            label="Weighted Forecast" 
            value={`$${Math.round(metrics.weightedValue).toLocaleString()}`} 
            icon={<TrendingUp className="text-green-600" size={20} />}
            color="border-green-100"
          />
          <KPIBox 
            label="Avg. Probability" 
            value={`${metrics.avgProbability}%`} 
            icon={<Target className="text-purple-600" size={20} />}
            color="border-purple-100"
          />
          <KPIBox 
            label="Total Interactions" 
            value={(interactions.calls + interactions.sms).toString()} 
            icon={<BarChart3 className="text-orange-600" size={20} />}
            color="border-orange-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Daily Call Volume Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Phone size={18} className="text-blue-600" />
                Daily Call Volume
              </h3>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 7 Days</span>
            </div>
            <div className="h-64 flex items-end gap-4 px-2">
               {dailyCallData.map((d, i) => {
                 const height = (d.count / maxCalls) * 100;
                 return (
                   <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                     <div 
                       className="w-full bg-blue-50 group-hover:bg-blue-600 transition-all rounded-t-lg relative min-h-[4px]" 
                       style={{ height: `${height}%` }}
                     >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg whitespace-nowrap transition-all z-10">
                          {d.count} Calls
                        </div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 text-center mt-3 block">
                       {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
                     </span>
                   </div>
                 );
               })}
            </div>
          </div>

          {/* Interaction Distribution */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
             <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
               <MessageSquare size={18} className="text-purple-600" />
               Channel Split
             </h3>
             <div className="flex-1 flex flex-col justify-center space-y-8">
                <DistributionBar 
                  label="Voice Calls" 
                  value={interactions.calls} 
                  percentage={interactions.callRate} 
                  color="bg-blue-600" 
                  icon={<Phone size={14} />}
                />
                <DistributionBar 
                  label="SMS Messages" 
                  value={interactions.sms} 
                  percentage={interactions.smsRate} 
                  color="bg-purple-600" 
                  icon={<MessageSquare size={14} />}
                />
             </div>
             <div className="mt-8 pt-6 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Total Engagement: {interactions.calls + interactions.sms} units
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DistributionBar = ({ label, value, percentage, color, icon }: any) => (
  <div>
    <div className="flex justify-between items-end mb-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${color} text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">{label}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">{value} total</p>
        </div>
      </div>
      <span className="text-sm font-black text-gray-900">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

const KPIBox = ({ label, value, icon, color }: any) => (
  <div className={`bg-white border-2 ${color} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      {icon}
    </div>
    <p className="text-2xl font-black text-gray-900">{value}</p>
  </div>
);
