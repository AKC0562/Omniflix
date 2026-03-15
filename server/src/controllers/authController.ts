import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateTokenPair, verifyRefreshToken } from '../services/tokenService';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3).max(30),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      throw new AppError(
        existingUser.email === email
          ? 'Email already registered'
          : 'Username already taken',
        409
      );
    }

    const user = new User({
      email,
      username,
      password,
      profiles: [
        {
          name: username,
          avatar: 'heatblast',
          watchlist: [],
          preferences: { genres: [], language: 'en' },
        },
      ],
    });

    await user.save();

    const tokenPayload = {
      userId: user._id.toString(),
      profileId: user.profiles[0]._id?.toString(),
      role: user.role,
    };
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    // Store refresh token
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refreshToken },
    });

    res.status(201).json({
      message: 'Registration successful',
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const defaultProfile = user.profiles[0];
    const tokenPayload = {
      userId: user._id.toString(),
      profileId: defaultProfile?._id?.toString(),
      role: user.role,
    };
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refreshToken },
    });

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId).select('+refreshTokens');

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Rotate refresh token
    const tokenPayload = {
      userId: user._id.toString(),
      profileId: decoded.profileId,
      role: user.role,
    };
    const tokens = generateTokenPair(tokenPayload);

    // Remove old refresh token and add new one
    await User.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: refreshToken },
      $push: { refreshTokens: tokens.refreshToken },
    });

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken && req.user) {
      await User.findByIdAndUpdate(req.user.userId, {
        $pull: { refreshTokens: refreshToken },
      });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};
