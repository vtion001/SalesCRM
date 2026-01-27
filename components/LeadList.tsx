import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Lead } from '../types';

interface LeadListProps {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddLead: () => void;
}

export const LeadList: React.FC<LeadListProps> = ({ leads, selectedId, onSelect, onAddLead }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Lead Pipeline</h2>
          <button 
            onClick={onAddLead}
            className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-sm"
            title="Add New Lead"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex gap-2">
          <FilterPill label="All" active />
          <FilterPill label="New" />
          <FilterPill label="Follow-up" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-6">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Search className="text-gray-300" size={24} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">No leads found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Get started by adding your first lead to the pipeline.</p>
            <button 
              onClick={onAddLead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              + Add Lead
            </button>
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelect(lead.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors relative group ${
                selectedId === lead.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'
              }`}
            >
              {/* Selection Indicator Bar */}
              {selectedId === lead.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
              )}

              <div className="flex items-start gap-3">
                <div className="relative">
                  <img src={lead.avatar} alt={lead.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                  {lead.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm font-semibold truncate ${selectedId === lead.id ? 'text-blue-900' : 'text-gray-900'}`}>
                      {lead.name}
                    </h3>
                    {lead.status === 'Follow-up' && (
                       <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-2">{lead.role}, {lead.company}</p>
                  
                  <div className="flex items-center justify-between">
                    <StatusBadge status={lead.status} />
                    <span className="text-xs text-gray-400 font-medium">{lead.lastActivityTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const FilterPill = ({ label, active }: { label: string; active?: boolean }) => (
  <button
    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const StatusBadge = ({ status }: { status: Lead['status'] }) => {
  const styles = {
    'Follow-up': 'bg-blue-100 text-blue-700',
    'New Lead': 'bg-gray-100 text-gray-700',
    'Closed': 'bg-green-100 text-green-700',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded ${styles[status]}`}>
      {status}
    </span>
  );
};