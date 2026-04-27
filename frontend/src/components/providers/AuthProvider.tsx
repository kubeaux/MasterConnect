"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin } from '@/src/lib/api';

interface User {
  id: number;
  username: string;
  user_type: 'etudiant' | 'encadrant' | 'administrateur';
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isStudent: boolean;
  isSupervisor: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await apiLogin(username, password);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const role = user?.user_type;
  const value: AuthContextType = {
    user,
    isLoading,
    isStudent: role === 'etudiant',
    isSupervisor: role === 'encadrant',
    isAdmin: role === 'administrateur',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};