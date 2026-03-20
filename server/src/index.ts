import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import config from './config';
import connectDB from './config/db';
import logger from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import tmdbRoutes from './routes/tmdb';
import imdbRoutes from './routes/imdb';
import adminRoutes from './routes/admin';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/imdb', imdbRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'OmniFlix API',
    version: '1.0.0',
  });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`
  ⚡ OmniFlix Server running
  🌍 Environment: ${config.nodeEnv}
  🚀 Port: ${config.port}
  📡 API: http://localhost:${config.port}/api
  `);
});

export default app;
