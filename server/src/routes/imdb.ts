import { Router } from 'express';
import * as imdbController from '../controllers/imdbController';

const router = Router();

// Search OMDb by title
router.get('/search', imdbController.searchByTitle);

// Get IMDb data by TMDB movie ID (auto-resolves imdb_id)
router.get('/movie/:tmdbId', imdbController.getByTmdbMovieId);

// Get IMDb data by TMDB TV ID (auto-resolves imdb_id)
router.get('/tv/:tmdbId', imdbController.getByTmdbTVId);

// Get IMDb data by IMDb ID directly
router.get('/:imdbId', imdbController.getByImdbId);

export default router;
