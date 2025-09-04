// src/app.ts
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

  // CORS configuration - flexible for development and deployment (Railway)
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Allow specific origins
    const envOrigins = (process.env.CORS_ORIGIN ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const allowedOrigins = [
      'http://localhost:4200',
      'https://client-bqkj.vercel.app',
      ...envOrigins,
    ];
    
    // Allow localhost for development
    const isLocalhost = origin && (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('https://localhost:')
    );
    
    if (origin && (allowedOrigins.includes(origin) || isLocalhost)) {
      res.header('Access-Control-Allow-Origin', origin);
      console.log(`CORS: Allowing origin: ${origin}`);
    } else if (origin) {
      console.log(`CORS: Blocking origin: ${origin}`);
    }
    
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log('CORS: Handling preflight request');
      return res.sendStatus(204);
    }
    
    return next();
  });

  app.use(helmet());
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);
  app.use('/user', userRoutes);
  app.use('/currency', currencyRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
