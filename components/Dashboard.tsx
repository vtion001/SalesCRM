import React from 'react';
import { Lead, Deal } from '../types';
import { DollarSign, Users, Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  deals: Deal[];
}

export const Dashboard: React.FC<DashboardProps> = ({ leads, deals }) => {
  const safeDeals = deals || [];
  const totalRevenue = safeDeals.reduce((acc, deal) => acc + deal.value, 0);
  const wonDeals = safeDeals.filter(d => d.stage === 'Closed').length;
  const pipelineValue = safeDeals.filter(d => d.stage !== 'Closed').reduce((acc, deal) => acc + deal.value, 0);

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Operational summary and performance metrics.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Revenue" 
            value={`$${totalRevenue.toLocaleString()}`} 
            trend="+12.5%" 
            isPositive={true}
            icon={<DollarSign size={20} />}
            color="bg-indigo-600"
            shadow="shadow-indigo-200"
          />
          <StatCard 
            title="Active Leads" 
            value={leads.length.toString()} 
            trend="+5.2%" 
            isPositive={true}
            icon={<Users size={20} />}
            color="bg-fuchsia-600"
            shadow="shadow-fuchsia-200"
          />
          <StatCard 
            title="Pipeline Value" 
            value={`$${pipelineValue.toLocaleString()}`} 
            trend="-2.4%" 
            isPositive={false}
            icon={<TrendingUp size={20} />}
            color="bg-emerald-500"
            shadow="shadow-emerald-200"
          />
          <StatCard 
            title="Win Rate" 
            value={deals.length > 0 ? `${Math.round((wonDeals / deals.length) * 100)}%` : '0%'} 
            trend="+1.2%" 
            isPositive={true}
            icon={<Briefcase size={20} />}
            color="bg-orange-500"
            shadow="shadow-orange-200"
          />
        </div>

        {/* Tables & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Opportunities</h2>
              <button className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">View All</button>
            </div>
            <div className="overflow-hidden">
              {deals.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-bold">No active opportunities</p>
                </div>
              ) : (
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="pb-4 pl-4">Opportunity</th>
                      <th className="pb-4">Company</th>
                      <th className="pb-4">Potential</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.slice(0, 5).map(deal => (
                      <tr key={deal.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 pl-4 rounded-l-2xl text-sm font-bold text-slate-900">{deal.title}</td>
                        <td className="py-4 text-sm font-semibold text-slate-500">{deal.company}</td>
                        <td className="py-4 text-sm font-black text-indigo-600">${deal.value.toLocaleString()}</td>
                        <td className="py-4 rounded-r-2xl">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            deal.stage === 'Closed' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {deal.stage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Schedule</h2>
            <div className="space-y-4">
              {[
                { label: 'Client Discovery Call', time: '10:00 AM', done: true, color: 'bg-indigo-500' },
                { label: 'Proposal Review', time: '11:30 AM', done: false, color: 'bg-fuchsia-500' },
                { label: 'Stakeholder Sync', time: '2:00 PM', done: false, color: 'bg-emerald-500' },
                { label: 'CRM Record Update', time: '4:30 PM', done: false, color: 'bg-orange-500' },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all cursor-pointer group">
                  <div className={`w-1.5 h-8 rounded-full ${task.color} opacity-40 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${task.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.label}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, isPositive, icon, color, shadow }: any) => (
  <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300">
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${color} shadow-xl ${shadow} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`flex items-center text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
          {trend}
        </div>
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all text-slate-900">
      {React.cloneElement(icon as React.ReactElement, { size: 120 })}
    </div>
  </div>
);
