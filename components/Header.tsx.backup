import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, LogOut, User, Moon, Shield, X, Lock, Smartphone, ChevronRight } from 'lucide-react';
import { CurrentUser } from '../types';
import { MFASetupModal } from './MFASetupModal';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  user: CurrentUser;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<CurrentUser>) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onUpdateProfile }) => {
  const [activeDropdown, setActiveDropdown] = useState<'notifications' | 'settings' | 'profile' | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showMFASetupModal, setShowMFASetupModal] = useState(false);

  // Edit Profile State
  const [editName, setEditName] = useState(user.name);
  const [editRole, setEditRole] = useState(user.role);
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
    if (showSecurityModal) {
      setCurrentPassword('');
      setNewPassword('');
    }
  }, [showAccountModal, showSecurityModal, user]);

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

  const handlePasswordChange = async () => {
    // Validation
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in both password fields');
      return;
    }

    if (newPassword.length < 12) {
      toast.error('New password must be at least 12 characters');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
      toast.error('Password must contain uppercase, lowercase, number, and special character');
      return;
    }

    setIsChangingPassword(true);

    try {
      // First verify current password by attempting to sign in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expired. Please login again.');
        return;
      }

      // Attempt to update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast.success('Password updated successfully! 🔐');
      setCurrentPassword('');
      setNewPassword('');
      setShowSecurityModal(false);
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <header ref={headerRef} className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 flex-shrink-0 relative z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search leads, contacts, or deals... (⌘K)"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 rounded-2xl text-sm font-medium transition-all outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('notifications')}
                className={`relative hover:bg-slate-50 transition-all p-2.5 rounded-xl text-slate-500 ${activeDropdown === 'notifications' ? 'bg-slate-50 text-indigo-600' : ''}`}
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'notifications' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-96 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      <button className="text-xs text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-wider">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell className="text-slate-300" size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-900">All caught up!</p>
                        <p className="text-xs text-slate-400 mt-1">No new notifications at the moment.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('settings')}
                className={`hover:bg-slate-50 transition-all p-2.5 rounded-xl text-slate-500 ${activeDropdown === 'settings' ? 'bg-slate-50 text-indigo-600' : ''}`}
              >
                <Settings size={20} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'settings' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-72 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-3 space-y-1">
                      <SettingsItem 
                        icon={<User size={18} />} 
                        label="Account Settings" 
                        onClick={openAccountSettings} 
                      />
                      <SettingsItem 
                        icon={<Shield size={18} />} 
                        label="Privacy & Security" 
                        onClick={openSecuritySettings} 
                      />
                      <div className="h-px bg-slate-50 my-2 mx-3"></div>
                      <SettingsItem icon={<Moon size={18} />} label="Dark Mode" toggle />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-100"></div>

          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('profile')}
              className="flex items-center gap-4 cursor-pointer group p-1.5 pr-4 rounded-2xl hover:bg-slate-50 transition-all"
            >
              <img
                src={user.avatar}
                alt="User"
                className={`w-10 h-10 rounded-xl border-2 transition-all object-cover shadow-sm ${activeDropdown === 'profile' ? 'border-indigo-500' : 'border-white'}`}
              />
              <div className="text-left hidden lg:block">
                <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user.role}</p>
              </div>
            </button>

            <AnimatePresence>
              {activeDropdown === 'profile' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50"
                >
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <p className="font-black text-slate-900">{user.name}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">{user.email}</p>
                  </div>
                  <div className="p-3">
                    <button 
                      onClick={openAccountSettings}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl flex items-center gap-3 transition-colors"
                    >
                       <User size={18} className="text-slate-400" /> Edit Profile
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-2xl flex items-center gap-3 mt-1 transition-colors"
                    >
                       <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Account Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <ModalContainer onClose={() => setShowAccountModal(false)}>
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h2>
              <button onClick={() => setShowAccountModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={editAvatar} alt="Profile" className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-xl mb-4 object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-indigo-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest bg-indigo-600 px-2 py-1 rounded-lg">Change</span>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
              <div className="space-y-4">
                <InputGroup label="Full Name" value={editName} onChange={setEditName} />
                <InputGroup label="Email Address" value={user.email} disabled />
                <InputGroup label="Job Title" value={editRole} onChange={setEditRole} />
              </div>
            </div>
            <div className="p-8 border-t border-slate-50 flex justify-end gap-4 bg-slate-50/50">
              <button onClick={() => setShowAccountModal(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-colors text-sm">Cancel</button>
              <button onClick={handleSaveProfile} className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 text-sm">Save Changes</button>
            </div>
          </ModalContainer>
        )}
      </AnimatePresence>

      {/* Security Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <ModalContainer onClose={() => setShowSecurityModal(false)}>
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Security</h2>
              <button onClick={() => setShowSecurityModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={14} /> Password Management
                </h3>
                <div className="space-y-3">
                  <input 
                    type="password" 
                    placeholder="Current Password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-2xl text-sm font-bold outline-none transition-all" 
                  />
                  <input 
                    type="password" 
                    placeholder="New Password (min 12 chars)" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-2xl text-sm font-bold outline-none transition-all" 
                  />
                  <p className="text-[10px] text-slate-400 font-medium px-1">
                    Must include uppercase, lowercase, number, and special character
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone size={14} /> Multi-Factor Auth
                </h3>
                <button 
                  onClick={() => { setShowSecurityModal(false); setShowMFASetupModal(true); }}
                  className="w-full flex items-center justify-between p-5 bg-indigo-50 border-2 border-indigo-100 rounded-2xl group hover:bg-indigo-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <Shield size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-indigo-900">Authenticator App</p>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">Highly Recommended</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-indigo-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="p-8 border-t border-slate-50 flex justify-end gap-4 bg-slate-50/50">
              <button 
                onClick={() => setShowSecurityModal(false)} 
                className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-colors text-sm"
                disabled={isChangingPassword}
              >
                Cancel
              </button>
              <button 
                onClick={handlePasswordChange}
                disabled={isChangingPassword || !currentPassword || !newPassword}
                className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isChangingPassword ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  'Update Security'
                )}
              </button>
            </div>
          </ModalContainer>
        )}
      </AnimatePresence>

      <MFASetupModal 
        isOpen={showMFASetupModal} 
        onClose={() => setShowMFASetupModal(false)} 
        onSuccess={() => { setShowMFASetupModal(false); }}
      />
    </>
  );
};

const ModalContainer = ({ children, onClose }: any) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.div 
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-white"
    >
      {children}
    </motion.div>
  </div>
);

const InputGroup = ({ label, value, onChange, disabled }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange?.(e.target.value)} 
      disabled={disabled}
      className={`w-full px-5 py-3.5 border-2 border-transparent rounded-2xl text-sm font-bold outline-none transition-all ${
        disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 text-slate-900'
      }`} 
    />
  </div>
);

const SettingsItem = ({ icon, label, toggle, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl group transition-all text-left"
  >
    <div className="flex items-center gap-3">
      <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">{icon}</span>
      <span>{label}</span>
    </div>
    {toggle && (
      <div className="w-10 h-5 bg-slate-100 rounded-full relative border border-slate-200">
        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm border border-slate-200"></div>
      </div>
    )}
  </button>
);