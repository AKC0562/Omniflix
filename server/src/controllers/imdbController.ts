import { Request, Response, NextFunction } from 'express';
import * as imdbService from '../services/imdbService';
import * as tmdbService from '../services/tmdbService';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/imdb/:imdbId
 * Fetch enriched IMDb data by IMDb ID directly
 */
export const getByImdbId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { imdbId } = req.params;
    if (!imdbId || !imdbId.startsWith('tt')) {
      throw new AppError('Valid IMDb ID required (e.g. tt1234567)', 400);
    }

    const data = await imdbService.getEnrichedData(imdbId);
    if (!data) {
      throw new AppError('IMDb data not found', 404);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/imdb/movie/:tmdbId
 * Fetch IMDb data for a TMDB movie — automatically gets the imdb_id from TMDB first
 */
export const getByTmdbMovieId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tmdbId } = req.params;
    if (!tmdbId) throw new AppError('TMDB Movie ID required', 400);

    // Get movie details from TMDB which includes imdb_id
    const tmdbData = (await tmdbService.getMovieDetails(tmdbId)) as any;
    const imdbId = tmdbData?.imdb_id;

    if (!imdbId) {
      throw new AppError('No IMDb ID found for this movie', 404);
    }

    const data = await imdbService.getEnrichedData(imdbId);
    if (!data) {
      throw new AppError('IMDb data not found', 404);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/imdb/tv/:tmdbId
 * Fetch IMDb data for a TMDB TV show — uses external_ids endpoint
 */
export const getByTmdbTVId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tmdbId } = req.params;
    if (!tmdbId) throw new AppError('TMDB TV ID required', 400);

    // Get TV details from TMDB which includes external_ids
    const tmdbData = (await tmdbService.getTVDetails(tmdbId)) as any;
    // TV shows sometimes have the external_ids in the response or we may need a separate call
    const imdbId = tmdbData?.external_ids?.imdb_id || tmdbData?.imdb_id;

    if (!imdbId) {
      // Try the external_ids endpoint
      const { getExternalIds } = await import('../services/tmdbService');
      const externalIds = (await getExternalIds('tv', tmdbId)) as any;
      const fallbackImdbId = externalIds?.imdb_id;

      if (!fallbackImdbId) {
        throw new AppError('No IMDb ID found for this TV show', 404);
      }

      const data = await imdbService.getEnrichedData(fallbackImdbId);
      if (!data) {
        throw new AppError('IMDb data not found', 404);
      }

      res.json(data);
      return;
    }

    const data = await imdbService.getEnrichedData(imdbId);
    if (!data) {
      throw new AppError('IMDb data not found', 404);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/imdb/search?title=xxx&year=2024
 * Search OMDb by title
 */
export const searchByTitle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, year } = req.query;
    if (!title) throw new AppError('Title query required', 400);

    const data = await imdbService.searchByTitle(
      title as string,
      year as string | undefined
    );
    if (!data) {
      throw new AppError('No results found', 404);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};
