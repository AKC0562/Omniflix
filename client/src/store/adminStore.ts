// ===== Admin Store =====
// Zustand store for admin dashboard state management
import { create } from 'zustand';
import type { AdminStats, AdminUser, Pagination } from '../types';
import { adminAPI } from '../services/api';

interface AdminState {
  // Data
  stats: AdminStats | null;
  users: AdminUser[];
  pagination: Pagination | null;

  // UI State
  isLoadingStats: boolean;
  isLoadingUsers: boolean;
  isDeletingUser: string | null; // userId being deleted
  searchQuery: string;
  currentPage: number;
  error: string | null;
  successMessage: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  fetchUsers: (page?: number, search?: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  clearMessages: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  stats: null,
  users: [],
  pagination: null,
  isLoadingStats: false,
  isLoadingUsers: false,
  isDeletingUser: null,
  searchQuery: '',
  currentPage: 1,
  error: null,
  successMessage: null,

  // Fetch dashboard stats
  fetchStats: async () => {
    set({ isLoadingStats: true, error: null });
    try {
      const { data } = await adminAPI.getStats();
      set({ stats: data.stats, isLoadingStats: false });
    } catch (err: any) {
      set({
        isLoadingStats: false,
        error: err.response?.data?.message || 'Failed to load statistics',
      });
    }
  },

  // Fetch users with pagination & search
  fetchUsers: async (page?: number, search?: string) => {
    const currentPage = page || get().currentPage;
    const searchQuery = search !== undefined ? search : get().searchQuery;
    set({ isLoadingUsers: true, error: null, currentPage, searchQuery });
    try {
      const { data } = await adminAPI.getUsers(currentPage, 20, searchQuery);
      set({
        users: data.users,
        pagination: data.pagination,
        isLoadingUsers: false,
      });
    } catch (err: any) {
      set({
        isLoadingUsers: false,
        error: err.response?.data?.message || 'Failed to load users',
      });
    }
  },

  // Delete a user
  deleteUser: async (userId: string) => {
    set({ isDeletingUser: userId, error: null });
    try {
      const { data } = await adminAPI.deleteUser(userId);
      // Remove user from list optimistically
      set((state) => ({
        users: state.users.filter((u) => u._id !== userId),
        isDeletingUser: null,
        successMessage: data.message,
      }));
      // Refresh stats after deletion
      get().fetchStats();
    } catch (err: any) {
      set({
        isDeletingUser: null,
        error: err.response?.data?.message || 'Failed to delete user',
      });
    }
  },

  // Update a user's role
  updateUserRole: async (userId: string, role: 'user' | 'admin') => {
    set({ error: null });
    try {
      const { data } = await adminAPI.updateUserRole(userId, role);
      // Update user in list
      set((state) => ({
        users: state.users.map((u) =>
          u._id === userId ? { ...u, role } : u
        ),
        successMessage: data.message,
      }));
      get().fetchStats();
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to update role',
      });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentPage: (page) => set({ currentPage: page }),
  clearMessages: () => set({ error: null, successMessage: null }),
}));
