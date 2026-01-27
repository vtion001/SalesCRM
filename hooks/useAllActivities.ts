import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Activity } from '../types';

export const useAllActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setActivities(data || []);
      } catch (err) {
        console.error('Error fetching all activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllActivities();
  }, []);

  return { activities, loading };
};
