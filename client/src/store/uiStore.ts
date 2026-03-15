import { create } from 'zustand';
import type { TMDBMovie } from '../types';

interface UIState {
  selectedMovie: TMDBMovie | null;
  isModalOpen: boolean;
  searchQuery: string;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;

  openModal: (movie: TMDBMovie) => void;
  closeModal: () => void;
  setSearchQuery: (q: string) => void;
  toggleSearch: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedMovie: null,
  isModalOpen: false,
  searchQuery: '',
  isSearchOpen: false,
  isMobileMenuOpen: false,

  openModal: (movie) =>
    set({ selectedMovie: movie, isModalOpen: true }),
  closeModal: () =>
    set({ selectedMovie: null, isModalOpen: false }),
  setSearchQuery: (q) =>
    set({ searchQuery: q }),
  toggleSearch: () =>
    set((s) => ({ isSearchOpen: !s.isSearchOpen, searchQuery: '' })),
  toggleMobileMenu: () =>
    set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () =>
    set({ isMobileMenuOpen: false }),
}));
