import React, { useState } from 'react';
import { Plus, ChevronRight, ChevronLeft, Target, Clock, Trash2, Check, X, MoreHorizontal } from 'lucide-react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '../types';

interface DealsProps {
  items: Lead[];
  onUpdateItem: (id: string, updates: Partial<Lead>) => void;
  onDeleteItem: (id: string) => void;
  onAddNew: () => void;
}

const STAGES: Lead['status'][] = ['New Lead', 'Follow-up', 'Closed'];

export const Deals: React.FC<DealsProps> = ({ items, onUpdateItem, onDeleteItem, onAddNew }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [editProb, setEditProb] = useState<number>(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drags when clicking to edit
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find(i => i.id === active.id);
    const overId = over.id as string;

    // Logic for dragging over a column/container
    if (STAGES.includes(overId as any)) {
      const newStatus = overId as Lead['status'];
      if (activeItem && activeItem.status !== newStatus) {
        onUpdateItem(activeItem.id, { status: newStatus });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeItem = items.find(i => i.id === active.id);
      const overItem = items.find(i => i.id === over.id);
      
      if (activeItem && overItem && activeItem.status !== overItem.status) {
        onUpdateItem(activeItem.id, { status: overItem.status });
      }
    }
    
    setActiveId(null);
  };

  const startEditing = (item: Lead) => {
    setEditValue(item.dealValue);
    setEditProb(item.probability);
    setEditingId(item.id);
  };

  const saveEdits = (id: string) => {
    onUpdateItem(id, { dealValue: editValue, probability: editProb });
    setEditingId(null);
  };

  const activeItem = items.find(i => i.id === activeId);

  return (
    <div className="h-full flex flex-col bg-slate-50/30">
      <div className="px-10 py-8 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Pipeline</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Drag and drop to manage deals</p>
        </div>
        <button 
          onClick={onAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-[20px] text-sm font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          New Opportunity
        </button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto p-10 custom-scrollbar">
          <div className="flex h-full gap-10 min-w-max">
            {STAGES.map((stage) => (
              <DealColumn 
                key={stage}
                stage={stage}
                items={items.filter(i => i.status === stage)}
                editingId={editingId}
                editValue={editValue}
                editProb={editProb}
                setEditValue={setEditValue}
                setEditProb={setEditProb}
                startEditing={startEditing}
                saveEdits={saveEdits}
                onDeleteItem={onDeleteItem}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeId && activeItem ? (
            <div className="w-[300px] rotate-3 scale-105 pointer-events-none">
               <DealCard 
                 item={activeItem} 
                 isOverlay 
                 startEditing={() => {}} 
                 onDeleteItem={() => {}}
               />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

interface ColumnProps {
  stage: Lead['status'];
  items: Lead[];
  editingId: string | null;
  editValue: number;
  editProb: number;
  setEditValue: (v: number) => void;
  setEditProb: (v: number) => void;
  startEditing: (item: Lead) => void;
  saveEdits: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

const DealColumn: React.FC<ColumnProps> = ({ 
  stage, items, editingId, editValue, editProb, setEditValue, setEditProb, startEditing, saveEdits, onDeleteItem 
}) => {
  const totalValue = items.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);

  return (
    <div className="w-[340px] flex flex-col h-full group/column">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-[0.2em]">{stage}</h3>
          <span className="bg-white border-2 border-slate-100 text-slate-400 text-[10px] px-2.5 py-1 rounded-xl font-black shadow-sm group-hover/column:border-indigo-200 transition-colors">
            {items.length}
          </span>
        </div>
        <span className="text-xs font-black text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-xl border border-indigo-100/50">
          ${totalValue.toLocaleString()}
        </span>
      </div>

      <SortableContext 
        id={stage}
        items={items.map(i => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2 custom-scrollbar min-h-[150px]">
          {items.map((item) => (
            <SortableDealCard 
              key={item.id} 
              item={item} 
              isEditing={editingId === item.id}
              editValue={editValue}
              editProb={editProb}
              setEditValue={setEditValue}
              setEditProb={setEditProb}
              startEditing={startEditing}
              saveEdits={saveEdits}
              onDeleteItem={onDeleteItem}
            />
          ))}
          
          {items.length === 0 && (
            <div className="h-40 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-300 p-8 text-center bg-slate-50/30">
              <Target size={32} className="mb-3 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">Drop deals here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const SortableDealCard = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <DealCard {...props} />
    </div>
  );
};

const DealCard = ({ item, isEditing, editValue, editProb, setEditValue, setEditProb, startEditing, saveEdits, onDeleteItem, isOverlay }: any) => {
  return (
    <div className={`bg-white p-6 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-transparent hover:border-indigo-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group relative ${isOverlay ? 'shadow-2xl border-indigo-200' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img src={item.avatar} className="w-8 h-8 rounded-2xl border-2 border-white shadow-md object-cover" alt="" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[140px]">
            {item.company}
          </span>
        </div>
        {!isOverlay && (
          <button 
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking delete
            onClick={() => onDeleteItem(item.id)}
            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <h4 className="font-black text-slate-900 text-base mb-6 leading-tight tracking-tight">{item.name}</h4>
      
      {isEditing ? (
        <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-[24px] border-2 border-indigo-100 animate-fade-in" onPointerDown={e => e.stopPropagation()}>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Value ($)</label>
            <input 
              type="number" 
              className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-black focus:border-indigo-500 outline-none"
              value={editValue}
              onChange={e => setEditValue(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Probability (%)</label>
            <input 
              type="number" 
              className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-black focus:border-indigo-500 outline-none"
              value={editProb}
              onChange={e => setEditProb(Number(e.target.value))}
            />
          </div>
          <button 
            onClick={() => saveEdits(item.id)}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg"
          >
            <Check size={14} /> Commit Changes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div 
            className="cursor-pointer group/stat" 
            onPointerDown={e => e.stopPropagation()} 
            onClick={() => startEditing(item)}
          >
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/stat:text-indigo-500 transition-colors">Value</p>
            <p className="text-base font-black text-slate-900 tracking-tighter">${(item.dealValue || 0).toLocaleString()}</p>
          </div>
          <div 
            className="cursor-pointer group/stat" 
            onPointerDown={e => e.stopPropagation()} 
            onClick={() => startEditing(item)}
          >
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/stat:text-indigo-500 transition-colors">Prob.</p>
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
          <Clock size={12} className="text-slate-400" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.lastContactDate}</span>
        </div>
        {!isOverlay && (
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal size={12} className="text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
};