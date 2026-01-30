import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface CallHistory {
  id: string;
  lead_id: string;
  phone_number: string;
  call_type: 'incoming' | 'outgoing' | 'missed';
  duration_seconds: number;
  call_sid?: string;
  recording_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useCallHistory = (leadId?: string) => {
  const [callHistory, setCallHistory] = useState<CallHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCallHistory(leadId);
  }, [leadId]);

  const fetchCallHistory = async (id?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('call_history')
        .select('*');
      
      // If leadId provided, filter by it; otherwise get all calls
      if (id) {
        query = query.eq('lead_id', id);
      }
      
      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCallHistory(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching call history:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCallRecord = async (record: Omit<CallHistory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('call_history')
        .insert([record])
        .select()
        .single();

      if (insertError) throw insertError;
      setCallHistory([data, ...callHistory]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding call record:', err);
    }
  };

  const updateCallRecord = async (id: string, updates: Partial<CallHistory>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('call_history')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setCallHistory(callHistory.map(c => c.id === id ? data : c));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating call record:', err);
    }
  };

  const deleteCallRecord = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('call_history')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setCallHistory(callHistory.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting call record:', err);
    }
  };

  return { 
    callHistory, 
    loading, 
    error, 
    addCallRecord, 
    updateCallRecord, 
    deleteCallRecord, 
    refetch: () => fetchCallHistory(leadId)
  };
};
