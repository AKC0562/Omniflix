import { Router } from 'express';
import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getProfiles);
router.post('/', createProfile);
router.put('/:profileId', updateProfile);
router.delete('/:profileId', deleteProfile);

// Watchlist
router.get('/:profileId/watchlist', getWatchlist);
router.post('/:profileId/watchlist', addToWatchlist);
router.delete('/:profileId/watchlist/:movieId', removeFromWatchlist);

export default router;
