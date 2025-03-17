'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  auth,
  signInWithTwitter,
  signOut,
  listenToAuthChanges,
} from './index';

// Types and Interfaces
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
}

export interface UseAuth extends Omit<AuthState, 'initialized'> {
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Auth Hook
export const useAuth = (): UseAuth => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    initialized: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      try {
        unsubscribe = listenToAuthChanges((user) => {
          setState(prev => ({
            ...prev,
            user,
            loading: false,
            initialized: true,
            error: null
          }));
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error,
          loading: false,
          initialized: true
        }));
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAuthError = useCallback((error: any) => {
    setState(prev => ({ ...prev, error: error as Error }));
    throw error;
  }, []);

  const checkInitialized = useCallback(() => {
    if (!state.initialized) {
      throw new Error('Auth not initialized');
    }
  }, [state.initialized]);

  const wrapAuthCall = useCallback(async (authCall: () => Promise<any>) => {
    if (typeof window === 'undefined') {
      throw new Error('Authentication is not available during server-side rendering');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await authCall();
      return result;
    } catch (error) {
      handleAuthError(error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [handleAuthError]);

  const wrappedSignInWithTwitter = useCallback(async () => {
    try {
      checkInitialized();
      const result = await wrapAuthCall(signInWithTwitter);
      if (!result?.user) {
        throw new Error('No user returned from Twitter sign-in');
      }
    } catch (error) {
      handleAuthError(error);
    }
  }, [checkInitialized, wrapAuthCall, handleAuthError]);

  const wrappedSignOut = useCallback(async () => {
    try {
      checkInitialized();
      await wrapAuthCall(signOut);
    } catch (error) {
      handleAuthError(error);
    }
  }, [checkInitialized, wrapAuthCall, handleAuthError]);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signInWithTwitter: wrappedSignInWithTwitter,
    signOut: wrappedSignOut,
  };
}; 