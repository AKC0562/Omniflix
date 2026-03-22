import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';

export const getProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) throw new AppError('User not found', 404);
    res.json({ profiles: user.profiles });
  } catch (error) {
    next(error);
  }
};

export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user!.userId);
    if (!user) throw new AppError('User not found', 404);

    if (user.profiles.length >= 5) {
      throw new AppError('Maximum 5 profiles allowed', 400);
    }

    const newProfile = {
      name,
      avatar: avatar || 'heatblast',
      watchlist: [],
      preferences: { genres: [], language: 'en' },
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user!.userId,
      { $push: { profiles: newProfile } },
      { new: true, runValidators: true }
    );

    res.status(201).json({ profiles: updatedUser!.profiles });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { profileId } = req.params;
    const { name, avatar } = req.body;

    // Use specific $set syntax to update the nested object in profiles array
    const updateQuery: any = {};
    if (name) updateQuery['profiles.$.name'] = name;
    if (avatar) updateQuery['profiles.$.avatar'] = avatar;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user!.userId, 'profiles._id': profileId },
      { $set: updateQuery },
      { new: true, runValidators: true }
    );

    if (!updatedUser) throw new AppError('User or Profile not found', 404);

    const profile = updatedUser.profiles.find((p: any) => p._id?.toString() === profileId);
    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user!.userId);
    if (!user) throw new AppError('User not found', 404);

    if (user.profiles.length <= 1) {
      throw new AppError('Cannot delete last profile', 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user!.userId,
      { $pull: { profiles: { _id: profileId } } },
      { new: true }
    );

    res.json({ profiles: updatedUser!.profiles });
  } catch (error) {
    next(error);
  }
};

// Watchlist management
export const addToWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { profileId } = req.params;
    const { movieId } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 
        _id: req.user!.userId, 
        'profiles._id': profileId,
      },
      { $addToSet: { 'profiles.$.watchlist': movieId } },
      { new: true }
    );

    if (!updatedUser) {
      throw new AppError('User or Profile not found', 404);
    }

    const profile = updatedUser.profiles.find((p: any) => p._id?.toString() === profileId);
    res.json({ watchlist: profile?.watchlist || [] });
  } catch (error) {
    next(error);
  }
};

export const removeFromWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { profileId, movieId } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user!.userId, 'profiles._id': profileId },
      { $pull: { 'profiles.$.watchlist': parseInt(movieId) } },
      { new: true }
    );

    if (!updatedUser) throw new AppError('User or Profile not found', 404);

    const profile = updatedUser.profiles.find((p: any) => p._id?.toString() === profileId);
    res.json({ watchlist: profile?.watchlist || [] });
  } catch (error) {
    next(error);
  }
};

export const getWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user!.userId);
    if (!user) throw new AppError('User not found', 404);

    const profile = user.profiles.find((p: any) => p._id?.toString() === profileId);
    if (!profile) throw new AppError('Profile not found', 404);

    res.json({ watchlist: profile.watchlist });
  } catch (error) {
    next(error);
  }
};
