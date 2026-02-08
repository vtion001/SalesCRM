import React from 'react';
import { LayoutGrid, Users, Contact, Briefcase, BarChart } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="w-64 h-full bg-slate-950 border-r border-slate-900 flex flex-col flex-shrink-0 z-40 shadow-[4px_0_24px_rgba(15,23,42,0.2)]">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20 rotate-3 group-hover:rotate-0 transition-transform">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-white"
          >
            <path d="M18 6L6 18M6 6l12 12" transform="rotate(45 12 12)" />
            <path d="M4 4h16v16H4z" strokeWidth="2" />
          </svg>
        </div>
        <span className="font-black text-2xl text-white tracking-tighter">Sales<span className="text-brand-300">CRM</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
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
      
      <div className="p-6">
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/70">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-300">All systems online</span>
          </div>
        </div>
      </div>
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
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
      active
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20 translate-x-1'
        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-brand-300'} transition-colors`}>
      {icon}
    </span>
    {label}
  </button>
);
