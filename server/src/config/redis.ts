import { createClient } from 'redis';
import logger from '../utils/logger';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('[Redis] Client Error', err));
redisClient.on('connect', () => logger.info('[Redis] 🔗 Connected successfully'));
redisClient.on('ready', () => logger.info('[Redis] 🚀 Ready to cache requests'));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('[Redis] Failed to connect. APIs will proceed without cache.', error);
  }
};

export default redisClient;
