import React from 'react';
import { Lead, Deal } from '../types';

interface AnalyticsProps {
  leads: Lead[];
  deals: Deal[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ leads, deals }) => {
  return (
    <div className="h-full overflow-y-auto bg-white p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Performance Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart Placeholder */}
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Revenue Growth</h3>
          <div className="h-64 flex items-end gap-4 px-2">
             {[45, 60, 55, 70, 65, 80, 75, 90, 85, 95, 100, 92].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                 <div 
                   className="w-full bg-blue-100 group-hover:bg-blue-600 transition-colors rounded-t-sm relative" 
                   style={{ height: `${h}%` }}
                 >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">
                      ${(h * 1000).toLocaleString()}
                    </div>
                 </div>
                 <span className="text-xs text-gray-400 text-center mt-2 block">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Lead Source Distribution */}
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-6">Lead Sources</h3>
           <div className="space-y-4">
              <Bar label="LinkedIn Outreach" value="45%" color="bg-blue-600" />
              <Bar label="Website Referrals" value="32%" color="bg-purple-600" />
              <Bar label="Cold Calls" value="15%" color="bg-orange-500" />
              <Bar label="Events & Conferences" value="8%" color="bg-green-500" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <KPIBox label="Avg. Response Time" value="2.4 hrs" sub="-15% improvement" />
         <KPIBox label="Customer Lifetime Value" value="$12,500" sub="+8% vs last month" />
         <KPIBox label="Churn Rate" value="1.2%" sub="Within healthy range" />
      </div>
    </div>
  );
};

const Bar = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div>
    <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: value }}></div>
    </div>
  </div>
);

const KPIBox = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
    <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-green-600 font-medium mt-2">{sub}</p>
  </div>
);