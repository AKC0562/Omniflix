import rateLimit from 'express-rate-limit';
import config from '../config';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    message: 'Too many requests, please try again later.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    message: 'Too many authentication attempts, please try again later.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
