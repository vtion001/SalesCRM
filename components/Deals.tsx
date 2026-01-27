import React, { useState } from 'react';
import { Plus, ChevronRight, ChevronLeft, Target, DollarSign, Calendar, MoreHorizontal, Trash2, Edit2, Check, Clock } from 'lucide-react';
import { Lead } from '../types';

interface DealsProps {
  items: Lead[];
  onUpdateItem: (id: string, updates: Partial<Lead>) => void;
  onDeleteItem: (id: string) => void;
  onAddNew: () => void;
}

const STAGES: Lead['status'][] = ['New Lead', 'Follow-up', 'Closed'];

export const Deals: React.FC<DealsProps> = ({ items, onUpdateItem, onDeleteItem, onAddNew }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [editProb, setEditProb] = useState<number>(0);

  const startEditing = (item: Lead) => {
    setEditValue(item.dealValue);
    setEditProb(item.probability);
    setEditingId(item.id);
  };

  const saveEdits = (id: string) => {
    onUpdateItem(id, { dealValue: editValue, probability: editProb });
    setEditingId(null);
  };

  const moveStage = (item: Lead, direction: 'next' | 'prev') => {
    const currentIndex = STAGES.indexOf(item.status);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < STAGES.length) {
      onUpdateItem(item.id, { status: STAGES[nextIndex] });
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/30">
      {/* Header */}
      <div className="px-10 py-8 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Pipeline</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Opportunity Management Board</p>
        </div>
        <button 
          onClick={onAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-[20px] text-sm font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          New Opportunity
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-10 custom-scrollbar">
        <div className="flex h-full gap-10 min-w-max">
          {STAGES.map((stage) => {
            const stageItems = (items || []).filter(i => i.status === stage);
            const totalValue = stageItems.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);

            return (
              <div key={stage} className="w-[340px] flex flex-col h-full group/column">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-6 px-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-[0.2em]">{stage}</h3>
                    <span className="bg-white border-2 border-slate-100 text-slate-400 text-[10px] px-2.5 py-1 rounded-xl font-black shadow-sm group-hover/column:border-indigo-200 group-hover/column:text-indigo-500 transition-colors">
                      {stageItems.length}
                    </span>
                  </div>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-xl border border-indigo-100/50">
                    ${totalValue.toLocaleString()}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2 custom-scrollbar">
                  {stageItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white p-6 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-transparent hover:border-indigo-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group relative cursor-default"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <img src={item.avatar} className="w-8 h-8 rounded-2xl border-2 border-white shadow-md object-cover" alt="" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[140px]">
                            {item.company}
                          </span>
                        </div>
                        <button 
                          onClick={() => onDeleteItem(item.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <h4 className="font-black text-slate-900 text-base mb-6 leading-tight tracking-tight">{item.name}</h4>
                      
                      {editingId === item.id ? (
                        <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-[24px] border-2 border-indigo-100 animate-fade-in">
                          <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Value ($)</label>
                            <input 
                              type="number" 
                              className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-black focus:border-indigo-500 outline-none transition-all"
                              value={editValue}
                              onChange={e => setEditValue(Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Probability (%)</label>
                            <input 
                              type="number" 
                              className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-black focus:border-indigo-500 outline-none transition-all"
                              value={editProb}
                              onChange={e => setEditProb(Number(e.target.value))}
                            />
                          </div>
                          <button 
                            onClick={() => saveEdits(item.id)}
                            className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                          >
                            <Check size={14} /> Commit Changes
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div className="cursor-pointer group/stat" onClick={() => startEditing(item)}>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/stat:text-indigo-500 transition-colors text-tighter">Value</p>
                            <p className="text-base font-black text-slate-900 tracking-tighter">${(item.dealValue || 0).toLocaleString()}</p>
                          </div>
                          <div className="cursor-pointer group/stat" onClick={() => startEditing(item)}>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/stat:text-indigo-500 transition-colors text-tighter">Prob.</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${item.probability}%` }}></div>
                              </div>
                              <span className="text-[11px] font-black text-slate-900">{item.probability}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                        <div className="flex gap-2">
                          <button 
                            disabled={STAGES.indexOf(item.status) === 0}
                            onClick={() => moveStage(item, 'prev')}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl disabled:opacity-20 transition-all active:scale-90"
                          >
                            <ChevronLeft size={18} strokeWidth={3} />
                          </button>
                          <button 
                            disabled={STAGES.indexOf(item.status) === STAGES.length - 1}
                            onClick={() => moveStage(item, 'next')}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl disabled:opacity-20 transition-all active:scale-90"
                          >
                            <ChevronRight size={18} strokeWidth={3} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                          <Clock size={12} className="text-slate-400" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.lastContactDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageItems.length === 0 && (
                    <div className="h-40 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-300 p-8 text-center bg-slate-50/30">
                      <Target size={32} className="mb-3 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No active deals</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
