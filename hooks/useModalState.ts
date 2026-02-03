import { useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export interface UseModalStateReturn {
  accountModal: ModalState;
  securityModal: ModalState;
  mfaModal: ModalState;
}

/**
 * useModalState - Manage modal visibility state
 * Provides consistent open/close API for all modals
 */
export function useModalState(): UseModalStateReturn {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showMFAModal, setShowMFAModal] = useState(false);

  const accountModal: ModalState = {
    isOpen: showAccountModal,
    open: useCallback(() => setShowAccountModal(true), []),
    close: useCallback(() => setShowAccountModal(false), [])
  };

  const securityModal: ModalState = {
    isOpen: showSecurityModal,
    open: useCallback(() => setShowSecurityModal(true), []),
    close: useCallback(() => setShowSecurityModal(false), [])
  };

  const mfaModal: ModalState = {
    isOpen: showMFAModal,
    open: useCallback(() => setShowMFAModal(true), []),
    close: useCallback(() => setShowMFAModal(false), [])
  };

  return {
    accountModal,
    securityModal,
    mfaModal
  };
}
