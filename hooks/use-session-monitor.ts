'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export function useSessionMonitor() {
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const monitorSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          // Decode JWT to get expiration time
          const payload = JSON.parse(atob(session.access_token.split('.')[1]));
          const expiresAt = payload.exp * 1000; // Convert to milliseconds
          const now = Date.now();
          const timeUntilExpiry = expiresAt - now;
          
          // Refresh token 5 minutes before expiry
          const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
          
          if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
          }
          
          refreshTimeoutRef.current = setTimeout(async () => {
            try {
              const { error } = await supabase.auth.refreshSession();
              if (error) {
                console.error('Failed to refresh session:', error);
              } else {
                console.log('Session refreshed proactively');
                // Restart monitoring with new session
                monitorSession();
              }
            } catch (error) {
              console.error('Error refreshing session:', error);
            }
          }, refreshTime);
        }
      } catch (error) {
        console.error('Error monitoring session:', error);
      }
    };

    monitorSession();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);
}