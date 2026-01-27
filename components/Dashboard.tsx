import React from 'react';
import { Lead, Deal } from '../types';
import { DollarSign, Users, Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  deals: Deal[];
}

export const Dashboard: React.FC<DashboardProps> = ({ leads, deals }) => {
  const totalRevenue = deals.reduce((acc, deal) => acc + deal.value, 0);
  const wonDeals = deals.filter(d => d.stage === 'Closed').length;
  const pipelineValue = deals.filter(d => d.stage !== 'Closed').reduce((acc, deal) => acc + deal.value, 0);

  return (
    <div className="h-full overflow-y-auto bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`$${totalRevenue.toLocaleString()}`} 
            trend="+12.5%" 
            isPositive={true}
            icon={<DollarSign size={20} className="text-white" />}
            color="bg-blue-600"
          />
          <StatCard 
            title="Active Leads" 
            value={leads.length.toString()} 
            trend="+5.2%" 
            isPositive={true}
            icon={<Users size={20} className="text-white" />}
            color="bg-purple-600"
          />
          <StatCard 
            title="Pipeline Value" 
            value={`$${pipelineValue.toLocaleString()}`} 
            trend="-2.4%" 
            isPositive={false}
            icon={<TrendingUp size={20} className="text-white" />}
            color="bg-emerald-500"
          />
          <StatCard 
            title="Win Rate" 
            value={deals.length > 0 ? `${Math.round((wonDeals / deals.length) * 100)}%` : '0%'} 
            trend="+1.2%" 
            isPositive={true}
            icon={<Briefcase size={20} className="text-white" />}
            color="bg-orange-500"
          />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Deals */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Opportunities</h2>
            <div className="overflow-hidden">
              {deals.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No recent deals found.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="pb-3 pl-2">Deal Name</th>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Value</th>
                      <th className="pb-3">Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {deals.slice(0, 5).map(deal => (
                      <tr key={deal.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-3 pl-2 text-sm font-medium text-gray-900">{deal.title}</td>
                        <td className="py-3 text-sm text-gray-500">{deal.company}</td>
                        <td className="py-3 text-sm font-semibold text-gray-900">${deal.value.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            deal.stage === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
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

          {/* Quick Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tasks Today</h2>
            <div className="space-y-3">
              {[
                { label: 'Call with Acme Corp', time: '10:00 AM', done: true },
                { label: 'Follow up on proposal', time: '11:30 AM', done: false },
                { label: 'Team Meeting', time: '2:00 PM', done: false },
                { label: 'Update CRM records', time: '4:30 PM', done: false },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${task.done ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                    {task.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.label}</p>
                    <p className="text-xs text-gray-400">{task.time}</p>
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

const StatCard = ({ title, value, trend, isPositive, icon, color }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
      <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
        {trend}
        <span className="text-gray-400 font-normal ml-1">vs last month</span>
      </div>
    </div>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-gray-100 ${color}`}>
      {icon}
    </div>
  </div>
);