import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ITokenPayload } from '../types';
import { AppError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    const decoded = jwt.verify(
      token,
      config.jwt.accessSecret
    ) as ITokenPayload;

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Access token expired', 401));
    } else {
      next(new AppError('Invalid access token', 401));
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError('Insufficient permissions', 403));
      return;
    }
    next();
  };
};
