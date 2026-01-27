import React, { useState } from 'react';
import { Mail, Phone, Clock, Pin, FolderOpen, Trash2, MoreHorizontal, Send, Plus } from 'lucide-react';
import { Lead, Activity, Note } from '../types';

interface LeadDetailProps {
  lead: Lead | undefined;
  activities: Activity[];
  note: Note | undefined;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Lead>) => void;
  onAddNote?: (note: Omit<Note, 'id'>) => void;
  onAddActivity?: (activity: Omit<Activity, 'id'>) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ 
  lead, 
  activities, 
  note, 
  onDelete, 
  onUpdate,
  onAddNote,
  onAddActivity
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Edit Profile Local State
  const [editData, setEditData] = useState<Partial<Lead>>({});

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

  const handleStartEdit = () => {
    setEditData({
      name: lead.name,
      role: lead.role,
      company: lead.company,
      email: lead.email,
      phone: lead.phone
    });
    setIsEditingProfile(true);
    setShowOptions(false);
  };

  const handleSaveProfile = async () => {
    if (onUpdate) {
      await onUpdate(lead.id, editData);
    }
    setIsEditingProfile(false);
  };

  const handleSaveNote = async () => {
    if (onAddNote && newNoteContent.trim()) {
      await onAddNote({
        content: newNoteContent,
        isPinned: true,
        author: 'Current User' // Should ideally come from auth context
      });
      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white p-8">
      {/* Header Profile */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-6">
          <img src={lead.avatar} alt={lead.name} className="w-20 h-20 rounded-xl object-cover shadow-sm bg-gray-200" />
          
          {isEditingProfile ? (
            <div className="space-y-3">
              <input 
                className="text-2xl font-bold text-gray-900 mb-1 border-b border-blue-500 focus:outline-none"
                value={editData.name}
                onChange={e => setEditData({...editData, name: e.target.value})}
              />
              <div className="flex items-center gap-2">
                <input 
                  className="text-gray-500 text-base border-b border-gray-200 focus:outline-none"
                  value={editData.role}
                  onChange={e => setEditData({...editData, role: e.target.value})}
                />
                <span className="text-gray-400 text-sm">at</span>
                <input 
                  className="text-gray-900 font-medium border-b border-gray-200 focus:outline-none"
                  value={editData.company}
                  onChange={e => setEditData({...editData, company: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveProfile} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg">Save</button>
                <button onClick={() => setIsEditingProfile(false)} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
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
          )}
        </div>
        
        <div className="flex items-center gap-2">
           {onDelete && (
            <button 
              onClick={() => onDelete(lead.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Lead"
            >
              <Trash2 size={20} />
            </button>
           )}
           <div className="relative">
             <button 
               onClick={() => setShowOptions(!showOptions)}
               className="p-2 text-gray-300 hover:text-gray-500 rounded-full transition-colors"
             >
               <MoreHorizontal size={20} />
             </button>
             {showOptions && (
               <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1">
                 <button 
                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                   onClick={handleStartEdit}
                 >
                   Edit Profile
                 </button>
                 <button 
                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                   onClick={() => setShowOptions(false)}
                 >
                   Export Data
                 </button>
                 {onDelete && (
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50 mt-1 pt-2"
                      onClick={() => {
                        onDelete(lead.id);
                        setShowOptions(false);
                      }}
                    >
                      Delete Lead
                    </button>
                 )}
               </div>
             )}
             {showOptions && (
                <div className="fixed inset-0 z-0" onClick={() => setShowOptions(false)}></div>
             )}
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Clock size={20} className="text-gray-900" />
            Activity Timeline
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={() => onAddActivity?.({ type: 'call', title: 'Manual Call Log', description: 'Log of a manual call interaction', timestamp: 'Just now' })}
              className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <Phone size={14} /> Log Call
            </button>
            <button 
              onClick={() => onAddActivity?.({ type: 'email', title: 'Email Sent', description: 'Follow-up email sent to lead', timestamp: 'Just now' })}
              className="text-xs font-semibold bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"
            >
              <Mail size={14} /> Log Email
            </button>
          </div>
        </div>
        
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
          <button 
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {isAddingNote ? 'Cancel' : <><Plus size={14} /> New Note</>}
          </button>
        </div>

        {isAddingNote && (
          <div className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <textarea 
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
              placeholder="Type your note here..."
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleSaveNote}
                disabled={!newNoteContent.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={14} /> Save Note
              </button>
            </div>
          </div>
        )}

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
