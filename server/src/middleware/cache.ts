import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';
import logger from '../utils/logger';

// Initialize cache instance
export const cache = new NodeCache();

export const cacheMiddleware = (durationInSeconds = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only intercept GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `omniflix_cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = cache.get<string>(key);
      
      if (cachedData) {
        logger.http(`[Cache] ⚡ Cache HIT: ${key}`);
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Content-Type', 'application/json');
        return res.send(cachedData); // Raw send because it's already a JSON string of ApiResponse
      }

      logger.http(`[Cache] 🐌 Cache MISS: ${key}`);
      res.setHeader('X-Cache', 'MISS');

      // Intercept the final JSON response sent globally
      const originalJson = res.json.bind(res);
      
      (res as any).json = (body: any) => {
        // Only cache successful API responses
        if (body?.success === true) {
          try {
            cache.set(key, JSON.stringify(body), durationInSeconds);
          } catch (err) {
            logger.error(`[Cache] Failed to save key: ${key}`, err);
          }
        }
        
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('[Cache] Middleware Exception:', error);
      next();
    }
  };
};
