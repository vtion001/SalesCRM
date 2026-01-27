import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Lead } from '../types';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setLeads(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'created_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single();

      if (insertError) throw insertError;
      setLeads([data, ...leads]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding lead:', err);
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setLeads(leads.map(l => l.id === id ? data : l));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating lead:', err);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setLeads(leads.filter(l => l.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting lead:', err);
    }
  };

  return { leads, loading, error, addLead, updateLead, deleteLead, refetch: fetchLeads };
};
