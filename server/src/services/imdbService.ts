import NodeCache from 'node-cache';
import config from '../config';
import logger from '../utils/logger';

// Cache IMDb data for 24 hours (it doesn't change often)
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });

const OMDB_BASE = 'https://www.omdbapi.com';
const API_KEY = config.omdb.apiKey;

export interface IMDbRating {
  Source: string;
  Value: string;
}

export interface IMDbData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: IMDbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

/**
 * Fetch movie/show data from OMDb API by IMDb ID
 */
export const getByImdbId = async (imdbId: string): Promise<IMDbData | null> => {
  if (!API_KEY) {
    logger.warn('OMDb API key not configured. IMDb data unavailable.');
    return null;
  }

  const cacheKey = `imdb:${imdbId}`;
  const cached = cache.get<IMDbData>(cacheKey);
  if (cached) {
    logger.debug(`IMDb cache hit: ${imdbId}`);
    return cached;
  }

  try {
    const url = `${OMDB_BASE}/?apikey=${API_KEY}&i=${imdbId}&plot=full`;
    logger.debug(`Fetching OMDb: ${imdbId}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OMDb API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as IMDbData;

    if (data.Response === 'False') {
      logger.warn(`OMDb not found: ${imdbId} - ${data.Error}`);
      return null;
    }

    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    logger.error(`OMDb fetch failed for ${imdbId}:`, error);
    return null;
  }
};

/**
 * Search OMDb by title
 */
export const searchByTitle = async (title: string, year?: string): Promise<IMDbData | null> => {
  if (!API_KEY) {
    logger.warn('OMDb API key not configured. IMDb data unavailable.');
    return null;
  }

  const cacheKey = `imdb:search:${title}:${year || ''}`;
  const cached = cache.get<IMDbData>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    let url = `${OMDB_BASE}/?apikey=${API_KEY}&t=${encodeURIComponent(title)}&plot=full`;
    if (year) url += `&y=${year}`;
    logger.debug(`OMDb search: ${title}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OMDb API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as IMDbData;

    if (data.Response === 'False') {
      logger.warn(`OMDb search not found: ${title}`);
      return null;
    }

    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    logger.error(`OMDb search failed for ${title}:`, error);
    return null;
  }
};

/**
 * Get enriched movie data: TMDB details + IMDb data combined
 * This uses the imdb_id from TMDB response to fetch additional IMDb data
 */
export const getEnrichedData = async (imdbId: string) => {
  const imdbData = await getByImdbId(imdbId);
  if (!imdbData) return null;

  return {
    imdbRating: imdbData.imdbRating !== 'N/A' ? parseFloat(imdbData.imdbRating) : null,
    imdbVotes: imdbData.imdbVotes !== 'N/A' ? imdbData.imdbVotes : null,
    imdbId: imdbData.imdbID,
    ratings: imdbData.Ratings.map((r) => ({
      source: r.Source,
      value: r.Value,
    })),
    metascore: imdbData.Metascore !== 'N/A' ? parseInt(imdbData.Metascore, 10) : null,
    rated: imdbData.Rated !== 'N/A' ? imdbData.Rated : null,
    awards: imdbData.Awards !== 'N/A' ? imdbData.Awards : null,
    boxOffice: imdbData.BoxOffice !== 'N/A' ? imdbData.BoxOffice : null,
    director: imdbData.Director !== 'N/A' ? imdbData.Director : null,
    writer: imdbData.Writer !== 'N/A' ? imdbData.Writer : null,
    actors: imdbData.Actors !== 'N/A' ? imdbData.Actors : null,
    country: imdbData.Country !== 'N/A' ? imdbData.Country : null,
    language: imdbData.Language !== 'N/A' ? imdbData.Language : null,
    dvd: imdbData.DVD !== 'N/A' ? imdbData.DVD : null,
    production: imdbData.Production !== 'N/A' ? imdbData.Production : null,
  };
};
