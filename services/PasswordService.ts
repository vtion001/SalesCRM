import { supabase } from './supabaseClient';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordRules {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  specialChars: string;
}

/**
 * PasswordService - Handle password management and validation
 * Responsibility: Password validation, strength checking, and updates
 */
export class PasswordService {
  private readonly rules: PasswordRules = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
    specialChars: '@$!%*?&'
  };

  /**
   * Validate password strength
   */
  validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < this.rules.minLength) {
      errors.push(`Password must be at least ${this.rules.minLength} characters`);
    }

    if (this.rules.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.rules.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.rules.requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.rules.requireSpecial) {
      const specialCharsRegex = new RegExp(`[${this.rules.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
      if (!specialCharsRegex.test(password)) {
        errors.push(`Password must contain at least one special character (${this.rules.specialChars})`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate both current and new password
   */
  validatePasswordChange(currentPassword: string, newPassword: string): PasswordValidationResult {
    const errors: string[] = [];

    if (!currentPassword) {
      errors.push('Current password is required');
    }

    if (!newPassword) {
      errors.push('New password is required');
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.push('New password must be different from current password');
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Validate new password strength
    return this.validatePassword(newPassword);
  }

  /**
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Validate passwords
    const validation = this.validatePasswordChange(currentPassword, newPassword);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Verify session exists
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Session expired. Please login again.');
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }
  }

  /**
   * Get password strength score (0-4)
   */
  getPasswordStrength(password: string): number {
    let score = 0;

    if (password.length >= this.rules.minLength) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (new RegExp(`[${this.rules.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) score++;

    return Math.min(score, 4);
  }

  /**
   * Get password strength label
   */
  getPasswordStrengthLabel(password: string): string {
    const strength = this.getPasswordStrength(password);
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[strength] || 'Very Weak';
  }
}

// Singleton instance
export const passwordService = new PasswordService();
