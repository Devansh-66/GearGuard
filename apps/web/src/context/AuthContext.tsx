import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'Manager' | 'Technician';

interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gearguard_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gearguard_token'));

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            return data.error || 'Login failed';
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('gearguard_user', JSON.stringify(data.user));
        localStorage.setItem('gearguard_token', data.token);
        return null; // No error
    } catch (e) {
        return 'Network error';
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gearguard_user');
    localStorage.removeItem('gearguard_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
