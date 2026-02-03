import { supabase } from './supabaseClient';
import { CurrentUser } from '../types';

export interface ProfileUpdateData {
  name?: string;
  role?: string;
  avatar?: string;
}

export interface ProfileValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * ProfileService - Handle profile update operations
 * Responsibility: Manage user profile data and updates
 */
export class ProfileService {
  /**
   * Validate profile data before update
   */
  validateProfileData(data: ProfileUpdateData): ProfileValidationResult {
    const errors: string[] = [];

    if (data.name !== undefined) {
      if (!data.name.trim()) {
        errors.push('Name cannot be empty');
      }
      if (data.name.length > 100) {
        errors.push('Name must be less than 100 characters');
      }
    }

    if (data.role !== undefined) {
      if (!data.role.trim()) {
        errors.push('Role cannot be empty');
      }
      if (data.role.length > 100) {
        errors.push('Role must be less than 100 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Update user profile in Supabase
   */
  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<void> {
    // Validate data first
    const validation = this.validateProfileData(updates);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.name,
        role: updates.role,
        avatar_url: updates.avatar,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  }

  /**
   * Get current user ID from session
   */
  async getCurrentUserId(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  }

  /**
   * Update profile for current user
   */
  async updateCurrentUserProfile(updates: ProfileUpdateData): Promise<void> {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      throw new Error('No active session');
    }

    await this.updateProfile(userId, updates);
  }
}

// Singleton instance
export const profileService = new ProfileService();
