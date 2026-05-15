import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { compareRouter } from './routes/compare';
import { phonesRouter } from './routes/phones';
import { offersRouter } from './routes/offers';
import { alertsRouter } from './routes/alerts';
import { authRouter } from './routes/auth';
import { adminRouter } from './routes/admin';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exchangedeal')
  .then(() => logger.info('✅ MongoDB connected'))
  .catch(err => logger.error('MongoDB error:', err));

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on('error', err => logger.error('Redis error:', err.message));

app.use('/api/compare', compareRouter);
app.use('/api/phones', phonesRouter);
app.use('/api/offers', offersRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use(errorHandler);

app.listen(PORT, () => logger.info(`🚀 ExchangeDeal AI server running on port ${PORT}`));
export default app;
