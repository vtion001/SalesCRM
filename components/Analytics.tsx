import React, { useMemo } from 'react';
import { Phone, MessageSquare, TrendingUp, DollarSign, BarChart3, Target, Calendar } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Lead } from '../types';
import { useAllActivities } from '../hooks/useAllActivities';
import { motion } from 'framer-motion';

interface AnalyticsProps {
  items: Lead[];
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

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
  const interactionData = useMemo(() => {
    const calls = activities.filter(a => a.type === 'call').length;
    const sms = activities.filter(a => a.type === 'email' || a.type === 'message' || (a.title && a.title.includes('SMS'))).length;
    
    return [
      { name: 'Voice Calls', value: calls, color: '#6366f1' },
      { name: 'SMS Messages', value: sms, color: '#a855f7' }
    ];
  }, [activities]);

  // 3. Daily Call Tracking (Last 7 Days)
  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const callCount = activities.filter(a => 
        a.type === 'call' && 
        (a as any).created_at && 
        (a as any).created_at.startsWith(date)
      ).length;
      
      const smsCount = activities.filter(a => 
        (a.type === 'email' || a.type === 'message' || (a.title && a.title.includes('SMS'))) && 
        (a as any).created_at && 
        (a as any).created_at.startsWith(date)
      ).length;

      return {
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        calls: callCount,
        sms: smsCount,
        total: callCount + smsCount
      };
    });
  }, [activities]);

  return (
    <div className="h-full overflow-y-auto bg-slate-50/30 p-10 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            Performance Analytics
          </motion.h1>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Intelligence Dashboard</p>
        </header>

        {/* Top Level KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KPIBox label="Pipeline Value" value={`$${metrics.totalPipelineValue.toLocaleString()}`} icon={<DollarSign size={20} />} trend="+14%" />
          <KPIBox label="Weighted Forecast" value={`$${Math.round(metrics.weightedValue).toLocaleString()}`} icon={<TrendingUp size={20} />} trend="+8%" />
          <KPIBox label="Avg. Confidence" value={`${metrics.avgProbability}%`} icon={<Target size={20} />} trend="+2%" />
          <KPIBox label="Total Touchpoints" value={(interactionData[0].value + interactionData[1].value).toString()} icon={<BarChart3 size={20} />} trend="+22%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Engagement Velocity</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Interaction volume per day</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SMS</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      fontWeight: '800',
                      padding: '15px'
                    }} 
                  />
                  <Area type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCalls)" />
                  <Area type="monotone" dataKey="sms" stroke="#a855f7" strokeWidth={4} fillOpacity={1} fill="url(#colorSms)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channel Split */}
          <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-indigo-900/20 text-white">
            <h3 className="text-xl font-black tracking-tight mb-2">Channel Split</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">Preferred communication</p>
            
            <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={interactionData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {interactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '12px', 
                      border: 'none',
                      color: '#fff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black">
                  {interactionData.reduce((a, b) => a + b.value, 0)}
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase">Total</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {interactionData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-black">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPIBox = ({ label, value, icon, trend }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
        {icon}
      </div>
      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
        {trend}
      </span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
  </motion.div>
);