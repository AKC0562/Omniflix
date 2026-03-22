import { Request, Response, NextFunction } from 'express';
import * as tmdbService from '../services/tmdbService';
import { AppError } from '../middleware/errorHandler';

export const getTrending = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { mediaType = 'all', timeWindow = 'week' } = req.params;
    const { page = '1' } = req.query;
    const data = await tmdbService.getTrending(mediaType, timeWindow, page as string);
    res.json(data);
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
    res.json(data);
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
    res.json(data);
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
    res.json(data);
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
    res.json(data);
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
    res.json(data);
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
    res.json(data);
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
    res.json(data);
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
    res.json(data);
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
    const { q, page = '1' } = req.query;
    if (!q) throw new AppError('Search query required', 400);
    const data = await tmdbService.searchMulti(q as string, page as string);
    res.json(data);
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
    res.json({ movie: movieGenres, tv: tvGenres });
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
    res.json(data);
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
    res.json(data);
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
    res.json(data);
  } catch (error) {
    next(error);
  }
};
