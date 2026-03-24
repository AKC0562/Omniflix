import { createClient } from 'redis';
import logger from '../utils/logger';
import config from './index';

const redisClient = createClient({
  url: config.redis.url,
  socket: {
    reconnectStrategy: false,
  },
});

redisClient.on('error', (err: any) => {
  if (err.code === 'ECONNREFUSED') {
    logger.error(`[Redis] Connection refused at ${err.address}:${err.port}. Is Redis running?`);
  } else {
    logger.error('[Redis] Client Error', err);
  }
});
redisClient.on('connect', () => logger.info('[Redis]  Connected successfully'));
redisClient.on('ready', () => logger.info('[Redis]  Ready to cache requests'));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error: any) {
    if (error?.code !== 'ECONNREFUSED') {
      logger.error('[Redis] Failed to connect. APIs will proceed without cache.', error);
    } else {
      logger.error('[Redis] Failed to connect. APIs will proceed without cache.');
    }
  }
};

export default redisClient;
