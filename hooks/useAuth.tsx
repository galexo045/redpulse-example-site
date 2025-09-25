import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/apiService';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'donations'> & { password: string }) => Promise<User>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start loading to check for existing session
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const user = await apiService.getCurrentUser();
          setCurrentUser(user);
        } catch (e) {
          // Token is invalid or expired
          apiService.logout();
        }
      }
      setLoading(false);
    };
    checkUserSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await apiService.login(email, password);
      setCurrentUser(user);
      return user;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiService.logout();
    setCurrentUser(null);
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'donations'> & { password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await apiService.register(userData);
      setCurrentUser(user);
      return user;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = { currentUser, login, logout, register, loading, error, isAuthenticated: !!currentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};