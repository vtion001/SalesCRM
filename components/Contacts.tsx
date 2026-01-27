import React from 'react';
import { Plus, Search, Mail, Phone, Building, Trash2 } from 'lucide-react';
import { Contact } from '../types';

interface ContactsProps {
  contacts: Contact[];
  onAddContact: () => void;
  onDeleteContact: (id: string) => void;
}

export const Contacts: React.FC<ContactsProps> = ({ contacts, onAddContact, onDeleteContact }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your professional network</p>
        </div>
        <button 
          onClick={onAddContact}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Contact
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search contacts by name, email, or company..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-8">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No contacts yet</h3>
            <p className="text-gray-500 mt-2 mb-6 max-w-sm">Build your network by adding your first contact. Contacts help you track interactions and close deals.</p>
            <button 
              onClick={onAddContact}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              + Add First Contact
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{contact.name}</h3>
                        <p className="text-xs text-gray-500">{contact.role}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                      contact.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building size={16} className="text-gray-400" />
                      <span className="truncate">{contact.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      <a href={`mailto:${contact.email}`} className="truncate hover:text-blue-600">{contact.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>Last contacted: {contact.lastContacted}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onDeleteContact(contact.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Contact"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="text-blue-600 font-medium hover:underline">View Profile</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Users = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
