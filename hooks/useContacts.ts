import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Contact } from '../types';

const mapContactFromDB = (data: any): Contact => ({
  id: data.id,
  name: data.name,
  role: data.role,
  company: data.company,
  email: data.email,
  phone: data.phone,
  lastContacted: data.last_contact_contacted || data.last_contacted,
  status: data.status
});

const mapContactToDB = (contact: Partial<Contact>) => ({
  name: contact.name,
  role: contact.role,
  company: contact.company,
  email: contact.email,
  phone: contact.phone,
  last_contacted: contact.lastContacted,
  status: contact.status
});

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
      setContacts((data || []).map(mapContactFromDB));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id'>) => {
    try {
      const dbData = mapContactToDB(contact);
      const { data, error: insertError } = await supabase
        .from('contacts')
        .insert([dbData])
        .select()
        .single();

      if (insertError) throw insertError;
      const newContact = mapContactFromDB(data);
      setContacts([newContact, ...contacts]);
      return newContact;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding contact:', err);
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const dbData = mapContactToDB(updates);
      const { data, error: updateError } = await supabase
        .from('contacts')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      const updatedContact = mapContactFromDB(data);
      setContacts(contacts.map(c => c.id === id ? updatedContact : c));
      return updatedContact;
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