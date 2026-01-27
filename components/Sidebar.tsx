import React from 'react';
import { LayoutGrid, Users, Contact, Briefcase, BarChart } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-white"
          >
            <path d="M18 6L6 18M6 6l12 12" transform="rotate(45 12 12)" />
            <path d="M4 4h16v16H4z" strokeWidth="2" />
          </svg>
        </div>
        <span className="font-bold text-xl text-gray-900 tracking-tight">SalesCRM</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <NavItem 
          icon={<LayoutGrid size={20} />} 
          label="Dashboard" 
          id="dashboard"
          active={currentView === 'dashboard'} 
          onClick={onNavigate}
        />
        <NavItem 
          icon={<Users size={20} />} 
          label="Leads" 
          id="leads"
          active={currentView === 'leads'} 
          onClick={onNavigate}
        />
        <NavItem 
          icon={<Contact size={20} />} 
          label="Contacts" 
          id="contacts"
          active={currentView === 'contacts'} 
          onClick={onNavigate}
        />
        <NavItem 
          icon={<Briefcase size={20} />} 
          label="Deals" 
          id="deals"
          active={currentView === 'deals'} 
          onClick={onNavigate}
        />
        <NavItem 
          icon={<BarChart size={20} />} 
          label="Analytics" 
          id="analytics"
          active={currentView === 'analytics'} 
          onClick={onNavigate}
        />
      </nav>
      
      {/* Footer Area could go here */}
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  id: string;
  active?: boolean;
  onClick: (id: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, id, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {icon}
    {label}
  </button>
);