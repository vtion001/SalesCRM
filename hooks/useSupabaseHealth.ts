import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface HealthStatus {
  isConnected: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  tablesAccessible: {
    leads: boolean;
    contacts: boolean;
    deals: boolean;
  };
  rlsStatus: {
    leads: number;
    contacts: number;
    deals: number;
  };
  error: string | null;
}

export const useSupabaseHealth = () => {
  const [health, setHealth] = useState<HealthStatus>({
    isConnected: false,
    isAuthenticated: false,
    userId: null,
    userEmail: null,
    tablesAccessible: { leads: false, contacts: false, deals: false },
    rlsStatus: { leads: 0, contacts: 0, deals: 0 },
    error: null
  });

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      // 1. Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setHealth(prev => ({ 
          ...prev, 
          isConnected: true, 
          isAuthenticated: false,
          error: 'Not authenticated - please log in'
        }));
        return;
      }

      // 2. Check table access
      const [leadsRes, contactsRes, dealsRes] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('deals').select('id', { count: 'exact', head: true })
      ]);

      setHealth({
        isConnected: true,
        isAuthenticated: true,
        userId: user.id,
        userEmail: user.email || null,
        tablesAccessible: {
          leads: !leadsRes.error,
          contacts: !contactsRes.error,
          deals: !dealsRes.error
        },
        rlsStatus: {
          leads: leadsRes.count || 0,
          contacts: contactsRes.count || 0,
          deals: dealsRes.count || 0
        },
        error: null
      });

      console.log('✅ Supabase Health Check:', {
        user: user.email,
        leads: leadsRes.count,
        contacts: contactsRes.count,
        deals: dealsRes.count
      });
    } catch (err: any) {
      console.error('❌ Supabase health check failed:', err);
      setHealth(prev => ({ ...prev, error: err.message }));
    }
  };

  return { health, refetch: checkHealth };
};
