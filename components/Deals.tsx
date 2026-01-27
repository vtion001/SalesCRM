import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Deal } from '../types';

interface DealsProps {
  deals: Deal[];
  onAddDeal: () => void;
  onDeleteDeal?: (id: string) => void;
}

const STAGES = ['Qualified', 'Proposal', 'Negotiation', 'Closed'];

export const Deals: React.FC<DealsProps> = ({ deals, onAddDeal, onDeleteDeal }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
        <h1 className="text-xl font-bold text-gray-900">Sales Pipeline</h1>
        <button 
          onClick={onAddDeal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} />
          New Deal
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex h-full gap-6 min-w-max">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const totalValue = stageDeals.reduce((acc, curr) => acc + curr.value, 0);

            return (
              <div key={stage} className="w-80 flex flex-col h-full rounded-xl bg-gray-100/50 border border-gray-200">
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{stage}</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">{stageDeals.length}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">${totalValue.toLocaleString()}</p>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-2 relative">
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">{deal.company}</span>
                        <div className="relative">
                          <button 
                            onClick={(e) => toggleMenu(deal.id, e)}
                            className="text-gray-300 hover:text-gray-500 p-1 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            •••
                          </button>
                          
                          {activeMenuId === deal.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10 cursor-default" 
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }}
                              ></div>
                              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1">
                                <button className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">Edit</button>
                                <button className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">Move</button>
                                {onDeleteDeal && (
                                  <button 
                                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 border-t border-gray-50 mt-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteDeal(deal.id);
                                      setActiveMenuId(null);
                                    }}
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{deal.title}</h4>
                      <div className="text-lg font-bold text-gray-900 mb-3">${deal.value.toLocaleString()}</div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[8px] font-bold text-gray-600">
                            {deal.owner.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-400">{deal.closingDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs italic">
                      Empty
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