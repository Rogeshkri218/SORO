import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import apiRouter from './routes/api.js';

const getAllowedOrigins = () => (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => new URL(origin).origin);

export const createApp = () => {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS || 1));

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }));
  app.use(cors({
    origin(origin, callback) {
      const allowedOrigins = getAllowedOrigins();
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-Submission-Token', 'Idempotency-Key'],
  }));
  app.use(express.json({
    limit: process.env.JSON_BODY_LIMIT || '64kb',
    type: 'application/json',
  }));
  app.use(cookieParser());

  const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.PUBLIC_API_RATE_LIMIT || 30),
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  });
  app.use('/api/submissions', publicLimiter);
  app.use('/api/orders', publicLimiter);
  app.use('/api', apiRouter);

  app.use((request, response) => response.status(404).json({ error: 'API endpoint was not found.' }));
  app.use((error, request, response, next) => {
    if (response.headersSent) return next(error);
    if (error?.type === 'entity.too.large') return response.status(413).json({ error: 'Request is too large.' });
    if (error?.message === 'Origin is not allowed.') return response.status(403).json({ error: 'Request origin is not allowed.' });
    if (error?.name === 'SyntaxError' && error?.status === 400) return response.status(400).json({ error: 'Request JSON is invalid.' });
    return response.status(500).json({ error: 'The request could not be completed.' });
  });

  return app;
};
