import { supabase } from '../supabaseClient';

export interface CallRecord {
  lead_id: string | null;
  phone_number: string;
  call_type: 'incoming' | 'outgoing';
  duration_seconds: number;
  call_sid?: string;
  notes?: string;
  user_id: string;
}

export interface CallRecordUpdate {
  duration_seconds?: number;
  notes?: string;
}

/**
 * CallHistoryService - Manages call history database operations
 * Responsibility: CRUD operations for call records in Supabase
 */
export class CallHistoryService {
  /**
   * Create a new call record in the database
   */
  async createCallRecord(record: CallRecord): Promise<{ id: string } | null> {
    try {
      const { data, error } = await supabase
        .from('call_history')
        .insert([record])
        .select('id')
        .single();

      if (error) {
        console.error('Failed to create call record:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception creating call record:', error);
      return null;
    }
  }

  /**
   * Update an existing call record
   */
  async updateCallRecord(
    id: string,
    updates: CallRecordUpdate
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('call_history')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Failed to update call record:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception updating call record:', error);
      return false;
    }
  }

  /**
   * Get current authenticated user ID
   */
  async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Create incoming call record
   */
  async logIncomingCall(
    phoneNumber: string,
    callSid: string,
    leadId?: string
  ): Promise<{ id: string } | null> {
    const userId = await this.getCurrentUserId();
    if (!userId) return null;

    return this.createCallRecord({
      lead_id: leadId || null,
      phone_number: phoneNumber,
      call_type: 'incoming',
      duration_seconds: 0,
      call_sid: callSid,
      notes: 'Ringing...',
      user_id: userId
    });
  }

  /**
   * Create outgoing call record
   */
  async logOutgoingCall(
    phoneNumber: string,
    provider: string,
    leadId?: string
  ): Promise<{ id: string } | null> {
    const userId = await this.getCurrentUserId();
    if (!userId) return null;

    return this.createCallRecord({
      lead_id: leadId || null,
      phone_number: phoneNumber,
      call_type: 'outgoing',
      duration_seconds: 0,
      notes: `Dialing via ${provider}...`,
      user_id: userId
    });
  }

  /**
   * Update call duration and completion status
   */
  async updateCallDuration(
    id: string,
    durationSeconds: number,
    notes?: string
  ): Promise<boolean> {
    return this.updateCallRecord(id, {
      duration_seconds: durationSeconds,
      notes: notes || `Call completed - ${this.formatDuration(durationSeconds)}`
    });
  }

  /**
   * Mark call as answered
   */
  async markCallAnswered(id: string): Promise<boolean> {
    return this.updateCallRecord(id, {
      notes: 'Answered'
    });
  }

  /**
   * Mark call as rejected/missed
   */
  async markCallRejected(id: string): Promise<boolean> {
    return this.updateCallRecord(id, {
      notes: 'Rejected',
      duration_seconds: 0
    });
  }

  /**
   * Format duration in MM:SS format
   */
  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Singleton instance
export const callHistoryService = new CallHistoryService();
