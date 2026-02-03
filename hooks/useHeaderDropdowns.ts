import { useState, useEffect, useRef, useCallback } from 'react';

export type DropdownType = 'notifications' | 'settings' | 'profile' | null;

export interface UseHeaderDropdownsReturn {
  activeDropdown: DropdownType;
  toggleDropdown: (name: 'notifications' | 'settings' | 'profile') => void;
  closeAllDropdowns: () => void;
}

/**
 * useHeaderDropdowns - Manage header dropdown state and outside click detection
 * Handles dropdown visibility and automatic closing on outside clicks
 */
export function useHeaderDropdowns(containerRef: React.RefObject<HTMLElement>): UseHeaderDropdownsReturn {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [containerRef]);

  const toggleDropdown = useCallback((name: 'notifications' | 'settings' | 'profile') => {
    setActiveDropdown(prev => prev === name ? null : name);
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  return {
    activeDropdown,
    toggleDropdown,
    closeAllDropdowns
  };
}
