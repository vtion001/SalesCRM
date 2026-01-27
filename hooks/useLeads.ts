import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Lead } from '../types';

const mapLeadFromDB = (data: any): Lead => ({
  id: data.id,
  name: data.name,
  role: data.role,
  company: data.company,
  avatar: data.avatar,
  status: data.status,
  lastActivityTime: data.last_activity_time,
  email: data.email,
  phone: data.phone,
  isOnline: data.is_online,
  dealValue: Number(data.deal_value),
  probability: Number(data.probability),
  lastContactDate: data.last_contact_date
});

const mapLeadToDB = (lead: Partial<Lead>) => ({
  name: lead.name,
  role: lead.role,
  company: lead.company,
  avatar: lead.avatar,
  status: lead.status,
  last_activity_time: lead.lastActivityTime,
  email: lead.email,
  phone: lead.phone,
  is_online: lead.isOnline,
  deal_value: lead.dealValue,
  probability: lead.probability,
  last_contact_date: lead.lastContactDate
});

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
      setLeads((data || []).map(mapLeadFromDB));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (lead: Omit<Lead, 'id'>) => {
    try {
      const dbData = mapLeadToDB(lead);
      const { data, error: insertError } = await supabase
        .from('leads')
        .insert([dbData])
        .select()
        .single();

      if (insertError) throw insertError;
      const newLead = mapLeadFromDB(data);
      setLeads([newLead, ...leads]);
      return newLead;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding lead:', err);
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const dbData = mapLeadToDB(updates);
      const { data, error: updateError } = await supabase
        .from('leads')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      const updatedLead = mapLeadFromDB(data);
      setLeads(leads.map(l => l.id === id ? updatedLead : l));
      return updatedLead;
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