import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI as string,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  tmdb: {
    apiKey: process.env.TMDB_API_KEY as string,
    baseUrl: process.env.TMDB_BASE_URL as string,
    imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL as string,
  },
  omdb: {
    apiKey: process.env.OMDB_API_KEY as string,
    baseUrl: process.env.OMDB_BASE_URL as string,
  },
  redis: {
    url: process.env.REDIS_URL as string,
  },
  clientUrl: process.env.CLIENT_URL as string,
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '5000', 10),
  },
} as const;

export default config;
