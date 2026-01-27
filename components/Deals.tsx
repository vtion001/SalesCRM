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
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Manage opportunities across your pipeline</p>
        </div>
        <button 
          onClick={onAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={18} />
          Add opportunity
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-8">
        <div className="flex h-full gap-8 min-w-max">
          {STAGES.map((stage) => {
            const stageItems = (items || []).filter(i => i.status === stage);
            const totalValue = stageItems.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);

            return (
              <div key={stage} className="w-80 flex flex-col h-full">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{stage}</h3>
                    <span className="bg-white border border-gray-200 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                      {stageItems.length}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    ${totalValue.toLocaleString()}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                  {stageItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group relative"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <img src={item.avatar} className="w-6 h-6 rounded-full border border-gray-100" alt="" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate max-w-[120px]">
                            {item.company}
                          </span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-gray-900 text-sm mb-4 leading-tight">{item.name}</h4>
                      
                      {/* Editable Fields */}
                      {editingId === item.id ? (
                        <div className="space-y-3 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Value ($)</label>
                            <input 
                              type="number" 
                              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                              value={editValue}
                              onChange={e => setEditValue(Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Probability (%)</label>
                            <input 
                              type="number" 
                              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                              value={editProb}
                              onChange={e => setEditProb(Number(e.target.value))}
                            />
                          </div>
                          <button 
                            onClick={() => saveEdits(item.id)}
                            className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <Check size={14} /> Save
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" onClick={() => startEditing(item)}>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Deal Value</p>
                            <p className="text-sm font-black text-gray-900">${(item.dealValue || 0).toLocaleString()}</p>
                          </div>
                          <div className="cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" onClick={() => startEditing(item)}>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Probability</p>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full" 
                                  style={{ width: `${item.probability}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-gray-700">{item.probability}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                        <div className="flex gap-1">
                          <button 
                            disabled={STAGES.indexOf(item.status) === 0}
                            onClick={() => moveStage(item, 'prev')}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 transition-all"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button 
                            disabled={STAGES.indexOf(item.status) === STAGES.length - 1}
                            onClick={() => moveStage(item, 'next')}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 transition-all"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-300" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{item.lastContactDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageItems.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                      <Target size={24} className="mb-2 opacity-20" />
                      <p className="text-xs font-medium italic">Drop items here</p>
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