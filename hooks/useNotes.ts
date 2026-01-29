import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Note } from '../types';

export const useNotes = (leadId: string | null) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [leadId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadId) {
        query = query.eq('lead_id', leadId);
      } else {
        query = query.is('lead_id', null);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setNotes(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (note: Omit<Note, 'id'>) => {
    try {
      const noteData = {
        ...note,
        lead_id: leadId || null // Explicitly null for workspace notes
      };
      
      const { data, error: insertError } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();

      if (insertError) throw insertError;
      setNotes([data, ...notes]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding note:', err);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setNotes(notes.map(n => n.id === id ? data : n));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating note:', err);
    }
  };

  return { notes, loading, error, addNote, updateNote, refetch: fetchNotes };
};
