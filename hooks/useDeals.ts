import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Deal } from '../types';

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setDeals(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const addDeal = async (deal: Omit<Deal, 'id' | 'created_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('deals')
        .insert([deal])
        .select()
        .single();

      if (insertError) throw insertError;
      setDeals([data, ...deals]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding deal:', err);
    }
  };

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('deals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setDeals(deals.map(d => d.id === id ? data : d));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating deal:', err);
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setDeals(deals.filter(d => d.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting deal:', err);
    }
  };

  return { deals, loading, error, addDeal, updateDeal, deleteDeal, refetch: fetchDeals };
};
