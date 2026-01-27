import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LeadList } from './components/LeadList';
import { LeadDetail } from './components/LeadDetail';
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
  const { contacts, addContact, deleteContact } = useContacts();
  const { deals, addDeal, deleteDeal } = useDeals();
  
  // Selection States
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const { activities, addActivity } = useActivities(selectedLeadId);
  const { notes, addNote } = useNotes(selectedLeadId);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // User State
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: 'Alex Rivers',
    email: 'alex.rivers@salescrm.com',
    role: 'Sales Lead',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  // Check authentication status on mount and load profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data?.session?.user) {
          setIsAuthenticated(true);
          const user = data.session.user;
          setCurrentUser({
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'Alex Rivers',
            email: user.email || 'alex.rivers@salescrm.com',
            role: user.user_metadata?.role || 'Sales Lead',
            avatar: user.user_metadata?.avatar_url || user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          });
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          const user = session.user;
          setCurrentUser({
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'Alex Rivers',
            email: user.email || 'alex.rivers@salescrm.com',
            role: user.user_metadata?.role || 'Sales Lead',
            avatar: user.user_metadata?.avatar_url || user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          });
        } else {
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

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
      // Update Supabase Auth metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name || currentUser.name,
          role: updates.role || currentUser.role,
          avatar_url: updates.avatar || currentUser.avatar
        }
      });

      if (error) throw error;

      // Update local state
      setCurrentUser(prev => ({ ...prev, ...updates }));
      console.log('✅ Profile updated in Supabase');
    } catch (err) {
      console.error('❌ Failed to update profile:', err);
    }
  };

  const handleAddLeadAction = async (leadData?: Partial<Lead>) => {
    const newLeadData: Omit<Lead, 'id'> = {
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

    const added = await addLead(newLeadData);
    if (added) {
      setSelectedLeadId(added.id);
    }
  };

  const handleSaveContactAction = async (contactData: Omit<Contact, 'id' | 'lastContacted' | 'status'>) => {
    const newContactData: Omit<Contact, 'id'> = {
      ...contactData,
      lastContacted: 'Never',
      status: 'Active'
    };
    await addContact(newContactData);
    setIsContactModalOpen(false);
  };

  const handleAddDealAction = async (company: string, value: number, dealData?: Partial<Deal>) => {
    const newDealData: Omit<Deal, 'id'> = {
      title: dealData?.title || '',
      value: value,
      company: company,
      stage: dealData?.stage || 'Qualified',
      owner: dealData?.owner || currentUser.name,
      closingDate: dealData?.closingDate || ''
    };
    await addDeal(newDealData);
  };

  // Show loading screen while checking authentication
  if (authLoading === true) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Auth />;
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
                  activities={activities}
                  note={notes.length > 0 ? notes[0] : undefined}
                  onDelete={deleteLead}
                  onUpdate={updateLead}
                  onAddNote={addNote}
                  onAddActivity={addActivity}
                />
              </div>
              <div className="hidden lg:block lg:col-span-4 h-full overflow-hidden bg-white">
                 <Dialer 
                   targetLead={selectedLead} 
                   onLogActivity={addActivity}
                 />
                 <DialerSound />
              </div>
            </div>
          )}

          {currentView === 'contacts' && (
            <Contacts 
              contacts={contacts} 
              onAddContact={() => setIsContactModalOpen(true)}
              onDeleteContact={deleteContact}
            />
          )}

          {currentView === 'deals' && (
            <Deals 
              deals={deals} 
              onAddDeal={(company, value) => handleAddDealAction(company, value)} 
              onDeleteDeal={deleteDeal}
            />
          )}

          {currentView === 'analytics' && (
            <Analytics leads={leads} deals={deals} />
          )}

        </div>
        
        {isContactModalOpen && (
          <ContactForm 
            onSave={handleSaveContactAction} 
            onCancel={() => setIsContactModalOpen(false)} 
          />
        )}
      </main>
    </div>
  );
}