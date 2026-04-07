'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  store_id: string;
  email: string;
  name: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userEmail = localStorage.getItem('user_email');
    const userName = localStorage.getItem('user_name');
    const storeId = localStorage.getItem('store_id');

    if (token && userEmail && storeId) {
      setUser({
        token,
        email: userEmail,
        name: userName || '',
        store_id: storeId,
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as Record<string, unknown>).message
            ? String((errorData as Record<string, unknown>).message)
            : 'Login failed'
        );
      }

      const data = await response.json();

      // Store auth data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('store_id', data.store_id);

      setUser({
        token: data.token,
        email: data.email,
        name: data.name,
        store_id: data.store_id,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('store_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
