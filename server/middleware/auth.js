import { randomBytes, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

export const ADMIN_COOKIE_NAME = 'soro_admin_session';
const CSRF_COOKIE_NAME = 'soro_admin_csrf';

const secret = () => {
  if (
    !process.env.JWT_SECRET
    || process.env.JWT_SECRET.length < 32
    || /^(replace|your_|example)/i.test(process.env.JWT_SECRET)
  ) {
    throw Object.assign(new Error('Admin authentication is not configured.'), { statusCode: 503 });
  }
  return process.env.JWT_SECRET;
};

export const authenticateAdmin = async (request, response, next) => {
  const token = request.cookies?.[ADMIN_COOKIE_NAME];
  if (!token) return response.status(401).json({ error: 'Administrator authentication is required.' });
  let claims;
  try {
    claims = jwt.verify(token, secret(), {
      issuer: 'soro-api',
      audience: 'soro-admin',
    });
  } catch (error) {
    if (error?.statusCode === 503) {
      return response.status(503).json({ error: error.message });
    }
    if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError' || error?.name === 'NotBeforeError') {
      return response.status(401).json({ error: 'Administrator authentication is required.' });
    }
    return next(error);
  }
  if (typeof claims !== 'object' || typeof claims.sub !== 'string' || typeof claims.csrf !== 'string') {
    return response.status(401).json({ error: 'Administrator authentication is required.' });
  }
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const suppliedCsrf = request.get('x-csrf-token') || '';
    const claimBuffer = Buffer.from(claims.csrf);
    const suppliedBuffer = Buffer.from(suppliedCsrf);
    if (claimBuffer.length !== suppliedBuffer.length || !timingSafeEqual(claimBuffer, suppliedBuffer)) {
      return response.status(403).json({ error: 'Request verification failed.' });
    }
  }
  try {
    const admin = await AdminUser.findOne({ _id: claims.sub, active: true, role: 'admin' })
      .select('_id email role active');
    if (!admin) return response.status(401).json({ error: 'Administrator authentication is required.' });
    request.admin = admin;
    request.csrfToken = claims.csrf;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const createAdminSession = (admin, response) => {
  const csrfToken = randomBytes(24).toString('hex');
  const token = jwt.sign({ csrf: csrfToken }, secret(), {
    subject: admin.id,
    expiresIn: '8h',
    issuer: 'soro-api',
    audience: 'soro-admin',
  });
  const secure = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/api/admin',
    maxAge: 8 * 60 * 60 * 1000,
  };
  response.cookie(ADMIN_COOKIE_NAME, token, cookieOptions);
  response.cookie(CSRF_COOKIE_NAME, csrfToken, { ...cookieOptions, httpOnly: false });
  return csrfToken;
};

export const clearAdminSession = (response) => {
  const secure = process.env.NODE_ENV === 'production';
  const options = { path: '/api/admin', secure, sameSite: secure ? 'none' : 'lax' };
  response.clearCookie(ADMIN_COOKIE_NAME, { ...options, httpOnly: true });
  response.clearCookie(CSRF_COOKIE_NAME, options);
};
