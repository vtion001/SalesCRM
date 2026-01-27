import React, { useState, useMemo } from 'react';
import { Plus, Search, Mail, Phone, Building, Trash2, User, X, ChevronRight } from 'lucide-react';
import { Contact } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactsProps {
  contacts: Contact[];
  onAddContact: () => void;
  onDeleteContact: (id: string) => void;
  onViewProfile: (id: string) => void;
}

export const Contacts: React.FC<ContactsProps> = ({ contacts, onAddContact, onDeleteContact, onViewProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  return (
    <div className="h-full flex flex-col bg-slate-50/30">
      {/* Header */}
      <div className="px-10 py-8 bg-white border-b border-slate-100 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Professional Network</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Manage your contacts and relationships</p>
        </div>
        <button 
          onClick={onAddContact}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-[20px] text-sm font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          Add Contact
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-10 py-6 bg-white/50 border-b border-slate-50 flex items-center gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 text-sm font-bold transition-all placeholder:text-slate-300"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredContacts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-24 h-24 bg-white rounded-[40px] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 border border-slate-50">
                <User size={40} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">No contacts found</h3>
              <p className="text-slate-400 mt-2 mb-8 max-w-sm font-medium">Build your network by adding your first contact. Contacts help you track interactions and close deals.</p>
              <button 
                onClick={onAddContact}
                className="text-indigo-600 font-black uppercase tracking-widest text-xs px-6 py-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
              >
                + Create New Entry
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredContacts.map((contact, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={contact.id} 
                  className="bg-white border-2 border-transparent hover:border-indigo-100 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] transition-all group flex flex-col justify-between h-full relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 group-hover:rotate-3 transition-transform">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{contact.name}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{contact.role}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        contact.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                        <Building size={16} className="text-slate-400" />
                        <span className="truncate">{contact.company}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                        <Mail size={16} className="text-slate-400" />
                        <a href={`mailto:${contact.email}`} className="truncate hover:text-indigo-600 transition-colors">{contact.email}</a>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                        <Phone size={16} className="text-slate-400" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Last Contact</span>
                      <span className="text-xs font-bold text-slate-500">{contact.lastContacted}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onDeleteContact(contact.id)}
                        className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                        title="Delete Contact"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button 
                        onClick={() => onViewProfile(contact.id)}
                        className="px-4 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
                      >
                        Profile <ChevronRight size={12} strokeWidth={3} />
                      </button>
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