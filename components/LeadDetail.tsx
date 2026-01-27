import React from 'react';
import { Mail, Phone, Clock, Pin, User, FolderOpen } from 'lucide-react';
import { Lead, Activity, Note } from '../types';

interface LeadDetailProps {
  lead: Lead | undefined;
  activities: Activity[];
  note: Note | undefined;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, activities, note }) => {
  if (!lead) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-100">
          <FolderOpen className="text-blue-500" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No Lead Selected</h3>
        <p className="text-gray-500 max-w-xs mt-2">Select a lead from the list or create a new one to view details and activity timelines.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white p-8">
      {/* Header Profile */}
      <div className="flex items-start gap-6 mb-8">
        <img src={lead.avatar} alt={lead.name} className="w-20 h-20 rounded-xl object-cover shadow-sm bg-gray-200" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{lead.name}</h1>
          <p className="text-gray-500 text-base mb-4">
            {lead.role} at <span className="text-gray-900 font-medium">{lead.company}</span>
          </p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors">
              <Mail size={16} />
              <span>{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors">
              <Phone size={16} />
              <span>{lead.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Deal Value" value={`$${lead.dealValue.toLocaleString()}`} color="text-blue-600" />
        <StatCard label="Probability" value={`${lead.probability}%`} color="text-gray-900" />
        <StatCard label="Last Contact" value={lead.lastContactDate} color="text-gray-900" />
      </div>

      {/* Activity Timeline */}
      <div className="mb-10">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
          <Clock size={20} className="text-gray-900" />
          Activity Timeline
        </h3>
        
        {activities.length > 0 ? (
          <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-8">
                {/* Timeline Node */}
                <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white ${
                  activity.type === 'call' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                      {activity.type === 'call' ? <Phone size={16} /> : <Mail size={16} />}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
                    <span className="text-xs text-gray-400 font-medium">{activity.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {activity.description}
                    {activity.duration && (
                       <span className="block mt-2 text-xs font-medium text-gray-500">Duration: {activity.duration}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-sm text-gray-500">No recent activity recorded.</p>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Notes</h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            + New Note
          </button>
        </div>

        {note ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative">
             <p className="text-gray-700 leading-relaxed mb-6">
               {note.content}
             </p>
             <div className="flex items-center justify-between border-t border-gray-100 pt-3">
               <span className="text-xs text-gray-400 italic">Pinned by {note.author}</span>
               {note.isPinned && <Pin size={14} className="text-gray-400" fill="currentColor" />}
             </div>
          </div>
        ) : (
          <div className="text-center py-6 border border-gray-200 rounded-xl text-gray-400 text-sm italic">
            No notes available.
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center">
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block h-8 flex items-center justify-center leading-tight">
        {label.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}
    </span>
    <span className={`text-2xl font-bold ${color}`}>{value}</span>
  </div>
);