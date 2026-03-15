import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Profile } from '../types';
import { authAPI, profileAPI } from '../services/api';

interface AuthState {
  user: User | null;
  activeProfile: Profile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setActiveProfile: (profile: Profile) => void;
  clearError: () => void;
  updateProfiles: (profiles: Profile[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      activeProfile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.login(email, password);
          set({
            user: data.user,
            activeProfile: data.user.profiles[0] || null,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Login failed',
          });
          throw err;
        }
      },

      register: async (email, username, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.register(email, username, password);
          set({
            user: data.user,
            activeProfile: data.user.profiles[0] || null,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Registration failed',
          });
          throw err;
        }
      },

      logout: () => {
        const rt = get().refreshToken;
        if (rt && get().accessToken) {
          authAPI.logout(rt).catch(() => {});
        }
        set({
          user: null,
          activeProfile: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchUser: async () => {
        try {
          const { data } = await authAPI.getMe();
          set({ user: data.user, isAuthenticated: true });
        } catch {
          set({ isAuthenticated: false });
        }
      },

      setActiveProfile: (profile) =>
        set({ activeProfile: profile }),

      clearError: () => set({ error: null }),

      updateProfiles: (profiles) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, profiles } });
        }
      },
    }),
    {
      name: 'omniflix-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        activeProfile: state.activeProfile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
