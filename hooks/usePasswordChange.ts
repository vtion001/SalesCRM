import { useState, useCallback } from 'react';
import { passwordService } from '../services/PasswordService';
import { toast } from 'react-hot-toast';

export interface UsePasswordChangeReturn {
  currentPassword: string;
  newPassword: string;
  isChanging: boolean;
  errors: string[];
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  changePassword: () => Promise<void>;
  reset: () => void;
  getPasswordStrength: () => number;
  getPasswordStrengthLabel: () => string;
}

/**
 * usePasswordChange - Manage password change flow
 * Handles password validation, strength checking, and password updates
 */
export function usePasswordChange(): UsePasswordChangeReturn {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const changePassword = useCallback(async () => {
    setErrors([]);

    // Validate passwords
    const validation = passwordService.validatePasswordChange(currentPassword, newPassword);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(validation.errors[0]);
      return;
    }

    setIsChanging(true);
    try {
      await passwordService.changePassword(currentPassword, newPassword);
      toast.success('Password updated successfully! 🔐');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setErrors([]);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update password';
      setErrors([errorMessage]);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsChanging(false);
    }
  }, [currentPassword, newPassword]);

  const reset = useCallback(() => {
    setCurrentPassword('');
    setNewPassword('');
    setErrors([]);
  }, []);

  const getPasswordStrength = useCallback(() => {
    return passwordService.getPasswordStrength(newPassword);
  }, [newPassword]);

  const getPasswordStrengthLabel = useCallback(() => {
    return passwordService.getPasswordStrengthLabel(newPassword);
  }, [newPassword]);

  return {
    currentPassword,
    newPassword,
    isChanging,
    errors,
    setCurrentPassword,
    setNewPassword,
    changePassword,
    reset,
    getPasswordStrength,
    getPasswordStrengthLabel
  };
}
