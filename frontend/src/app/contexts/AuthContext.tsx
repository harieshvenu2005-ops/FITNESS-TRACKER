import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { post, get, setAuthToken } from '@/utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      get<{ id:string; name:string; email:string; role:'user'|'admin'}>('/users/profile')
        .then((u: React.SetStateAction<User | null>) => setUser(u))
        .catch(() => {
          setToken(null);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await post<{ token: string; user: User }>('/auth/login', { email, password });
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await post<{ token: string; user: User }>('/auth/register', { name, email, password });
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
