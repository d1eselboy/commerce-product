import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { RootState } from '@/store';
import { loginStart, loginSuccess, loginFailure, logout, setLoading } from '@/store/authSlice';
import type { User } from '@/store/authSlice';

export const useAuth = () => {
  // Completely disabled for development - return mock data
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Mock functions for development
  const login = useCallback(async () => {
    // No-op for development
  }, []);

  const handleOAuthCallback = useCallback(async (code: string, state: string) => {
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

// Helper functions for OAuth2 PKCE
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(digest));
}

function base64URLEncode(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}