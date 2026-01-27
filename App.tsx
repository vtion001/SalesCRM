import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LeadList } from './components/LeadList';
import { LeadDetail } from './components/LeadDetail';
import { Dialer } from './components/Dialer';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Contacts } from './components/Contacts';
import { Deals } from './components/Deals';
import { Analytics } from './components/Analytics';
import { ContactForm } from './components/ContactForm';
import { Lead, Activity, Note, Contact, Deal, CurrentUser } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // User State
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: 'Alex Rivers',
    email: 'alex.rivers@salescrm.com',
    role: 'Sales Lead',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  // Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  
  // Selection States
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | undefined>(undefined);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleUpdateProfile = (updates: Partial<CurrentUser>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const handleAddLead = (leadData?: Partial<Lead>) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      name: leadData?.name || '',
      role: leadData?.role || '',
      company: leadData?.company || '',
      avatar: leadData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(leadData?.name || 'User')}&background=random`,
      status: leadData?.status || 'New Lead',
      lastActivityTime: leadData?.lastActivityTime || 'Just now',
      email: leadData?.email || '',
      phone: leadData?.phone || '',
      isOnline: leadData?.isOnline ?? false,
      dealValue: leadData?.dealValue || 0,
      probability: leadData?.probability || 0,
      lastContactDate: leadData?.lastContactDate || 'Never'
    };

    setLeads([newLead, ...leads]);
    setSelectedLeadId(newLead.id);
  };

  const handleSaveContact = (contactData: Omit<Contact, 'id' | 'lastContacted' | 'status'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      lastContacted: 'Never',
      status: 'Active'
    };
    setContacts([newContact, ...contacts]);
    setIsContactModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleAddDeal = (company: string, value: number, dealData?: Partial<Deal>) => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      title: dealData?.title || '',
      value: value,
      company: company,
      stage: dealData?.stage || 'Qualified',
      owner: dealData?.owner || currentUser.name,
      closingDate: dealData?.closingDate || ''
    };
    setDeals([newDeal, ...deals]);
  };

  const handleDeleteDeal = (id: string) => {
    setDeals(deals.filter(d => d.id !== id));
  };

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
    if (selectedLeadId === id) {
      setSelectedLeadId(null);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 font-sans">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          user={currentUser} 
          onLogout={handleLogout} 
          onUpdateProfile={handleUpdateProfile}
        />
        
        {/* Router Render Logic */}
        <div className="flex-1 overflow-hidden relative">
          
          {currentView === 'dashboard' && (
            <Dashboard leads={leads} deals={deals} />
          )}

          {currentView === 'leads' && (
            <div className="grid grid-cols-12 h-full">
              <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r border-gray-200 h-full overflow-hidden">
                <LeadList 
                  leads={leads} 
                  selectedId={selectedLeadId} 
                  onSelect={setSelectedLeadId}
                  onAddContact={() => setIsContactModalOpen(true)}
                />
              </div>
              <div className="col-span-12 md:col-span-8 lg:col-span-5 border-r border-gray-200 h-full overflow-hidden bg-white">
                <LeadDetail 
                  lead={selectedLead} 
                  activities={selectedLead ? activities : []}
                  note={selectedLead ? currentNote : undefined}
                  onDelete={handleDeleteLead}
                />
              </div>
              <div className="hidden lg:block lg:col-span-4 h-full overflow-hidden bg-white">
                 <Dialer targetLead={selectedLead} />
              </div>
            </div>
          )}

          {currentView === 'contacts' && (
            <Contacts 
              contacts={contacts} 
              onAddContact={() => setIsContactModalOpen(true)}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {currentView === 'deals' && (
            <Deals 
              deals={deals} 
              onAddDeal={() => handleAddDeal('', 0)} 
              onDeleteDeal={handleDeleteDeal}
            />
          )}

          {currentView === 'analytics' && (
            <Analytics leads={leads} deals={deals} />
          )}

        </div>
        
        {isContactModalOpen && (
          <ContactForm 
            onSave={handleSaveContact} 
            onCancel={() => setIsContactModalOpen(false)} 
          />
        )}
      </main>
    </div>
  );
}