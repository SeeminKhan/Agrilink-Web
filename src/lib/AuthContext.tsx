import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from './api';

export type Role = 'farmer' | 'buyer' | 'recruiter';

export interface AuthUser {
  _id?: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  location: string;
  phone?: string;
  primaryCrop?: string;
}

// ── Demo users — used as instant fallback when backend is unreachable ─────────
const DEMO_USERS: Record<string, AuthUser & { password: string }> = {
  'farmer@demo.com': {
    name: 'Ramesh Patil', email: 'farmer@demo.com', password: 'password',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    location: 'Nashik, Maharashtra',
  },
  'buyer@demo.com': {
    name: 'Priya Sharma', email: 'buyer@demo.com', password: 'password',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
    location: 'Pune, Maharashtra',
  },
  'recruiter@demo.com': {
    name: 'Suresh Mehta', email: 'recruiter@demo.com', password: 'password',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
    location: 'Mumbai, Maharashtra',
  },
};

const avatarFor = (role: Role) =>
  role === 'farmer'
    ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'
    : role === 'recruiter'
    ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'
    : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80';

// ── Context shape ─────────────────────────────────────────────────────────────
interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: Role, extras?: { phone?: string; location?: string; primaryCrop?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

// ── Helpers ───────────────────────────────────────────────────────────────────
const persist = (token: string, user: AuthUser) => {
  localStorage.setItem('agrilink_token', token);
  localStorage.setItem('agrilink_user', JSON.stringify(user));
};

const clear = () => {
  localStorage.removeItem('agrilink_token');
  localStorage.removeItem('agrilink_user');
};

const hydrate = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem('agrilink_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
};

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(hydrate);
  const [loading, setLoading] = useState(false);

  // Re-validate token on mount (silent — don't block UI)
  useEffect(() => {
    const token = localStorage.getItem('agrilink_token');
    if (!token || user) return;
    api.get('/auth/me')
      .then(({ data }) => setUser({ ...data, avatar: data.avatar || avatarFor(data.role) }))
      .catch(() => clear());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string, role: Role): Promise<{ ok: boolean; error?: string }> => {
    setLoading(true);
    try {
      // 1. Try real backend
      const { data } = await api.post('/auth/login', { email, password });
      const authUser: AuthUser = {
        ...data.user,
        avatar: data.user.avatar || avatarFor(data.user.role as Role),
        location: data.user.location || 'Maharashtra, India',
      };
      persist(data.token, authUser);
      setUser(authUser);
      return { ok: true };
    } catch (err: unknown) {
      const axiosErr = err as { code?: string; response?: { status?: number; data?: { message?: string } } };
      const isNetworkErr = !axiosErr.response;
      const is401 = axiosErr.response?.status === 401;

      // 2. Network down OR demo credentials → use local demo fallback
      if (isNetworkErr || (is401 && DEMO_USERS[email.toLowerCase()])) {
        const demo = DEMO_USERS[email.toLowerCase()];
        if (demo && demo.password === password) {
          const { password: _p, ...authUser } = demo;
          persist('demo_token', authUser);
          setUser(authUser);
          return { ok: true };
        }
        // Any credentials work offline as guest
        if (isNetworkErr) {
          const guest: AuthUser = {
            name: email.split('@')[0] || 'User', email, role,
            avatar: avatarFor(role), location: 'Maharashtra, India',
          };
          persist('demo_token', guest);
          setUser(guest);
          return { ok: true };
        }
      }
      // 3. Real error from server (wrong password etc.)
      const message = axiosErr.response?.data?.message || 'Invalid credentials.';
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ── Signup ─────────────────────────────────────────────────────────────────
  const signup = async (
    name: string, email: string, password: string, role: Role,
    extras: { phone?: string; location?: string; primaryCrop?: string } = {}
  ): Promise<{ ok: boolean; error?: string }> => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role, ...extras });
      const authUser: AuthUser = {
        ...data.user,
        avatar: data.user.avatar || avatarFor(data.user.role as Role),
        location: data.user.location || extras.location || 'Maharashtra, India',
      };
      persist(data.token, authUser);
      setUser(authUser);
      return { ok: true };
    } catch (err: unknown) {
      const axiosErr = err as { code?: string; response?: { data?: { message?: string } } };
      const isNetworkErr = !axiosErr.response;
      if (isNetworkErr) {
        // Offline fallback — create local guest
        const guest: AuthUser = {
          name, email, role,
          avatar: avatarFor(role),
          location: extras.location || 'Maharashtra, India',
          phone: extras.phone,
          primaryCrop: extras.primaryCrop,
        };
        persist('demo_token', guest);
        setUser(guest);
        return { ok: true };
      }
      const message = axiosErr.response?.data?.message || 'Registration failed.';
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    clear();
    setUser(null);
  };

  // ── Update user fields (avatar, name, etc.) ────────────────────────────────
  const updateUser = (patch: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      const token = localStorage.getItem('agrilink_token') || 'demo_token';
      persist(token, updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
