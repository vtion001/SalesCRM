import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { Lead } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadListProps {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddLead: () => void;
}

type FilterStatus = 'All' | 'New Lead' | 'Follow-up' | 'Closed';

export const LeadList: React.FC<LeadListProps> = ({ leads, selectedId, onSelect, onAddLead }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'All' || lead.status === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [leads, searchQuery, activeFilter]);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-8 border-b border-slate-50 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Pipeline</h2>
          <button 
            onClick={onAddLead}
            className="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            title="Add Lead"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-xl text-xs font-bold outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
          {(['All', 'New Lead', 'Follow-up'] as FilterStatus[]).map((status) => (
            <FilterPill 
              key={status}
              label={status === 'New Lead' ? 'New' : status === 'Follow-up' ? 'Hot' : status} 
              active={activeFilter === status}
              onClick={() => setActiveFilter(status)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredLeads.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center px-8"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="text-slate-200" size={32} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No matching leads</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Try adjusting your filters or search query.</p>
            </motion.div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={lead.id}
                  onClick={() => onSelect(lead.id)}
                  className={`p-6 cursor-pointer transition-all relative group ${
                    selectedId === lead.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'
                  }`}
                >
                  {selectedId === lead.id && (
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-indigo-600 rounded-r-full shadow-[2px_0_10px_rgba(79,70,229,0.4)]"></div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <img src={lead.avatar} alt={lead.name} className={`w-12 h-12 rounded-2xl object-cover bg-slate-100 ring-2 ring-offset-2 transition-all ${selectedId === lead.id ? 'ring-indigo-500 shadow-lg' : 'ring-transparent'}`} />
                      {lead.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-sm font-black truncate leading-tight ${selectedId === lead.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                          {lead.name}
                        </h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap ml-2">
                          {lead.lastActivityTime}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 truncate mb-3 uppercase tracking-wider">{lead.company}</p>
                      
                      <div className="flex items-center justify-between">
                        <StatusBadge status={lead.status} />
                        <div className="flex -space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="w-5 h-5 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                             <ChevronRight size={10} strokeWidth={3} />
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
      active
        ? 'bg-white text-indigo-600 shadow-sm'
        : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {label}
  </button>
);

const StatusBadge = ({ status }: { status: Lead['status'] }) => {
  const styles = {
    'Follow-up': 'bg-amber-50 text-amber-600 border-amber-100',
    'New Lead': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'Closed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border ${styles[status]}`}>
      {status}
    </span>
  );
};
