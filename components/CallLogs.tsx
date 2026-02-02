import React, { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, Search, X, User, Building, UserPlus, Users } from 'lucide-react';
import { Lead, Contact } from '../types';
import { useCallHistory } from '../hooks/useCallHistory';
import { useLeads } from '../hooks/useLeads';
import { useContacts } from '../hooks/useContacts';
import { motion, AnimatePresence } from 'framer-motion';

interface CallLogsProps {
  onDial?: (phoneNumber: string) => void;
}

interface SaveFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
}

export const CallLogs: React.FC<CallLogsProps> = ({ onDial }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCall, setSelectedCall] = useState<any | null>(null);
  const [showSaveForm, setShowSaveForm] = useState<'lead' | 'contact' | null>(null);
  const [formData, setFormData] = useState<SaveFormData>({ name: '', company: '', email: '', phone: '' });
  
  const { callHistory, loading, error, refetch } = useCallHistory();
  const { leads, addLead } = useLeads();
  const { contacts, addContact } = useContacts();

  const filteredCalls = callHistory.filter(call => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      call.phone_number?.toLowerCase().includes(query) ||
      call.notes?.toLowerCase().includes(query) ||
      new Date(call.created_at).toLocaleDateString().toLowerCase().includes(query)
    );
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const findLinkedEntity = (phoneNumber: string) => {
    const lead = leads.find(l => l.phone === phoneNumber);
    if (lead) return { type: 'lead', entity: lead };
    
    const contact = contacts.find(c => c.phone === phoneNumber);
    if (contact) return { type: 'contact', entity: contact };
    
    return null;
  };

  const handleSaveAsLead = (call: any) => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: call.phone_number
    });
    setSelectedCall(call);
    setShowSaveForm('lead');
  };

  const handleSaveAsContact = (call: any) => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: call.phone_number
    });
    setSelectedCall(call);
    setShowSaveForm('contact');
  };

  const handleSubmitSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showSaveForm === 'lead') {
      // Create lead
      await addLead({
        name: formData.name,
        role: 'Contact',
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        status: 'New Lead',
        dealValue: 0,
        probability: 50,
        lastActivityTime: 'Just now',
        lastContactDate: new Date().toISOString(),
        isOnline: false,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=4f46e5&color=fff`
      });
      
      // Check if contact already exists (by phone number) to avoid duplicates
      const existingContact = contacts.find(c => c.phone === formData.phone);
      if (!existingContact) {
        await addContact({
          name: formData.name,
          company: formData.company || 'Unknown Company',
          email: formData.email,
          phone: formData.phone,
          role: 'Contact',
          lastContacted: 'Just now'
        });
      }
    } else if (showSaveForm === 'contact') {
      // Check if contact already exists (by phone number) to avoid duplicates
      const existingContact = contacts.find(c => c.phone === formData.phone);
      if (!existingContact) {
        await addContact({
          name: formData.name,
          company: formData.company || 'Unknown Company',
          email: formData.email,
          phone: formData.phone,
          role: 'Contact',
          lastContacted: 'Just now'
        });
      }
    }
    
    setShowSaveForm(null);
    setSelectedCall(null);
    setFormData({ name: '', company: '', email: '', phone: '' });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Search */}
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Call History</h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filteredCalls.length} calls
          </span>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search by number, date..."
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
      </div>

      {/* Call List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="m-6 p-4 bg-rose-50 border border-rose-100 rounded-xl">
            <p className="text-xs font-bold text-rose-600">{error}</p>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Phone className="text-slate-200" size={32} />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No calls found</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {searchQuery ? 'Try adjusting your search query' : 'Make your first call to see history'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredCalls.map((call) => {
              const linkedEntity = findLinkedEntity(call.phone_number);
              
              return (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    {/* Call Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      call.call_type === 'incoming' ? 'bg-blue-50' : 
                      call.call_type === 'outgoing' ? 'bg-emerald-50' : 'bg-slate-50'
                    }`}>
                      {call.call_type === 'incoming' ? (
                        <PhoneIncoming size={18} className="text-blue-600" />
                      ) : call.call_type === 'outgoing' ? (
                        <PhoneOutgoing size={18} className="text-emerald-600" />
                      ) : (
                        <Phone size={18} className="text-slate-400" />
                      )}
                    </div>

                    {/* Call Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-black text-slate-900 truncate">
                            {linkedEntity ? (
                              <span>{linkedEntity.entity.name}</span>
                            ) : (
                              call.phone_number
                            )}
                          </h3>
                          {linkedEntity && (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                              {linkedEntity.type === 'lead' ? (
                                <>
                                  <User size={10} />
                                  {linkedEntity.entity.company}
                                </>
                              ) : (
                                <>
                                  <Users size={10} />
                                  Contact
                                </>
                              )}
                            </p>
                          )}
                          {!linkedEntity && (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              Unknown Number
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                            {formatDate(call.created_at)}
                          </p>
                          {call.duration_seconds > 0 && (
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 justify-end mt-0.5">
                              <Clock size={10} />
                              {formatDuration(call.duration_seconds)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Call Type Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border ${
                          call.call_type === 'incoming' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          call.call_type === 'outgoing' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {call.call_type}
                        </span>
                        {call.notes && (
                          <span className="text-[10px] text-slate-400 truncate">{call.notes}</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onDial && (
                          <button
                            onClick={() => onDial(call.phone_number)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Phone size={12} />
                            Call Again
                          </button>
                        )}
                        
                        {!linkedEntity && (
                          <>
                            <button
                              onClick={() => handleSaveAsLead(call)}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <UserPlus size={12} />
                              Save as Lead
                            </button>
                            <button
                              onClick={() => handleSaveAsContact(call)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Users size={12} />
                              Save as Contact
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Form Modal */}
      <AnimatePresence>
        {showSaveForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowSaveForm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                {showSaveForm === 'lead' ? (
                  <>
                    <UserPlus size={20} className="text-indigo-600" />
                    Save as New Lead
                  </>
                ) : (
                  <>
                    <Users size={20} className="text-slate-600" />
                    Save as New Contact
                  </>
                )}
              </h3>
              
              <form onSubmit={handleSubmitSave} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-xl text-sm font-bold outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Company {showSaveForm === 'lead' && '*'}
                  </label>
                  <input
                    type="text"
                    required={showSaveForm === 'lead'}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-xl text-sm font-bold outline-none transition-all"
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-xl text-sm font-bold outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.phone}
                    className="w-full px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSaveForm(null)}
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-3 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                      showSaveForm === 'lead' 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'bg-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    Save {showSaveForm === 'lead' ? 'Lead' : 'Contact'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
