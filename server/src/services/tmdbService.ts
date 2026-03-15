import NodeCache from 'node-cache';
import config from '../config';
import logger from '../utils/logger';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const TMDB_BASE = config.tmdb.baseUrl;
const API_KEY = config.tmdb.apiKey;

const buildUrl = (path: string, params: Record<string, string> = {}): string => {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

const fetchTMDB = async <T>(path: string, params: Record<string, string> = {}): Promise<T> => {
  const cacheKey = `${path}:${JSON.stringify(params)}`;
  const cached = cache.get<T>(cacheKey);
  if (cached) {
    logger.debug(`Cache hit: ${cacheKey}`);
    return cached;
  }

  const url = buildUrl(path, params);
  logger.debug(`Fetching TMDB: ${path}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as T;
  cache.set(cacheKey, data);
  return data;
};

// Movies
export const getTrending = (mediaType: string = 'all', timeWindow: string = 'week', page: string = '1') =>
  fetchTMDB(`/trending/${mediaType}/${timeWindow}`, { page });

export const getPopularMovies = (page: string = '1') =>
  fetchTMDB('/movie/popular', { page });

export const getTopRatedMovies = (page: string = '1') =>
  fetchTMDB('/movie/top_rated', { page });

export const getNowPlayingMovies = (page: string = '1') =>
  fetchTMDB('/movie/now_playing', { page });

export const getUpcomingMovies = (page: string = '1') =>
  fetchTMDB('/movie/upcoming', { page });

export const getMovieDetails = (id: string) =>
  fetchTMDB(`/movie/${id}`, { append_to_response: 'videos,credits,similar' });

export const getMovieVideos = (id: string) =>
  fetchTMDB(`/movie/${id}/videos`);

// TV Shows
export const getPopularTV = (page: string = '1') =>
  fetchTMDB('/tv/popular', { page });

export const getTopRatedTV = (page: string = '1') =>
  fetchTMDB('/tv/top_rated', { page });

export const getTVDetails = (id: string) =>
  fetchTMDB(`/tv/${id}`, { append_to_response: 'videos,credits,similar' });

// Search
export const searchMulti = (query: string, page: string = '1') =>
  fetchTMDB('/search/multi', { query, page });

export const searchMovies = (query: string, page: string = '1') =>
  fetchTMDB('/search/movie', { query, page });

// Genres
export const getMovieGenres = () =>
  fetchTMDB('/genre/movie/list');

export const getTVGenres = () =>
  fetchTMDB('/genre/tv/list');

// Discover
export const discoverMovies = (params: Record<string, string>) =>
  fetchTMDB('/discover/movie', params);

export const discoverTV = (params: Record<string, string>) =>
  fetchTMDB('/discover/tv', params);

// Get movies by genre
export const getMoviesByGenre = (genreId: string, page: string = '1') =>
  fetchTMDB('/discover/movie', { with_genres: genreId, page, sort_by: 'popularity.desc' });

// External IDs (for IMDb integration)
export const getExternalIds = (mediaType: 'movie' | 'tv', id: string) =>
  fetchTMDB(`/${mediaType}/${id}/external_ids`);
