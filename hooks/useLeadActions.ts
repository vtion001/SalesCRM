/**
 * useLeadActions - Business Logic Hook for Lead Actions
 * Separates complex lead operations from UI components
 */

import { Activity, Note } from '../types';

export interface LeadActionsConfig {
  leadId: string | undefined;
  onAddNote?: (note: Omit<Note, 'id'>) => Promise<void>;
  onAddActivity?: (activity: Omit<Activity, 'id'>) => Promise<void>;
}

export const useLeadActions = (config: LeadActionsConfig) => {
  const { leadId, onAddNote, onAddActivity } = config;

  /**
   * Saves a note and automatically logs it as an activity
   * This is an atomic business operation
   */
  const saveNoteWithActivity = async (noteContent: string, author: string) => {
    if (!noteContent.trim() || !leadId) return;

    // 1. Save the actual note
    if (onAddNote) {
      await onAddNote({
        content: noteContent,
        isPinned: false,
        author
      });
    }

    // 2. Add to Activity Timeline as a note entry
    if (onAddActivity) {
      await onAddActivity({
        type: 'note',
        title: 'Note Added',
        description: noteContent.length > 60 
          ? noteContent.substring(0, 60) + '...' 
          : noteContent,
        timestamp: new Date().toLocaleString(),
      });
    }
  };

  /**
   * Logs a manual activity (call or SMS)
   */
  const logManualActivity = async (type: 'call' | 'email') => {
    if (!onAddActivity || !leadId) return;

    await onAddActivity({
      type,
      title: type === 'call' ? 'Manual Call' : 'Manual SMS',
      description: type === 'call' 
        ? 'Manual voice interaction recorded' 
        : 'Manual SMS record added',
      timestamp: new Date().toLocaleString(),
    });
  };

  return {
    saveNoteWithActivity,
    logManualActivity
  };
};
