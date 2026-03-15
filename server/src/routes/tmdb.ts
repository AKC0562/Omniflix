import { Router, Request, Response, NextFunction } from 'express';
import * as tmdbController from '../controllers/tmdbController';

const router = Router();

// Trending
router.get('/trending/:mediaType/:timeWindow', tmdbController.getTrending);
router.get('/trending', (req: Request, res: Response, next: NextFunction) => {
  req.params.mediaType = 'all';
  req.params.timeWindow = 'week';
  tmdbController.getTrending(req, res, next);
});

// Movies
router.get('/movies/popular', tmdbController.getPopularMovies);
router.get('/movies/top-rated', tmdbController.getTopRatedMovies);
router.get('/movies/now-playing', tmdbController.getNowPlayingMovies);
router.get('/movies/upcoming', tmdbController.getUpcomingMovies);
router.get('/movies/:id', tmdbController.getMovieDetails);

// TV Shows
router.get('/tv/popular', tmdbController.getPopularTV);
router.get('/tv/top-rated', tmdbController.getTopRatedTV);
router.get('/tv/:id', tmdbController.getTVDetails);

// Search
router.get('/search', tmdbController.searchMulti);

// Genres
router.get('/genres', tmdbController.getGenres);
router.get('/genres/:genreId/movies', tmdbController.getMoviesByGenre);

export default router;
