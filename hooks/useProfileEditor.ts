import { useState, useEffect, useCallback } from 'react';
import { CurrentUser } from '../types';
import { profileService } from '../services/ProfileService';
import { fileUploadService } from '../services/FileUploadService';
import { toast } from 'react-hot-toast';

export interface ProfileEditorState {
  name: string;
  role: string;
  avatar: string;
}

export interface UseProfileEditorReturn {
  editedProfile: ProfileEditorState;
  isDirty: boolean;
  isLoading: boolean;
  updateField: (field: keyof ProfileEditorState, value: string) => void;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  save: () => Promise<void>;
  reset: () => void;
}

/**
 * useProfileEditor - Manage profile editing state and operations
 * Handles profile updates, avatar uploads, and dirty state tracking
 */
export function useProfileEditor(
  user: CurrentUser,
  onUpdateProfile: (updates: Partial<CurrentUser>) => void
): UseProfileEditorReturn {
  const [editedProfile, setEditedProfile] = useState<ProfileEditorState>({
    name: user.name,
    role: user.role,
    avatar: user.avatar
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync with user prop when it changes
  useEffect(() => {
    setEditedProfile({
      name: user.name,
      role: user.role,
      avatar: user.avatar
    });
  }, [user.name, user.role, user.avatar]);

  // Check if profile has been modified
  const isDirty = 
    editedProfile.name !== user.name ||
    editedProfile.role !== user.role ||
    editedProfile.avatar !== user.avatar;

  const updateField = useCallback((field: keyof ProfileEditorState, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAvatarUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const dataUrl = await fileUploadService.readFileFromEvent(event);
      if (dataUrl) {
        setEditedProfile(prev => ({ ...prev, avatar: dataUrl }));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload avatar');
    }
  }, []);

  const save = useCallback(async () => {
    if (!isDirty) return;

    setIsLoading(true);
    try {
      // Call the parent's update handler
      onUpdateProfile({
        name: editedProfile.name,
        role: editedProfile.role,
        avatar: editedProfile.avatar
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [editedProfile, isDirty, onUpdateProfile]);

  const reset = useCallback(() => {
    setEditedProfile({
      name: user.name,
      role: user.role,
      avatar: user.avatar
    });
  }, [user]);

  return {
    editedProfile,
    isDirty,
    isLoading,
    updateField,
    handleAvatarUpload,
    save,
    reset
  };
}
