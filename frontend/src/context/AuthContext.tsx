import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name?: string; phone?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

const AUTH_STORAGE_KEY = 'raksha_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.user || null;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.token || null;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const login = async (email: string, password: string) => {
    const res: AuthResponse = await api.login(email, password);
    setUser(res.user);
    setToken(res.access_token);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: res.access_token, user: res.user })
    );
  };

  const register = async (data: { email: string; password: string; full_name?: string; phone?: string }) => {
    const res: AuthResponse = await api.register(data);
    setUser(res.user);
    setToken(res.access_token);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: res.access_token, user: res.user })
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
