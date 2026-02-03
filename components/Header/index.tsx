import React, { useRef } from 'react';
import { Bell, Settings } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { CurrentUser } from '../../types';
import { MFASetupModal } from '../MFASetupModal';

// Hooks
import { useHeaderDropdowns } from '../../hooks/useHeaderDropdowns';
import { useModalState } from '../../hooks/useModalState';
import { useProfileEditor } from '../../hooks/useProfileEditor';
import { usePasswordChange } from '../../hooks/usePasswordChange';

// Atoms
import { SearchBar } from './atoms/SearchBar';
import { AvatarButton } from './atoms/AvatarButton';
import { DropdownTrigger } from './atoms/DropdownTrigger';

// Molecules
import { NotificationsDropdown } from './molecules/NotificationsDropdown';
import { SettingsDropdown } from './molecules/SettingsDropdown';
import { ProfileDropdown } from './molecules/ProfileDropdown';

// Organisms
import { AccountModal } from './organisms/AccountModal';
import { SecurityModal } from './organisms/SecurityModal';

export interface HeaderProps {
    user: CurrentUser;
    onLogout: () => void;
    onUpdateProfile: (updates: Partial<CurrentUser>) => void;
}

/**
 * Header - Refactored main header component
 * Reduced from 453 lines to ~80 lines by extracting logic to services, hooks, and components
 */
export const Header: React.FC<HeaderProps> = ({ user, onLogout, onUpdateProfile }) => {
    const headerRef = useRef<HTMLDivElement>(null);

    // Hooks
    const { activeDropdown, toggleDropdown, closeAllDropdowns } = useHeaderDropdowns(headerRef);
    const { accountModal, securityModal, mfaModal } = useModalState();
    const profileEditor = useProfileEditor(user, onUpdateProfile);
    const passwordChange = usePasswordChange();

    // Handlers
    const handleOpenAccountSettings = () => {
        closeAllDropdowns();
        accountModal.open();
    };

    const handleOpenSecuritySettings = () => {
        closeAllDropdowns();
        securityModal.open();
    };

    return (
        <>
            <header
                ref={headerRef}
                className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 flex-shrink-0 relative z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
                {/* Search Bar */}
                <SearchBar />

                {/* Right Actions */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <div className="relative">
                            <DropdownTrigger
                                icon={<Bell size={20} />}
                                isActive={activeDropdown === 'notifications'}
                                onClick={() => toggleDropdown('notifications')}
                                badge
                            />
                            <AnimatePresence>
                                {activeDropdown === 'notifications' && <NotificationsDropdown />}
                            </AnimatePresence>
                        </div>

                        {/* Settings */}
                        <div className="relative">
                            <DropdownTrigger
                                icon={<Settings size={20} />}
                                isActive={activeDropdown === 'settings'}
                                onClick={() => toggleDropdown('settings')}
                            />
                            <AnimatePresence>
                                {activeDropdown === 'settings' && (
                                    <SettingsDropdown
                                        onAccountSettings={handleOpenAccountSettings}
                                        onSecuritySettings={handleOpenSecuritySettings}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-slate-100"></div>

                    {/* Profile */}
                    <div className="relative">
                        <AvatarButton
                            user={user}
                            isActive={activeDropdown === 'profile'}
                            onClick={() => toggleDropdown('profile')}
                        />
                        <AnimatePresence>
                            {activeDropdown === 'profile' && (
                                <ProfileDropdown
                                    user={user}
                                    onEditProfile={handleOpenAccountSettings}
                                    onLogout={onLogout}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Modals */}
            <AnimatePresence>
                {accountModal.isOpen && (
                    <AccountModal
                        user={user}
                        profileEditor={profileEditor}
                        onClose={accountModal.close}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {securityModal.isOpen && (
                    <SecurityModal
                        passwordChange={passwordChange}
                        onClose={securityModal.close}
                        onOpenMFA={mfaModal.open}
                    />
                )}
            </AnimatePresence>

            <MFASetupModal
                isOpen={mfaModal.isOpen}
                onClose={mfaModal.close}
                onSuccess={mfaModal.close}
            />
        </>
    );
};
