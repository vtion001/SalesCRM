import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Contact } from '../types';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setContacts(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id' | 'created_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('contacts')
        .insert([contact])
        .select()
        .single();

      if (insertError) throw insertError;
      setContacts([data, ...contacts]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding contact:', err);
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setContacts(contacts.map(c => c.id === id ? data : c));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating contact:', err);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting contact:', err);
    }
  };

  return { contacts, loading, error, addContact, updateContact, deleteContact, refetch: fetchContacts };
};
