import { Request, Response, NextFunction } from 'express';
import * as tmdbService from '../services/tmdbService';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { cache } from '../middleware/cache';

export const getTrending = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { mediaType = 'all', timeWindow = 'week' } = req.params;
    const { page = '1' } = req.query;
    const data = await tmdbService.getTrending(mediaType, timeWindow, page as string);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getPopularMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1' } = req.query;
    const data = await tmdbService.getPopularMovies(page as string);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTopRatedMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1' } = req.query;
    const data = await tmdbService.getTopRatedMovies(page as string);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getNowPlayingMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1' } = req.query;
    const data = await tmdbService.getNowPlayingMovies(page as string);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUpcomingMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1' } = req.query;
    const data = await tmdbService.getUpcomingMovies(page as string);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMovieDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) throw new AppError('Movie ID required', 400);
    const data = await tmdbService.getMovieDetails(id);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getPopularTV = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1' } = req.query;
    const data = await tmdbService.getPopularTV(page as string);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTopRatedTV = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1' } = req.query;
    const data = await tmdbService.getTopRatedTV(page as string);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTVDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) throw new AppError('TV Show ID required', 400);
    const data = await tmdbService.getTVDetails(id);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const searchMulti = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q, query, page = '1' } = req.query;
    const searchQuery = (q || query) as string;
    if (!searchQuery) throw new AppError('Search query required', 400);

    const profileId = req.user?.profileId || req.ip || 'anonymous';
    const cacheKey = `search_history_${profileId}`;
    let history = cache.get<string[]>(cacheKey) || [];
    history = [searchQuery, ...history.filter(h => h.toLowerCase() !== searchQuery.toLowerCase())].slice(0, 5); // Keep top 5 latest searches
    cache.set(cacheKey, history, 604800); // 7 days

    const data: any = await tmdbService.searchMulti(searchQuery, page as string);
    res.json(new ApiResponse(200, data, 'Search results fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getActorDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) throw new AppError('Actor ID required', 400);

    const [actor, movies, tvShows] = await Promise.all([
      tmdbService.getActorDetails(id),
      tmdbService.getActorMovieCredits(id),
      tmdbService.getActorTVCredits(id)
    ]);

    res.json(new ApiResponse(200, { actor, movies, tvShows }, 'Actor details fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getGenres = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      tmdbService.getMovieGenres(),
      tmdbService.getTVGenres(),
    ]);
    res.json(new ApiResponse(200, { movie: movieGenres, tv: tvGenres }, 'Genres fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMoviesByGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { genreId } = req.params;
    const { page = '1' } = req.query;
    const data = await tmdbService.getMoviesByGenre(genreId, page as string);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const discoverMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Collect all query params to string map
    const params: Record<string, string> = {};
    Object.keys(req.query).forEach((key) => {
      params[key] = String(req.query[key]);
    });
    const data = await tmdbService.discoverMovies(params);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const discoverTV = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Collect all query params to string map
    const params: Record<string, string> = {};
    Object.keys(req.query).forEach((key) => {
      params[key] = String(req.query[key]);
    });
    const data = await tmdbService.discoverTV(params);
    res.json(new ApiResponse(200, data, 'Data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getPersonalizedRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profileId = req.user?.profileId || req.ip || 'anonymous';
    const cacheKey = `search_history_${profileId}`;
    const history = cache.get<string[]>(cacheKey);

    if (history && history.length > 0) {
      // Pick the most recent search query
      const recentQuery = history[0];
      const searchResult: any = await tmdbService.searchMulti(recentQuery, '1');
      res.json(new ApiResponse(200, searchResult, `Recommended based on your recent search: "${recentQuery}"`));
      return;
    }

    // Default to trending if no history
    const trendingData = await tmdbService.getTrending('all', 'week', '1');
    res.json(new ApiResponse(200, trendingData, 'Recommended (Trending)'));
  } catch (error) {
    next(error);
  }
};
