import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Role = 'farmer' | 'buyer' | 'recruiter';

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
  avatar: string;
  location: string;
}

const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  'farmer@demo.com': {
    name: 'John Mwangi',
    email: 'farmer@demo.com',
    password: 'password',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    location: 'Nairobi, Kenya',
  },
  'recruiter@demo.com': {
    name: 'David Kariuki',
    email: 'recruiter@demo.com',
    password: 'password',
    role: 'recruiter' as const,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
    location: 'Nairobi, Kenya',
  },
};



interface AuthCtx {
  user: AuthUser | null;
  login: (email: string, password: string, role: Role) => { ok: boolean; error?: string };
  signup: (name: string, email: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string, role: Role) => {
    // Accept any email — if it matches a mock user use that, otherwise create a guest
    const found = MOCK_USERS[email.toLowerCase()];
    if (found) {
      setUser(found);
      return { ok: true };
    }
    // Accept any credentials as a guest with the chosen role
    setUser({
      name: email.split('@')[0] || 'User',
      email,
      role,
      avatar: role === 'farmer'
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'
        : role === 'recruiter'
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
      location: 'Africa',
    });
    return { ok: true };
  };

  const signup = (name: string, email: string, role: Role) => {
    setUser({
      name,
      email,
      role,
      avatar: role === 'farmer'
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'
        : role === 'recruiter'
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
      location: 'Africa',
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
