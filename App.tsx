import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LeadList } from './components/LeadList';
import { LeadDetail } from './components/LeadDetail';
import { LeadForm } from './components/LeadForm';
import { Dialer } from './components/Dialer';
import DialerSound from './components/DialerSound';
import { Dashboard } from './components/Dashboard';
import { Contacts } from './components/Contacts';
import { Deals } from './components/Deals';
import { Analytics } from './components/Analytics';
import { ContactForm } from './components/ContactForm';
import { Auth } from './pages/Auth';
import { Lead, Contact, Deal, CurrentUser } from './types';
import { supabase } from './services/supabaseClient';
import { useLeads } from './hooks/useLeads';
import { useContacts } from './hooks/useContacts';
import { useDeals } from './hooks/useDeals';
import { useActivities } from './hooks/useActivities';
import { useNotes } from './hooks/useNotes';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [authLoading, setAuthLoading] = useState(true);
  
  // Supabase Hooks
  const { leads, addLead, deleteLead, updateLead } = useLeads();
  const { contacts, addContact, deleteContact, updateContact } = useContacts();
  const { deals, deleteDeal } = useDeals();
  
  // Selection States
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const { activities, addActivity } = useActivities(selectedLeadId);
  const { notes, addNote } = useNotes(selectedLeadId);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // User State
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: 'Alex Rivers',
    email: 'alex.rivers@salescrm.com',
    role: 'Sales Lead',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  // Combine and normalize Leads and Contacts for the Pipeline view
  const allPipelineItems = useMemo(() => {
    const normalizedContacts: Lead[] = contacts.map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
      company: c.company,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`,
      status: 'New Lead', 
      lastActivityTime: c.lastContacted || 'Just now',
      email: c.email,
      phone: c.phone,
      isOnline: false,
      dealValue: 0,
      probability: 0,
      lastContactDate: c.lastContacted || 'Never'
    }));

    // Avoid duplicates if a contact was promoted to a lead (by ID)
    const leadIds = new Set(leads.map(l => l.id));
    const filteredContacts = normalizedContacts.filter(c => !leadIds.has(c.id));

    return [...leads, ...filteredContacts];
  }, [leads, contacts]);

  const selectedItem = useMemo(() => 
    allPipelineItems.find(item => item.id === selectedLeadId),
    [allPipelineItems, selectedLeadId]
  );

  const isSelectedContact = useMemo(() => 
    contacts.some(c => c.id === selectedLeadId),
    [contacts, selectedLeadId]
  );

  // Generic Update Handler for LeadDetail & Deals
  const handleUpdateItem = async (id: string, updates: Partial<Lead>) => {
    if (isSelectedContact) {
      await updateContact(id, {
        name: updates.name,
        role: updates.role,
        company: updates.company,
        email: updates.email,
        phone: updates.phone,
        status: updates.status === 'Closed' ? 'Inactive' : 'Active'
      } as Partial<Contact>);
    } else {
      await updateLead(id, updates);
    }
  };

  // Generic Delete Handler
  const handleDeleteItem = async (id: string) => {
    if (isSelectedContact) {
      await deleteContact(id);
    } else {
      await deleteLead(id);
    }
    if (selectedLeadId === id) setSelectedLeadId(null);
  };

  // Fetch or Create Profile
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: userId,
          full_name: 'Alex Rivers',
          email: email,
          role: 'Sales Lead',
          avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        };
        await supabase.from('profiles').insert([newProfile]);
        setCurrentUser({ name: newProfile.full_name, email: newProfile.email, role: newProfile.role, avatar: newProfile.avatar_url });
      } else if (data) {
        setCurrentUser({ name: data.full_name, email: data.email, role: data.role, avatar: data.avatar_url });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  // Auth Effects
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data?.session?.user) {
          setIsAuthenticated(true);
          await fetchProfile(data.session.user.id, data.session.user.email || '');
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleUpdateProfile = async (updates: Partial<CurrentUser>) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) return;
      const { error } = await supabase.from('profiles').update({
        full_name: updates.name,
        role: updates.role,
        avatar_url: updates.avatar,
        updated_at: new Date().toISOString()
      }).eq('id', userId);
      if (error) throw error;
      setCurrentUser(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error('❌ Failed to update profile:', err);
    }
  };

  const handleAddLeadAction = async (leadData: Omit<Lead, 'id'>) => {
    // 1. Create Lead in leads table
    const addedLead = await addLead(leadData);
    
    if (addedLead) {
      // 2. Automatically create Contact in contacts table
      await addContact({
        name: leadData.name,
        role: leadData.role,
        company: leadData.company,
        email: leadData.email,
        phone: leadData.phone,
        lastContacted: 'Never',
        status: 'Active'
      });

      setSelectedLeadId(addedLead.id);
      setIsLeadModalOpen(false);
      console.log('✅ Lead created and mirrored to Contacts');
    }
  };

  const handleSaveContactAction = async (contactData: Omit<Contact, 'id' | 'lastContacted' | 'status'>) => {
    const newContactData: Omit<Contact, 'id'> = {
      ...contactData,
      lastContacted: 'Never',
      status: 'Active'
    };
    const added = await addContact(newContactData);
    if (added && currentView === 'leads') setSelectedLeadId(added.id);
    setIsContactModalOpen(false);
  };

  if (authLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  if (!isAuthenticated) return <Auth />;

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 font-sans">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />
        
        <div className="flex-1 overflow-hidden relative">
          {currentView === 'dashboard' && <Dashboard leads={leads} deals={deals} />}

          {currentView === 'leads' && (
            <div className="grid grid-cols-12 h-full">
              <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r border-gray-200 h-full overflow-hidden">
                <LeadList leads={allPipelineItems} selectedId={selectedLeadId} onSelect={setSelectedLeadId} onAddLead={() => setIsLeadModalOpen(true)} />
              </div>
              <div className="col-span-12 md:col-span-8 lg:col-span-5 border-r border-gray-200 h-full overflow-hidden bg-white">
                <LeadDetail 
                  lead={selectedItem} 
                  activities={activities} 
                  note={notes.length > 0 ? notes[0] : undefined} 
                  onDelete={handleDeleteItem} 
                  onUpdate={handleUpdateItem} 
                  onAddNote={addNote} 
                  onAddActivity={addActivity} 
                />
              </div>
              <div className="hidden lg:block lg:col-span-4 h-full overflow-hidden bg-white">
                 <Dialer targetLead={selectedItem} onLogActivity={addActivity} />
                 <DialerSound />
              </div>
            </div>
          )}

          {currentView === 'contacts' && (
            <Contacts contacts={contacts} onAddContact={() => setIsContactModalOpen(true)} onDeleteContact={deleteContact} />
          )}

          {currentView === 'deals' && (
            <Deals 
              items={allPipelineItems} 
              onUpdateItem={handleUpdateItem} 
              onDeleteItem={handleDeleteItem} 
              onAddNew={() => setIsLeadModalOpen(true)} 
            />
          )}

          {currentView === 'analytics' && <Analytics items={allPipelineItems} />}
        </div>
        
        {isContactModalOpen && <ContactForm onSave={handleSaveContactAction} onCancel={() => setIsContactModalOpen(false)} />}
        {isLeadModalOpen && <LeadForm onSave={handleAddLeadAction} onCancel={() => setIsLeadModalOpen(false)} />}
      </main>
    </div>
  );
}
