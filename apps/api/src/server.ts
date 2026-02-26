import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/error.middleware';
import { authRouter } from './routes/auth.routes';
import { clientRouter } from './routes/client.routes';
import { brandRouter } from './routes/brand.routes';
import { studyRouter } from './routes/study.routes';
import { waveRouter } from './routes/wave.routes';
import { metricRouter } from './routes/metric.routes';
import { reportRouter } from './routes/report.routes';
import { surveyRouter } from './routes/survey.routes';
import { userRouter } from './routes/user.routes';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests, please try again later.' } },
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/clients', clientRouter);
app.use('/api/brands', brandRouter);
app.use('/api/studies', studyRouter);
app.use('/api/waves', waveRouter);
app.use('/api/metrics', metricRouter);
app.use('/api/reports', reportRouter);
app.use('/api/surveys', surveyRouter);
app.use('/api/users', userRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Error handler
app.use(errorHandler);

// Start server
async function main() {
  try {
    await prisma.$connect();
    console.warn(`Database connected`);

    app.listen(PORT, () => {
      console.warn(`TrackPulse API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
