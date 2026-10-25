import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import apiRouter from './routes/api.js';

const getAllowedOrigins = () => {
  const configuredOrigins = process.env.CLIENT_ORIGIN ?? process.env.FRONTEND_URL ?? '';
  return configuredOrigins.split(',').map((value) => {
    const origin = value.trim();
    if (!origin) return null;
    let parsed;
    try {
      parsed = new URL(origin);
    } catch {
      throw Object.assign(new Error('CLIENT_ORIGIN must contain valid HTTP or HTTPS origins.'), { statusCode: 500 });
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin || parsed.pathname !== '/' || parsed.search || parsed.hash) {
      throw Object.assign(new Error('CLIENT_ORIGIN must contain valid HTTP or HTTPS origins.'), { statusCode: 500 });
    }
    return parsed.origin;
  }).filter(Boolean);
};

export const createApp = () => {
  const allowedOrigins = getAllowedOrigins();
  const app = express();
  app.disable('x-powered-by');
  const trustedProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 1);
  if (!Number.isInteger(trustedProxyHops) || trustedProxyHops < 0) {
    throw new Error('TRUST_PROXY_HOPS must be a non-negative integer.');
  }
  app.set('trust proxy', trustedProxyHops);

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }));
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(Object.assign(new Error('Origin is not allowed.'), { statusCode: 403 }));
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

  const publicRequestLimit = Number(process.env.PUBLIC_API_RATE_LIMIT ?? 30);
  if (!Number.isInteger(publicRequestLimit) || publicRequestLimit < 1) {
    throw new Error('PUBLIC_API_RATE_LIMIT must be a positive integer.');
  }
  const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: publicRequestLimit,
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
    if (error?.statusCode === 403 || error?.message === 'Origin is not allowed.') {
      return response.status(403).json({ error: 'Request origin is not allowed.' });
    }
    if (error?.type === 'entity.parse.failed' || error?.name === 'SyntaxError' && error?.status === 400) {
      return response.status(400).json({ error: 'Request JSON is invalid.' });
    }
    console.error('API request failed:', error instanceof Error ? error.name : 'unknown error');
    return response.status(Number.isInteger(error?.statusCode) && error.statusCode >= 400 && error.statusCode < 500
      ? error.statusCode
      : 500).json({
      error: error?.statusCode === 503 && typeof error.message === 'string'
        ? error.message
        : 'The request could not be completed.',
    });
  });

  return app;
};
