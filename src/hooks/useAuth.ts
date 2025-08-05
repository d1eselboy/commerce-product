import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState } from '@/store';

export const useAuth = () => {
  // Completely disabled for development - return mock data
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Mock functions for development
  const login = useCallback(async () => {
    // No-op for development
  }, []);

  const handleOAuthCallback = useCallback(async () => {
    // No-op for development
  }, []);

  const handleLogout = useCallback(() => {
    // No-op for development
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    isLoading: false, // Always false for development
    login,
    logout: handleLogout,
    handleOAuthCallback,
  };
};


function base64URLEncode(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}