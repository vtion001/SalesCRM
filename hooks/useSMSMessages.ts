import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface SMSMessage {
  id: string;
  lead_id: string;
  phone_number: string;
  message_text: string;
  message_type: 'sent' | 'received';
  message_sid?: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export const useSMSMessages = (leadId?: string) => {
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (leadId) {
      fetchMessages(leadId);
    }
  }, [leadId]);

  const fetchMessages = async (id: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('sms_messages')
        .select('*')
        .eq('lead_id', id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMessages(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching SMS messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (message: Omit<SMSMessage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('sms_messages')
        .insert([message])
        .select()
        .single();

      if (insertError) throw insertError;
      setMessages([data, ...messages]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding message:', err);
    }
  };

  const updateMessage = async (id: string, updates: Partial<SMSMessage>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('sms_messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setMessages(messages.map(m => m.id === id ? data : m));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating message:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('sms_messages')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setMessages(messages.filter(m => m.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting message:', err);
    }
  };

  return { 
    messages, 
    loading, 
    error, 
    addMessage, 
    updateMessage, 
    deleteMessage, 
    refetch: () => leadId && fetchMessages(leadId)
  };
};
