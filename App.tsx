import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LeadList } from './components/LeadList';
import { LeadDetail } from './components/LeadDetail';
import { LeadForm } from './components/LeadForm';
import { CommandPalette } from './components/CommandPalette';
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [dialerActiveTab, setDialerActiveTab] = useState('Dialer');
  
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

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandAction = useCallback((actionId: string) => {
    switch(actionId) {
      case 'add-lead': setIsLeadModalOpen(true); break;
      case 'add-contact': setIsContactModalOpen(true); break;
      case 'view-analytics': setCurrentView('analytics'); break;
    }
  }, []);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedLeadId(id);
    setCurrentView('leads');
    toast.success('Viewing profile details', { duration: 2000 });
  }, []);

  const handleUpdateItem = async (id: string, updates: Partial<Lead>) => {
    const isContact = contacts.some(c => c.id === id);
    const updatePromise = isContact 
      ? updateContact(id, { ...updates, status: updates.status === 'Closed' ? 'Inactive' : 'Active' } as any)
      : updateLead(id, updates);
    
    toast.promise(updatePromise, {
      loading: 'Updating record...',
      success: 'Record updated successfully',
      error: 'Failed to update record',
    });
    await updatePromise;
  };

  const handleDeleteItem = async (id: string) => {
    const isContact = contacts.some(c => c.id === id);
    const deletePromise = isContact ? deleteContact(id) : deleteLead(id);
    
    toast.promise(deletePromise, {
      loading: 'Deleting...',
      success: 'Deleted successfully',
      error: 'Delete failed',
    });
    
    await deletePromise;
    if (selectedLeadId === id) setSelectedLeadId(null);
  };

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error && error.code === 'PGRST116') {
        const newProfile = { id: userId, full_name: 'Alex Rivers', email: email, role: 'Sales Lead', avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' };
        await supabase.from('profiles').insert([newProfile]);
        setCurrentUser({ name: newProfile.full_name, email: newProfile.email, role: newProfile.role, avatar: newProfile.avatar_url });
      } else if (data) {
        setCurrentUser({ name: data.full_name, email: data.email, role: data.role, avatar: data.avatar_url });
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setIsAuthenticated(true);
          await fetchProfile(data.session.user.id, data.session.user.email || '');
        } else { setIsAuthenticated(false); }
      } catch (err) { setIsAuthenticated(false); } finally { setAuthLoading(false); }
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        fetchProfile(session.user.id, session.user.email || '');
      } else { setIsAuthenticated(false); }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast.success('Signed out successfully');
  };

  const handleUpdateProfile = async (updates: Partial<CurrentUser>) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    const updatePromise = supabase.from('profiles').update({
      full_name: updates.name,
      role: updates.role,
      avatar_url: updates.avatar,
      updated_at: new Date().toISOString()
    }).eq('id', userId);

    toast.promise(updatePromise, {
      loading: 'Saving profile...',
      success: 'Profile updated',
      error: 'Failed to save profile',
    });

    const { error } = await updatePromise;
    if (!error) setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const handleAddLeadAction = async (leadData: Omit<Lead, 'id'>) => {
    const leadPromise = (async () => {
      const addedLead = await addLead(leadData);
      if (addedLead) {
        // Automatically create a contact for this lead
        await addContact({
          name: leadData.name, 
          role: leadData.role, 
          company: leadData.company,
          email: leadData.email, 
          phone: leadData.phone, 
          lastContacted: 'Just now', 
          status: 'Active'
        });
        setSelectedLeadId(addedLead.id);
        setIsLeadModalOpen(false);
        return addedLead;
      }
      throw new Error('Failed to add lead');
    })();

    toast.promise(leadPromise, {
      loading: 'Creating lead opportunity...',
      success: '✅ Lead created & added to Contacts',
      error: 'Failed to create lead',
    });
  };

  const handleSaveContactAction = async (contactData: Omit<Contact, 'id' | 'lastContacted' | 'status'>) => {
    const contactPromise = addContact({ ...contactData, lastContacted: 'Never', status: 'Active' });
    toast.promise(contactPromise, {
      loading: 'Saving contact...',
      success: 'Contact added to network',
      error: 'Failed to save contact',
    });
    const added = await contactPromise;
    if (added && currentView === 'leads') setSelectedLeadId(added.id);
    setIsContactModalOpen(false);
  };

  if (authLoading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-indigo-500/20"></div>
        <p className="text-slate-400 font-bold tracking-widest text-xs uppercase animate-pulse">Initializing SalesCRM</p>
      </motion.div>
    </div>
  );

  if (!isAuthenticated) return <Auth />;

  return (
    <div className="flex h-screen w-full bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Toaster position="top-right" toastOptions={{
        className: 'font-bold text-sm rounded-2xl border border-slate-100 shadow-2xl',
        duration: 3000,
      }} />
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        items={allPipelineItems}
        onSelectItem={handleSelectItem}
        onAction={handleCommandAction}
      />

      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        <Header user={currentUser} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />
        
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              {currentView === 'dashboard' && (
                <Dashboard 
                  leads={leads} 
                  deals={allPipelineItems} 
                  onNavigate={setCurrentView} 
                  onSelectLead={handleSelectItem} 
                />
              )}

              {currentView === 'leads' && (
                <div className="grid grid-cols-12 h-full">
                  <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r border-slate-50 h-full overflow-hidden">
                    <LeadList leads={allPipelineItems} selectedId={selectedLeadId} onSelect={setSelectedLeadId} onAddLead={() => setIsLeadModalOpen(true)} />
                  </div>
                  <div className="col-span-12 md:col-span-8 lg:col-span-5 border-r border-slate-50 h-full overflow-hidden bg-white">
                    <LeadDetail 
                      lead={selectedItem} 
                      activities={activities} 
                      note={notes.length > 0 ? notes[0] : undefined} 
                      onDelete={handleDeleteItem} 
                      onUpdate={handleUpdateItem} 
                      onAddNote={async (n) => {
                        const p = addNote(n);
                        toast.promise(p, { loading: 'Saving note...', success: 'Note saved', error: 'Failed' });
                        await p;
                      }} 
                      onAddActivity={async (a) => {
                        const p = addActivity(a);
                        toast.promise(p, { loading: 'Logging activity...', success: 'Activity logged', error: 'Failed' });
                        await p;
                      }}
                      onDial={() => setDialerActiveTab('Dialer')}
                      onMessage={() => setDialerActiveTab('SMS')}
                    />
                  </div>
                  <div className="hidden lg:block lg:col-span-4 h-full overflow-hidden bg-white">
                     <Dialer 
                       targetLead={selectedItem} 
                       onLogActivity={addActivity} 
                       activeTab={dialerActiveTab}
                       onTabChange={setDialerActiveTab}
                     />
                     <DialerSound />
                  </div>
                </div>
              )}

              {currentView === 'contacts' && (
                <Contacts 
                  contacts={contacts} 
                  onAddContact={() => setIsContactModalOpen(true)} 
                  onDeleteContact={handleDeleteItem} 
                  onViewProfile={handleSelectItem}
                />
              )}

              {currentView === 'deals' && (
                <Deals items={allPipelineItems} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddNew={() => setIsLeadModalOpen(true)} />
              )}

              {currentView === 'analytics' && <Analytics items={allPipelineItems} onNavigate={setCurrentView} />}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {isContactModalOpen && (
            <ModalWrapper onClose={() => setIsContactModalOpen(false)}>
              <ContactForm onSave={handleSaveContactAction} onCancel={() => setIsContactModalOpen(false)} />
            </ModalWrapper>
          )}
          {isLeadModalOpen && (
            <ModalWrapper onClose={() => setIsLeadModalOpen(false)}>
              <LeadForm onSave={handleAddLeadAction} onCancel={() => setIsLeadModalOpen(false)} />
            </ModalWrapper>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const ModalWrapper = ({ children, onClose }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
    <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()} className="w-full max-w-md">{children}</motion.div>
  </motion.div>
);