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
      
      // Map snake_case to camelCase for React
      const mappedNotes: Note[] = (data || []).map(note => ({
        id: note.id,
        content: note.content,
        isPinned: note.is_pinned,
        author: note.author,
        leadId: note.lead_id,
        userId: note.user_id,
        createdAt: note.created_at
      }));
      
      setNotes(mappedNotes);
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
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('User not authenticated');

      // Map camelCase to snake_case for database
      const noteData = {
        content: note.content,
        is_pinned: note.isPinned,
        author: note.author,
        lead_id: leadId || null, // Explicitly null for workspace notes
        user_id: user.user.id
      };
      
      const { data, error: insertError } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Map snake_case back to camelCase for React state
      const mappedData: Note = {
        id: data.id,
        content: data.content,
        isPinned: data.is_pinned,
        author: data.author,
        leadId: data.lead_id,
        userId: data.user_id,
        createdAt: data.created_at
      };
      
      setNotes([mappedData, ...notes]);
      return mappedData;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding note:', err);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      // Map camelCase to snake_case for database
      const dbUpdates: any = {};
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.isPinned !== undefined) dbUpdates.is_pinned = updates.isPinned;
      if (updates.author !== undefined) dbUpdates.author = updates.author;
      
      const { data, error: updateError } = await supabase
        .from('notes')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      // Map snake_case back to camelCase
      const mappedData: Note = {
        id: data.id,
        content: data.content,
        isPinned: data.is_pinned,
        author: data.author,
        leadId: data.lead_id,
        userId: data.user_id,
        createdAt: data.created_at
      };
      
      setNotes(notes.map(n => n.id === id ? mappedData : n));
      return mappedData;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating note:', err);
    }
  };

  return { notes, loading, error, addNote, updateNote, refetch: fetchNotes };
};
