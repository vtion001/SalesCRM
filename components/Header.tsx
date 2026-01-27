import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, LogOut, User, Moon, Shield, X, Lock, Smartphone } from 'lucide-react';
import { CurrentUser } from '../types';

interface HeaderProps {
  user: CurrentUser;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<CurrentUser>) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onUpdateProfile }) => {
  const [activeDropdown, setActiveDropdown] = useState<'notifications' | 'settings' | 'profile' | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Edit Profile State
  const [editName, setEditName] = useState(user.name);
  const [editRole, setEditRole] = useState(user.role);
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  const headerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state when modal opens or user changes
  useEffect(() => {
    if (showAccountModal) {
      setEditName(user.name);
      setEditRole(user.role);
      setEditAvatar(user.avatar);
    }
  }, [showAccountModal, user]);

  const toggleDropdown = (name: 'notifications' | 'settings' | 'profile') => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const openAccountSettings = () => {
    setActiveDropdown(null);
    setShowAccountModal(true);
  };

  const openSecuritySettings = () => {
    setActiveDropdown(null);
    setShowSecurityModal(true);
  };

  const handleSaveProfile = () => {
    onUpdateProfile({ 
      name: editName, 
      role: editRole,
      avatar: editAvatar 
    });
    setShowAccountModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <header ref={headerRef} className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 relative z-30">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search leads or contacts..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-gray-500">
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('notifications')}
                className={`relative hover:text-gray-700 transition-colors p-1 rounded-md ${activeDropdown === 'notifications' ? 'bg-gray-100 text-gray-900' : ''}`}
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white translate-x-1/3 -translate-y-1/3"></span>
              </button>
              
              {activeDropdown === 'notifications' && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animation-fade-in z-50">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-8 text-center text-gray-400">
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('settings')}
                className={`hover:text-gray-700 transition-colors p-1 rounded-md ${activeDropdown === 'settings' ? 'bg-gray-100 text-gray-900' : ''}`}
              >
                <Settings size={20} />
              </button>

              {activeDropdown === 'settings' && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animation-fade-in z-50">
                  <div className="p-2 space-y-1">
                    <SettingsItem 
                      icon={<User size={16} />} 
                      label="Account Settings" 
                      onClick={openAccountSettings} 
                    />
                    <SettingsItem 
                      icon={<Shield size={16} />} 
                      label="Privacy & Security" 
                      onClick={openSecuritySettings} 
                    />
                    <div className="h-px bg-gray-100 my-1"></div>
                    <SettingsItem icon={<Moon size={16} />} label="Dark Mode" toggle />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-8 w-px bg-gray-200"></div>

          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('profile')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <img
                src={user.avatar}
                alt="User"
                className={`w-10 h-10 rounded-full border-2 transition-all object-cover ${activeDropdown === 'profile' ? 'border-blue-500 shadow-md' : 'border-white shadow-sm'}`}
              />
            </button>

            {activeDropdown === 'profile' && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animation-fade-in z-50">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={openAccountSettings}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  >
                     <User size={16} /> Edit Profile
                  </button>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 mt-1"
                  >
                     <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Account Settings Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
              <button onClick={() => setShowAccountModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <img
                    src={editAvatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-gray-50 shadow-sm mb-2 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-none">
                    <span className="text-white text-[10px] font-bold uppercase">Change</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-600 font-semibold hover:text-blue-700"
                >
                  Change Photo
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={user.email} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                  disabled 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowAccountModal(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveProfile} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
              <button onClick={() => setShowSecurityModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lock size={16} /> Password
                </h3>
                <div className="space-y-3">
                  <input type="password" placeholder="Current Password" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  <input type="password" placeholder="New Password" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Smartphone size={16} /> Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Text Message (SMS)</p>
                    <p className="text-gray-500 text-xs">Receive a code via SMS</p>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowSecurityModal(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => setShowSecurityModal(false)} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Update Security</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NotificationItem = ({ title, desc, time, unread, type }: any) => (
  <div className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${unread ? 'bg-blue-50/30' : ''}`}>
    <div className="flex justify-between items-start mb-1">
      <span className={`text-sm font-semibold ${type === 'alert' ? 'text-red-600' : 'text-gray-900'}`}>{title}</span>
      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{time}</span>
    </div>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const SettingsItem = ({ icon, label, toggle, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors text-left"
  >
    <div className="flex items-center gap-3">
      <span className="text-gray-400 group-hover:text-blue-600 transition-colors">{icon}</span>
      <span>{label}</span>
    </div>
    {toggle && (
      <div className="w-8 h-4 bg-gray-200 rounded-full relative">
        <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
      </div>
    )}
  </button>
);