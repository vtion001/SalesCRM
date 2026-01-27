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

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Auto-create some data for the "end-to-end" experience immediately upon login if empty
    if(leads.length === 0) handleAddLead();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleUpdateProfile = (updates: Partial<CurrentUser>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const handleAddLead = () => {
    const newLead: Lead = {
      id: Date.now().toString(),
      name: `Lead ${Math.floor(Math.random() * 1000)}`,
      role: 'Decision Maker',
      company: 'Future Corp',
      avatar: `https://ui-avatars.com/api/?name=Lead+${Math.floor(Math.random() * 10)}&background=random`,
      status: 'New Lead',
      lastActivityTime: 'Just now',
      email: 'prospect@futurecorp.com',
      phone: '+1 (555) 012-3456',
      isOnline: true,
      dealValue: 15000,
      probability: 25,
      lastContactDate: 'Today'
    };
    
    // Auto-create a linked deal for dashboard stats
    handleAddDeal(newLead.company, 15000);

    setLeads([newLead, ...leads]);
    setSelectedLeadId(newLead.id);
  };

  const handleAddContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: 'Sarah Jenkins',
      email: 'sarah.j@techsolutions.io',
      phone: '+1 (555) 987-6543',
      role: 'VP of Engineering',
      company: 'Tech Solutions Inc',
      lastContacted: '2 days ago',
      status: 'Active'
    };
    setContacts([newContact, ...contacts]);
  };

  const handleAddDeal = (company = 'Acme Co', value = 25000) => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      title: 'Enterprise License Expansion',
      value: value,
      company: company,
      stage: 'Proposal',
      owner: 'Alex Rivers',
      closingDate: 'Next Month'
    };
    setDeals([newDeal, ...deals]);
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
                  onAddLead={handleAddLead}
                />
              </div>
              <div className="col-span-12 md:col-span-8 lg:col-span-5 border-r border-gray-200 h-full overflow-hidden bg-white">
                <LeadDetail 
                  lead={selectedLead} 
                  activities={selectedLead ? activities : []}
                  note={selectedLead ? currentNote : undefined}
                />
              </div>
              <div className="hidden lg:block lg:col-span-4 h-full overflow-hidden bg-white">
                 <Dialer targetLead={selectedLead} />
              </div>
            </div>
          )}

          {currentView === 'contacts' && (
            <Contacts contacts={contacts} onAddContact={handleAddContact} />
          )}

          {currentView === 'deals' && (
            <Deals deals={deals} onAddDeal={() => handleAddDeal()} />
          )}

          {currentView === 'analytics' && (
            <Analytics leads={leads} deals={deals} />
          )}

        </div>
      </main>
    </div>
  );
}