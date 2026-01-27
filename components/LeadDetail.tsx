import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Pin, FolderOpen, Trash2, MoreHorizontal, Send, Plus, MessageSquare, Check, X, Target, DollarSign, Edit3, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, Activity, Note } from '../types';

interface LeadDetailProps {
  lead: Lead | undefined;
  activities: Activity[];
  note: Note | undefined;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Lead>) => void;
  onAddNote?: (note: Omit<Note, 'id'>) => void;
  onAddActivity?: (activity: Omit<Activity, 'id'>) => void;
  onDial?: () => void;
  onMessage?: () => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ 
  lead, activities, note, onDelete, onUpdate, onAddNote, onAddActivity, onDial, onMessage
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingStat, setEditingStat] = useState<'dealValue' | 'probability' | null>(null);
  const [tempStatValue, setTempStatValue] = useState<number>(0);
  const [editData, setEditData] = useState<Partial<Lead>>({});

  useEffect(() => {
    setEditingStat(null);
    setIsEditingProfile(false);
    setIsAddingNote(false);
    setShowOptions(false);
  }, [lead?.id]);

  if (!lead) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm p-12 text-center">
        <motion.div initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 3 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-24 h-24 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center justify-center mb-8 border border-slate-50"><FolderOpen className="text-indigo-500" size={40} /></motion.div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Select an Entity</h3>
        <p className="text-slate-400 max-w-xs mt-3 font-medium">Choose a lead or contact from the pipeline to view their detailed activity feed and metrics.</p>
      </motion.div>
    );
  }

  const handleStartEdit = () => {
    setEditData({ name: lead.name, role: lead.role, company: lead.company, email: lead.email, phone: lead.phone });
    setIsEditingProfile(true);
    setShowOptions(false);
  };

  const handleSaveProfile = async () => {
    if (onUpdate) await onUpdate(lead.id, editData);
    setIsEditingProfile(false);
  };

  const handleSaveStat = async () => {
    if (onUpdate && editingStat) {
      await onUpdate(lead.id, { [editingStat]: tempStatValue });
      setEditingStat(null);
    }
  };

  const startEditingStat = (stat: 'dealValue' | 'probability') => {
    setTempStatValue(lead[stat] || 0);
    setEditingStat(stat);
  };

  const handleSaveNote = async () => {
    if (newNoteContent.trim()) {
      // 1. Save the actual note
      if (onAddNote) {
        await onAddNote({ content: newNoteContent, isPinned: false, author: 'Me' });
      }
      
      // 2. Add to Activity Timeline as a log
      if (onAddActivity) {
        await onAddActivity({
          type: 'message', // We'll treat note logs as message types in the feed
          title: 'Note Added',
          description: newNoteContent.length > 60 ? newNoteContent.substring(0, 60) + '...' : newNoteContent,
          timestamp: new Date().toLocaleString(),
        });
      }

      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };

  const handleManualLog = async (type: 'call' | 'email') => {
    if (onAddActivity) {
      await onAddActivity({
        type,
        title: type === 'call' ? 'Manual Call' : 'Manual SMS',
        description: type === 'call' ? 'Manual voice interaction recorded' : 'Manual SMS record added',
        timestamp: new Date().toLocaleString(),
      });
    }
  };

  const getActivityIcon = (type: string, title?: string) => {
    if (title === 'Note Added') return <Edit3 size={14} />;
    if (type === 'call') return <Phone size={14} />;
    return <MessageSquare size={14} />;
  };

  const getActivityColor = (type: string, title?: string) => {
    if (title === 'Note Added') return 'bg-amber-500';
    if (type === 'call') return 'bg-indigo-600';
    return 'bg-fuchsia-600';
  };

  return (
    <div className="h-full overflow-y-auto bg-white p-10 custom-scrollbar relative">
      {/* Header Profile */}
      <motion.div layout className="flex items-start justify-between mb-12">
        <div className="flex items-start gap-8">
          <motion.img layoutId={`avatar-${lead.id}`} src={lead.avatar} alt={lead.name} className="w-24 h-24 rounded-[32px] object-cover shadow-2xl shadow-slate-200 border-4 border-white bg-slate-50" />
          <AnimatePresence mode="wait">
            {isEditingProfile ? (
              <motion.div key="edit" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4 pt-2">
                <input className="text-3xl font-black text-slate-900 border-b-2 border-indigo-500 focus:outline-none w-full bg-transparent" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                <div className="flex items-center gap-2">
                  <input className="text-slate-500 font-bold border-b border-slate-200 focus:outline-none bg-transparent" value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})} />
                  <span className="text-slate-300">@</span>
                  <input className="text-indigo-600 font-black border-b border-slate-200 focus:outline-none bg-transparent uppercase text-sm tracking-wider" value={editData.company} onChange={e => setEditData({...editData, company: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSaveProfile} className="px-6 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">Save</button>
                  <button onClick={() => setIsEditingProfile(false)} className="px-6 py-2 bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:bg-slate-100">Cancel</button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="pt-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{lead.name}</h1>
                <p className="text-slate-500 font-bold mb-6 flex items-center gap-2">{lead.role} <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> <span className="text-indigo-600 uppercase tracking-widest text-xs font-black">{lead.company}</span></p>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div onClick={onDial} className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer group border border-transparent hover:border-indigo-100">
                    <Phone size={16} className="text-slate-400 group-hover:text-indigo-500" />
                    <span className="font-bold">{lead.phone}</span>
                  </div>
                  <div onClick={onMessage} className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl text-slate-600 hover:bg-fuchsia-50 hover:text-fuchsia-600 transition-all cursor-pointer group border border-transparent hover:border-fuchsia-100">
                    <MessageSquare size={16} className="text-slate-400 group-hover:text-fuchsia-500" />
                    <span className="font-bold">Send Message</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-3 relative">
           <button onClick={() => setShowOptions(!showOptions)} className={`p-3 rounded-2xl transition-all ${showOptions ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
             <MoreHorizontal size={24} />
           </button>
           <AnimatePresence>{showOptions && (
             <>
               <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)}></div>
               <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-50 py-3 overflow-hidden">
                 <button onClick={handleStartEdit} className="w-full text-left px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors text-sm">
                   <Edit3 size={18} className="text-slate-400" /> Edit Profile
                 </button>
                 <button onClick={() => { setIsAddingNote(true); setShowOptions(false); }} className="w-full text-left px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors text-sm">
                   <Plus size={18} className="text-slate-400" /> Add Private Note
                 </button>
                 <button onClick={() => {onDelete?.(lead.id); setShowOptions(false)}} className="w-full text-left px-6 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors mt-1 border-t border-slate-50 pt-4">
                   <Trash2 size={18} /> Delete Record
                 </button>
               </motion.div>
             </>
           )}</AnimatePresence>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6 mb-12">
        <StatCard label="Deal Value" value={`$${(lead.dealValue || 0).toLocaleString()}`} icon={<DollarSign size={14} />} color="text-indigo-600" isEditing={editingStat === 'dealValue'} onEdit={() => startEditingStat('dealValue')} onSave={handleSaveStat} onCancel={() => setEditingStat(null)} inputValue={tempStatValue} onInputChange={setTempStatValue} />
        <StatCard label="Conversion" value={`${lead.probability || 0}%`} icon={<Target size={14} />} color="text-slate-900" isEditing={editingStat === 'probability'} onEdit={() => startEditingStat('probability')} onSave={handleSaveStat} onCancel={() => setEditingStat(null)} inputValue={tempStatValue} onInputChange={setTempStatValue} />
        <StatCard label="Last Sync" value={lead.lastContactDate || 'Never'} icon={<Clock size={14} />} color="text-slate-900" />
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-8"><h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div>Activity Feed</h3>
          <div className="flex gap-3">
            <button onClick={() => handleManualLog('call')} className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10 flex items-center gap-2 font-bold"><Phone size={12} /> Log Call</button>
            <button onClick={() => handleManualLog('email')} className="text-[10px] font-black uppercase tracking-widest bg-white border-2 border-slate-100 text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2 font-bold"><MessageSquare size={12} /> Log SMS</button>
          </div>
        </div>
        {(activities || []).length > 0 ? (
          <div className="relative pl-4 space-y-8 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-px before:bg-slate-100">
            {(activities || []).map((activity, idx) => (
              <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative pl-10">
                <div className={`absolute left-0 top-0 w-8 h-8 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white translate-x-[-16px] z-10 text-white ${getActivityColor(activity.type, activity.title)}`}>
                  {getActivityIcon(activity.type, activity.title)}
                </div>
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group border-transparent hover:border-indigo-100">
                  <div className="flex justify-between items-start mb-2"><h4 className="font-black text-slate-900 text-sm leading-tight">{activity.title}</h4><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activity.timestamp}</span></div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-3">{activity.description}</p>
                  {activity.duration && (<div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-slate-100 text-[10px] font-black text-slate-400 uppercase"><Clock size={10} /> {activity.duration}</div>)}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30"><div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-50"><Clock className="text-slate-200" size={24} /></div><p className="text-sm font-black text-slate-400 uppercase tracking-widest">No recent records</p></div>
        )}
      </div>

      <motion.div layout className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-900/20">
        <div className="flex items-center justify-between mb-8"><h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3"><div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>Private Notes</h3>
          <button onClick={() => setIsAddingNote(!isAddingNote)} className="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-2 transition-colors font-bold">{isAddingNote ? 'Discard' : <><Plus size={16} /> Add Note</>}</button>
        </div>
        <AnimatePresence>{isAddingNote && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden"><textarea className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-3xl p-6 text-sm font-medium focus:border-indigo-500 outline-none min-h-[120px] transition-all" placeholder="Capture your thoughts..." autoFocus value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} />
              <div className="flex justify-end mt-4"><button onClick={handleSaveNote} disabled={!newNoteContent.trim()} className="bg-indigo-500 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-indigo-400 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center gap-3 font-bold"><Send size={14} /> Commit Note</button></div>
            </motion.div>
        )}</AnimatePresence>
        {note ? (
          <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 relative group hover:border-slate-600 transition-all"><p className="text-slate-300 leading-relaxed font-medium whitespace-pre-wrap mb-8 text-lg italic font-medium">"{note.content}"</p>
            <div className="flex items-center justify-between opacity-60"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-500/20">{note.author.charAt(0)}</div><span className="text-[10px] font-black uppercase tracking-widest tracking-tighter">{note.author} • Lead Strategist</span></div><Pin size={16} className="text-indigo-400" fill="currentColor" /></div>
          </motion.div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600 font-bold"><p className="text-xs font-black uppercase tracking-widest">Workspace is clear</p></div>
        )}
      </motion.div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, isEditing, onEdit, onSave, onCancel, inputValue, onInputChange }: any) => (
  <motion.div layout whileHover={{ y: -4 }} className={`bg-slate-50/50 rounded-[32px] p-6 border border-transparent transition-all ${!isEditing && onEdit ? 'hover:bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-slate-200/50 cursor-pointer' : ''}`} onClick={!isEditing && onEdit ? onEdit : undefined}>
    <div className="flex items-center gap-2 mb-2"><span className="text-slate-400">{icon}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span></div>
    <AnimatePresence mode="wait">{isEditing ? (
        <motion.div key="edit" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-3" onClick={e => e.stopPropagation()}>
          <input type="number" autoFocus className="w-full text-xl font-black border-b-2 border-indigo-500 focus:outline-none bg-transparent" value={inputValue} onChange={e => onInputChange(Number(e.target.value))} />
          <div className="flex gap-2">
            <button onClick={onSave} className="p-1.5 bg-indigo-600 text-white rounded-lg active:scale-90 transition-all"><Check size={14} /></button>
            <button onClick={onCancel} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg active:scale-90 transition-all"><X size={14} /></button>
          </div>
        </motion.div>
      ) : (
        <motion.span key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-2xl font-black tracking-tighter ${color}`}>{value}</motion.span>
      )}</AnimatePresence>
  </motion.div>
);
