import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Lead, Contact, Deal, Activity, Note, CurrentUser } from '../types';

export interface AppContextType {
  // Auth State
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  handleLogin: (user: CurrentUser) => void;
  handleLogout: () => void;

  // Lead State
  leads: Lead[];
  selectedLeadId: string | null;
  handleAddLead: (lead: Lead) => void;
  handleUpdateLead: (updatedLead: Lead) => void;
  handleDeleteLead: (id: string) => void;
  handleSelectLead: (id: string | null) => void;

  // Contact State
  contacts: Contact[];
  handleAddContact: (contact: Contact) => void;
  handleDeleteContact: (id: string) => void;

  // Deal State
  deals: Deal[];
  handleAddDeal: (deal: Deal) => void;
  handleUpdateDeal: (updatedDeal: Deal) => void;
  handleDeleteDeal: (id: string) => void;

  // Activity & Note State
  activities: Activity[];
  currentNote: string;
  handleAddActivity: (activity: Activity) => void;
  handleUpdateNote: (note: string) => void;

  // UI State
  currentView: 'dashboard' | 'leads' | 'contacts' | 'deals' | 'analytics' | 'dialer';
  handleNavigate: (view: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Activity & Note State
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentNote, setCurrentNote] = useState<string>('');

  // UI State
  const [currentView, setCurrentView] = useState<AppContextType['currentView']>('dashboard');

  // Auth Handlers
  const handleLogin = useCallback((user: CurrentUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setLeads([]);
    setContacts([]);
    setDeals([]);
    setActivities([]);
    setSelectedLeadId(null);
  }, []);

  // Lead Handlers
  const handleAddLead = useCallback((lead: Lead) => {
    setLeads((prev) => [lead, ...prev]);
    setSelectedLeadId(lead.id);
  }, []);

  const handleUpdateLead = useCallback((updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
  }, []);

  const handleDeleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selectedLeadId === id) {
      setSelectedLeadId(null);
    }
  }, [selectedLeadId]);

  const handleSelectLead = useCallback((id: string | null) => {
    setSelectedLeadId(id);
  }, []);

  // Contact Handlers
  const handleAddContact = useCallback((contact: Contact) => {
    setContacts((prev) => [contact, ...prev]);
  }, []);

  const handleDeleteContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Deal Handlers
  const handleAddDeal = useCallback((deal: Deal) => {
    setDeals((prev) => [deal, ...prev]);
  }, []);

  const handleUpdateDeal = useCallback((updatedDeal: Deal) => {
    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
  }, []);

  const handleDeleteDeal = useCallback((id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // Activity Handlers
  const handleAddActivity = useCallback((activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  }, []);

  // Note Handlers
  const handleUpdateNote = useCallback((note: string) => {
    setCurrentNote(note);
  }, []);

  // Navigation Handler
  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view as AppContextType['currentView']);
  }, []);

  const value: AppContextType = {
    // Auth
    currentUser,
    isAuthenticated,
    handleLogin,
    handleLogout,

    // Leads
    leads,
    selectedLeadId,
    handleAddLead,
    handleUpdateLead,
    handleDeleteLead,
    handleSelectLead,

    // Contacts
    contacts,
    handleAddContact,
    handleDeleteContact,

    // Deals
    deals,
    handleAddDeal,
    handleUpdateDeal,
    handleDeleteDeal,

    // Activities & Notes
    activities,
    currentNote,
    handleAddActivity,
    handleUpdateNote,

    // UI
    currentView,
    handleNavigate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook to use the AppContext
 * Must be called within AppContextProvider
 */
export const useAppContext = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};
