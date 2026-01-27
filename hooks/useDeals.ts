import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Deal } from '../types';

const mapDealFromDB = (data: any): Deal => ({
  id: data.id,
  title: data.title,
  value: Number(data.value),
  company: data.company,
  stage: data.stage,
  owner: data.owner,
  closingDate: data.closing_date
});

const mapDealToDB = (deal: Partial<Deal>) => ({
  title: deal.title,
  value: deal.value,
  company: deal.company,
  stage: deal.stage,
  owner: deal.owner,
  closing_date: deal.closingDate
});

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
      setDeals((data || []).map(mapDealFromDB));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const addDeal = async (deal: Omit<Deal, 'id'>) => {
    try {
      const dbData = mapDealToDB(deal);
      const { data, error: insertError } = await supabase
        .from('deals')
        .insert([dbData])
        .select()
        .single();

      if (insertError) throw insertError;
      const newDeal = mapDealFromDB(data);
      setDeals([newDeal, ...deals]);
      return newDeal;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding deal:', err);
    }
  };

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
    try {
      const dbData = mapDealToDB(updates);
      const { data, error: updateError } = await supabase
        .from('deals')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      const updatedDeal = mapDealFromDB(data);
      setDeals(deals.map(d => d.id === id ? updatedDeal : d));
      return updatedDeal;
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