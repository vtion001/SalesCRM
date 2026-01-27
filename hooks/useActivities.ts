import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Activity } from '../types';

export const useActivities = (leadId: string | null) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (leadId) {
      fetchActivities();
    } else {
      setActivities([]);
    }
  }, [leadId]);

  const fetchActivities = async () => {
    if (!leadId) return;
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setActivities(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    if (!leadId) return;
    try {
      const { data, error: insertError } = await supabase
        .from('activities')
        .insert([{ ...activity, lead_id: leadId }])
        .select()
        .single();

      if (insertError) throw insertError;
      setActivities([data, ...activities]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding activity:', err);
    }
  };

  return { activities, loading, error, addActivity, refetch: fetchActivities };
};
