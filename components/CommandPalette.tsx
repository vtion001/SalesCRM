import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Briefcase, Plus, Phone, MessageSquare, Zap, X, Command } from 'lucide-react';
import { Lead } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: Lead[];
  onSelectItem: (id: string) => void;
  onAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, onClose, items, onSelectItem, onAction 
}) => {
  const [query, setQuery] = useState('');

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null; // Handled by parent but good to have
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    if (!query) return [];
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.company.toLowerCase().includes(query.toLowerCase()) ||
      item.email.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query, items]);

  const actions = [
    { id: 'add-lead', label: 'Create New Lead', icon: <Plus size={16} />, color: 'text-indigo-500' },
    { id: 'add-contact', label: 'Add New Contact', icon: <User size={16} />, color: 'text-fuchsia-500' },
    { id: 'view-analytics', label: 'Open Analytics', icon: <Zap size={16} />, color: 'text-amber-500' },
  ].filter(a => !query || a.label.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-white rounded-[32px] shadow-[0_32px_128px_rgba(0,0,0,0.2)] overflow-hidden border border-white relative z-10"
        >
          {/* Search Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Command size={20} strokeWidth={3} />
            </div>
            <input 
              autoFocus
              placeholder="Search anything or trigger an action..."
              className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-900 placeholder:text-slate-300"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-black text-slate-400">ESC</span>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
            {/* Quick Actions */}
            {actions.length > 0 && (
              <div className="mb-6">
                <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">System Actions</p>
                <div className="space-y-1">
                  {actions.map(action => (
                    <button 
                      key={action.id}
                      onClick={() => { onAction(action.id); onClose(); }}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-all group text-left"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {filteredItems.length > 0 && (
              <div>
                <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Database Results</p>
                <div className="space-y-1">
                  {filteredItems.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => { onSelectItem(item.id); onClose(); }}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-indigo-50/50 rounded-2xl transition-all group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <img src={item.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:rotate-3 transition-transform" />
                        <div>
                          <p className="text-sm font-black text-slate-900">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-1 rounded-lg border border-indigo-100">JUMP TO</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && actions.length === 0 && filteredItems.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-200" size={24} />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching records found</p>
              </div>
            )}
          </div>

          {/* Footer Footer */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">↑</div>
              <div className="w-5 h-5 bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">↓</div>
              <span className="text-[10px] font-black text-slate-400 uppercase">Navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-5 bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">ENTER</div>
              <span className="text-[10px] font-black text-slate-400 uppercase">Select</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
