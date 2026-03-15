import axios from 'axios';
import type { AuthResponse, TokenRefreshResponse } from '../types';
import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
        const { data } = await axios.post<TokenRefreshResponse>(
          `${API_BASE}/auth/refresh`,
          { refreshToken }
        );
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ===== Auth API =====
export const authAPI = {
  register: (email: string, username: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { email, username, password }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  getMe: () =>
    api.get<{ user: import('../types').User }>('/auth/me'),
};

// ===== Profile API =====
export const profileAPI = {
  getProfiles: () =>
    api.get<{ profiles: import('../types').Profile[] }>('/profiles'),
  createProfile: (name: string, avatar: string) =>
    api.post<{ profiles: import('../types').Profile[] }>('/profiles', { name, avatar }),
  updateProfile: (profileId: string, data: { name?: string; avatar?: string }) =>
    api.put<{ profile: import('../types').Profile }>(`/profiles/${profileId}`, data),
  deleteProfile: (profileId: string) =>
    api.delete<{ profiles: import('../types').Profile[] }>(`/profiles/${profileId}`),
  getWatchlist: (profileId: string) =>
    api.get<{ watchlist: number[] }>(`/profiles/${profileId}/watchlist`),
  addToWatchlist: (profileId: string, movieId: number) =>
    api.post<{ watchlist: number[] }>(`/profiles/${profileId}/watchlist`, { movieId }),
  removeFromWatchlist: (profileId: string, movieId: number) =>
    api.delete<{ watchlist: number[] }>(`/profiles/${profileId}/watchlist/${movieId}`),
};

// ===== TMDB API =====
export const tmdbAPI = {
  getTrending: (mediaType = 'all', timeWindow = 'week', page = 1) =>
    api.get(`/tmdb/trending/${mediaType}/${timeWindow}`, { params: { page } }),
  getPopularMovies: (page = 1) =>
    api.get('/tmdb/movies/popular', { params: { page } }),
  getTopRatedMovies: (page = 1) =>
    api.get('/tmdb/movies/top-rated', { params: { page } }),
  getNowPlayingMovies: (page = 1) =>
    api.get('/tmdb/movies/now-playing', { params: { page } }),
  getUpcomingMovies: (page = 1) =>
    api.get('/tmdb/movies/upcoming', { params: { page } }),
  getMovieDetails: (id: number) =>
    api.get(`/tmdb/movies/${id}`),
  getPopularTV: (page = 1) =>
    api.get('/tmdb/tv/popular', { params: { page } }),
  getTopRatedTV: (page = 1) =>
    api.get('/tmdb/tv/top-rated', { params: { page } }),
  getTVDetails: (id: number) =>
    api.get(`/tmdb/tv/${id}`),
  search: (q: string, page = 1) =>
    api.get('/tmdb/search', { params: { q, page } }),
  getGenres: () =>
    api.get('/tmdb/genres'),
  getMoviesByGenre: (genreId: number, page = 1) =>
    api.get(`/tmdb/genres/${genreId}/movies`, { params: { page } }),
};

// ===== IMDb API =====
export const imdbAPI = {
  /** Get IMDb data for a TMDB movie (auto-resolves imdb_id via TMDB) */
  getByTmdbMovieId: (tmdbId: number) =>
    api.get<import('../types').IMDbData>(`/imdb/movie/${tmdbId}`),

  /** Get IMDb data for a TMDB TV show (auto-resolves imdb_id via TMDB) */
  getByTmdbTVId: (tmdbId: number) =>
    api.get<import('../types').IMDbData>(`/imdb/tv/${tmdbId}`),

  /** Get IMDb data by IMDb ID directly */
  getByImdbId: (imdbId: string) =>
    api.get<import('../types').IMDbData>(`/imdb/${imdbId}`),

  /** Search OMDb by title */
  searchByTitle: (title: string, year?: string) =>
    api.get(`/imdb/search`, { params: { title, year } }),
};

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const getImageUrl = (path: string | null, size = 'w500') =>
  path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '';
export const getBackdropUrl = (path: string | null) =>
  path ? `${TMDB_IMAGE_BASE}/original${path}` : '';
