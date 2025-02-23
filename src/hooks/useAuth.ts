import { useState, useEffect } from 'react';
import { User } from '@/types';
import ApiService from '@/services/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setState({ user: null, loading: false, error: null });
          return;
        }

        const response = await ApiService.get<User>('/auth/me');
        setState({ user: response.data, loading: false, error: null });
      } catch (err) {
        setState({
          user: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Authentication failed',
        });
      }
    };

    checkAuth();
  }, []);

  return state;
} 