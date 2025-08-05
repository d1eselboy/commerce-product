import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { RootState } from '@/store';
import { loginStart, loginSuccess, loginFailure, logout, setLoading } from '@/store/authSlice';
import type { User } from '@/store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  const login = useCallback(async () => {
    dispatch(loginStart());
    
    try {
      // OAuth2 PKCE flow - redirect to SSO
      const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/callback`;
      const state = Math.random().toString(36).substring(2, 15);
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Store for later use
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('code_verifier', codeVerifier);
      
      const authUrl = new URL(process.env.REACT_APP_OAUTH_AUTH_URL || '');
      authUrl.searchParams.set('client_id', clientId || '');
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'openid profile email');
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('code_challenge', codeChallenge);
      authUrl.searchParams.set('code_challenge_method', 'S256');
      
      window.location.href = authUrl.toString();
    } catch (error) {
      dispatch(loginFailure());
    }
  }, [dispatch]);

  const handleOAuthCallback = useCallback(async (code: string, state: string) => {
    const storedState = sessionStorage.getItem('oauth_state');
    const codeVerifier = sessionStorage.getItem('code_verifier');
    
    if (state !== storedState) {
      dispatch(loginFailure());
      return;
    }
    
    try {
      // Exchange code for token
      const response = await fetch('/api/v1/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          code_verifier: codeVerifier,
          redirect_uri: `${window.location.origin}/auth/callback`,
        }),
      });
      
      if (!response.ok) throw new Error('Token exchange failed');
      
      const { access_token, user: userData } = await response.json();
      
      dispatch(loginSuccess({ token: access_token, user: userData as User }));
      
      // Cleanup
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('code_verifier');
    } catch (error) {
      dispatch(loginFailure());
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Check token validity on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        dispatch(setLoading(false));
        return;
      }
      
      try {
        const response = await fetch('/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const user = await response.json();
          dispatch(loginSuccess({ token, user }));
        } else {
          dispatch(loginFailure());
        }
      } catch {
        dispatch(loginFailure());
      }
    };
    
    checkAuth();
  }, [token, dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
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