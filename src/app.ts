import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import userRoutes from './routes/user';
import currencyRoutes from './routes/currency';
import { notFound, errorHandler } from './middleware/errors';

export function buildApp() {
  const app = express();
  app.use(helmet());
  app.use(rateLimit({ windowMs: 60_000, max: 100 }));
  app.use(cors({
    origin: config.corsOrigin,               
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','ngrok-skip-browser-warning'],
    optionsSuccessStatus: 204
  }));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);
  app.use('/user', userRoutes);
  app.use('/currency', currencyRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
