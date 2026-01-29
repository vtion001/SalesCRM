import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, Pin } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';

interface PrivateNotesProps {
  leadId?: string | null;
}

export const PrivateNotes: React.FC<PrivateNotesProps> = ({ leadId = null }) => {
  const { notes, addNote } = useNotes(leadId);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  const latestNote = notes.length > 0 ? notes[0] : null;

  const handleSaveNote = async () => {
    if (newNoteContent.trim()) {
      await addNote({ 
        content: newNoteContent, 
        isPinned: false, 
        author: 'Me' 
      });
      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };

  return (
    <motion.div layout className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-900/20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          Private Notes
        </h3>
        <button 
          onClick={() => setIsAddingNote(!isAddingNote)} 
          className="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-2 transition-colors font-bold"
        >
          {isAddingNote ? 'Discard' : <><Plus size={16} /> Add Note</>}
        </button>
      </div>
      
      <AnimatePresence>
        {isAddingNote && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="mb-8 overflow-hidden"
          >
            <textarea 
              className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-3xl p-6 text-sm font-medium focus:border-indigo-500 outline-none min-h-[120px] transition-all" 
              placeholder="Capture your thoughts..." 
              autoFocus 
              value={newNoteContent} 
              onChange={e => setNewNoteContent(e.target.value)} 
            />
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleSaveNote} 
                disabled={!newNoteContent.trim()} 
                className="bg-indigo-500 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-indigo-400 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center gap-3 font-bold"
              >
                <Send size={14} /> Commit Note
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {latestNote ? (
        <motion.div 
          layout 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 relative group hover:border-slate-600 transition-all"
        >
          <p className="text-slate-300 leading-relaxed font-medium whitespace-pre-wrap mb-8 text-lg italic font-medium">"{latestNote.content}"</p>
          <div className="flex items-center justify-between opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-500/20">
                {latestNote.author.charAt(0)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest tracking-tighter">
                {latestNote.author} • {latestNote.createdAt ? new Date(latestNote.createdAt).toLocaleDateString() : 'Just now'}
              </span>
            </div>
            <Pin size={16} className="text-indigo-400" fill="currentColor" />
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600 font-bold">
          <p className="text-xs font-black uppercase tracking-widest">Workspace is clear</p>
        </div>
      )}
    </motion.div>
  );
};
