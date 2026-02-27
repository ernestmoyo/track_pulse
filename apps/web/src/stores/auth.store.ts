import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@trackpulse/shared';
import { api } from '@/services/api';

// Demo users for offline/frontend-only mode
const DEMO_USERS: Record<string, { password: string; profile: UserProfile }> = {
  'sam@trackfield.com': {
    password: 'TrackField@2024',
    profile: {
      id: 'demo-admin-001',
      email: 'sam@trackfield.com',
      name: 'Samundombe Ilalio',
      role: 'ADMIN',
      organizationId: 'org-trackfield',
      organizationName: 'TrackField Projects',
    },
  },
  'analyst@trackfield.com': {
    password: 'Analyst@2024',
    profile: {
      id: 'demo-analyst-001',
      email: 'analyst@trackfield.com',
      name: 'Sarah Chen',
      role: 'ANALYST',
      organizationId: 'org-trackfield',
      organizationName: 'TrackField Projects',
    },
  },
  'tigerbrands@client.za': {
    password: 'Client@2024',
    profile: {
      id: 'demo-client-001',
      email: 'tigerbrands@client.za',
      name: 'Thabo Nkosi',
      role: 'CLIENT_VIEWER',
      organizationId: 'org-tigerbrands',
      organizationName: 'Tiger Brands',
    },
  },
};

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          const { user, accessToken, refreshToken } = res.data.data;
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Fallback to demo mode if API is unavailable
          const demoUser = DEMO_USERS[email];
          if (demoUser && demoUser.password === password) {
            set({
              user: demoUser.profile,
              accessToken: 'demo-token',
              refreshToken: 'demo-refresh',
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
          set({ isLoading: false });
          throw new Error('Invalid credentials');
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;
        try {
          const res = await api.post('/auth/refresh', { refreshToken });
          set({
            accessToken: res.data.data.accessToken,
            refreshToken: res.data.data.refreshToken,
          });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'trackpulse-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
