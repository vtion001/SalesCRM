import React, { useMemo } from 'react';
import { Lead } from '../types';
import { DollarSign, Users, Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, Phone } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface DashboardProps {
  leads: Lead[];
  deals: Lead[]; // Using unified pipeline items
  onNavigate: (view: string) => void;
  onSelectLead: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ leads, deals, onNavigate, onSelectLead }) => {
  const safeDeals = deals || [];
  
  const totalRevenue = safeDeals.reduce((acc, deal) => acc + (deal.dealValue || 0), 0);
  const wonDeals = safeDeals.filter(d => d.status === 'Closed').length;
  const pipelineValue = safeDeals.filter(d => d.status !== 'Closed').reduce((acc, deal) => acc + (deal.dealValue || 0), 0);

  // Sparkline data for pipeline health
  const sparklineData = [
    { v: 400 }, { v: 300 }, { v: 600 }, { v: 800 }, { v: 500 }, { v: 900 }, { v: 1100 }
  ];

  const handleTaskClick = (label: string) => {
    toast.success(`Task "${label}" is scheduled for today.`, {
      icon: '📅',
      style: { borderRadius: '16px', fontWeight: 'bold' }
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-10 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-slate-900 tracking-tight"
            >
              Executive Summary
            </motion.h1>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Real-time revenue operations</p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase">System Active</span>
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} trend="+12.5%" isPositive icon={<DollarSign size={20} />} color="bg-indigo-600" shadow="shadow-indigo-200" onClick={() => onNavigate('analytics')} />
          <StatCard title="Active Leads" value={leads.length.toString()} trend="+5.2%" isPositive icon={<Users size={20} />} color="bg-fuchsia-600" shadow="shadow-fuchsia-200" onClick={() => onNavigate('leads')} />
          <StatCard title="Pipeline Value" value={`$${pipelineValue.toLocaleString()}`} trend="-2.4%" isPositive={false} icon={<TrendingUp size={20} />} color="bg-emerald-500" shadow="shadow-emerald-200" onClick={() => onNavigate('deals')} />
          <StatCard title="Win Rate" value={deals.length > 0 ? `${Math.round((wonDeals / deals.length) * 100)}%` : '0%'} trend="+1.2%" isPositive icon={<Briefcase size={20} />} color="bg-orange-500" shadow="shadow-orange-200" onClick={() => onNavigate('analytics')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Opportunities Table */}
          <div className="lg:col-span-2 bg-white rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] border border-slate-100 p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Prime Opportunities</h2>
              <button 
                onClick={() => onNavigate('deals')}
                className="px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                View Full Pipeline
              </button>
            </div>
            
            <div className="overflow-hidden">
              {deals.length === 0 ? (
                <div className="text-center py-20 text-slate-300">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">No Active Pursuits</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                      <th className="pb-6 pl-4">Lead Entity</th>
                      <th className="pb-6">Valuation</th>
                      <th className="pb-6">Progression</th>
                      <th className="pb-6 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {deals.slice(0, 5).map((deal, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={deal.id} 
                        className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                        onClick={() => onSelectLead(deal.id)}
                      >
                        <td className="py-6 pl-4">
                          <div className="flex items-center gap-4">
                            <img src={deal.avatar} className="w-10 h-10 rounded-2xl border border-slate-100 shadow-sm" alt="" />
                            <div>
                              <p className="text-sm font-black text-slate-900">{deal.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{deal.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">
                          <span className="text-sm font-black text-slate-900">${(deal.dealValue || 0).toLocaleString()}</span>
                        </td>
                        <td className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: deal.status === 'Closed' ? '100%' : '65%' }}></div>
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase">{deal.status}</span>
                          </div>
                        </td>
                        <td className="py-6 text-right pr-4">
                          <button className="p-2 text-slate-300 group-hover:text-indigo-600 group-hover:bg-white rounded-xl shadow-none group-hover:shadow-lg transition-all active:scale-90">
                            <ArrowUpRight size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Activity Feed / Tasks */}
          <div className="flex flex-col gap-8">
            <div className="bg-slate-900 rounded-[48px] p-10 shadow-2xl shadow-indigo-900/20 text-white relative overflow-hidden">
              <h2 className="text-xl font-black tracking-tight mb-2">Network Health</h2>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">Weekly Growth Velocity</p>
              
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData}>
                    <Area type="monotone" dataKey="v" stroke="#818cf8" strokeWidth={4} fill="#818cf8" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black">+42%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Conversion Lift</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                  <TrendingUp className="text-indigo-400" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] border border-slate-100 p-10 flex-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Priority Queue</h2>
              <div className="space-y-6">
                {[
                  { label: 'Follow-up Call', company: 'TechNova', time: '10:30 AM', icon: <Phone size={14} />, color: 'bg-indigo-50 text-indigo-600' },
                  { label: 'Contract Send', company: 'GlobalLogistics', time: '1:00 PM', icon: <CheckCircle2 size={14} />, color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Demo Session', company: 'PulseAI', time: '3:45 PM', icon: <Users size={14} />, color: 'bg-fuchsia-50 text-fuchsia-600' },
                ].map((task, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleTaskClick(task.label)}
                    className="flex items-center gap-5 group cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${task.color}`}>
                      {task.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">{task.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{task.company}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-black text-slate-900">{task.time}</p>
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Ready</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, isPositive, icon, color, shadow, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    onClick={onClick}
    className="bg-white rounded-[40px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 relative overflow-hidden group transition-all duration-500 cursor-pointer"
  >
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${color} shadow-2xl ${shadow} group-hover:rotate-6 transition-all duration-500`}>
          {icon}
        </div>
        <div className={`flex items-center text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
      </div>
    </div>
    <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-125 transition-all duration-700 text-slate-900">
      {React.cloneElement(icon as React.ReactElement, { size: 160 })}
    </div>
  </motion.div>
);
