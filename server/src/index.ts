import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import config from './config';
import connectDB from './config/db';
import { connectRedis } from './config/redis';
import logger from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter';
import errorHandler, { AppError } from './middleware/errorHandler';

// Global uncaught exception handler
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! ! Shutting down...');
  logger.error(`${err.name}: ${err.message}`, err.stack);
  process.exit(1);
});

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import tmdbRoutes from './routes/tmdb';
import imdbRoutes from './routes/imdb';
import adminRoutes from './routes/admin';

const app = express();

// Connect to Databases
connectDB();
connectRedis();

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
if (config.nodeEnv !== 'development') {
  app.use('/api', apiLimiter);
}

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

// Handle undefined routes (Global 404)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling payload formatter
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  logger.info(`
  -> OmniFlix Server running
  -> Environment: ${config.nodeEnv}
  -> Port: ${config.port}
  -> API: http://localhost:${config.port}/api
  `);
});

// Global unhandled promise rejection handler
process.on('unhandledRejection', (err: any) => {
  logger.error('UNHANDLED REJECTION! ! Shutting down gracefully...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
