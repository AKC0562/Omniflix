import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import logger from '../utils/logger';

export const cacheMiddleware = (durationInSeconds = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only intercept GET requests and only if Redis is successfully connected
    if (req.method !== 'GET' || !redisClient.isOpen) {
      return next();
    }

    const key = `omniflix_cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        logger.http(`[Redis] ⚡ Cache HIT: ${key}`);
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Content-Type', 'application/json');
        return res.send(cachedData); // Raw send because it's already a JSON string of ApiResponse
      }

      logger.http(`[Redis] 🐌 Cache MISS: ${key}`);
      res.setHeader('X-Cache', 'MISS');

      // Intercept the final JSON response sent globally
      const originalJson = res.json.bind(res);
      
      (res as any).json = (body: any) => {
        // Only cache successful API responses
        if (body?.success === true) {
          redisClient.setEx(key, durationInSeconds, JSON.stringify(body))
            .catch(err => logger.error(`[Redis] Failed to save key: ${key}`, err));
        }
        
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('[Redis] Middleware Exception:', error);
      next();
    }
  };
};
