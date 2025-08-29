import express from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import userRoutes from './routes/user';
import currencyRoutes from './routes/currency';
import { notFound, errorHandler } from './middleware/errors';

function makeCors(): CorsOptions {
  const listRaw = Array.isArray(config.corsOrigin)
    ? config.corsOrigin
    : String(config.corsOrigin || '').split(',').map(s => s.trim());

  const allow = new Set(
    listRaw.map(s => s.replace(/\/$/, '').toLowerCase()).filter(Boolean)
  );

  return {
    origin(origin, cb) {
      if (!origin) return cb(null, false); // block non-browser or unknown origins
      const o = origin.replace(/\/$/, '').toLowerCase();
      cb(null, allow.has(o));
    },
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','ngrok-skip-browser-warning'],
    optionsSuccessStatus: 204
  };
}

export function buildApp() {
  const app = express();
  app.set('trust proxy', true);
  app.disable('x-powered-by');

  app.use(helmet());
  app.use(rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }));
  app.use(cors(makeCors()));
  app.use(express.json({ limit: '100kb' }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);
  app.use('/user', userRoutes);
  app.use('/currency', currencyRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
