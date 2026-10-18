import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import b2bRouter from './routes/b2b.js';
import editorRouter from './routes/editor.js';
import clientRouter from './routes/client.js';
import contentRouter from './routes/content.js';
import publicRouter from './routes/public.js';

import { initDatabase } from './db.js';
import { eventBus } from './events.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET, JWT_ISSUER, isProduction, JWT_INSECURE } from './config.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || process.env.SERVER_PORT || 4000;

// =======================
// SECURITY & MIDDLEWARE
// =======================
/* Browser origins allowed to call the API with credentials.
 * Extra origins can be appended (comma-separated) via the CORS_ORIGINS env var —
 * see server/.env.example. Localhost on ANY port and the *.web.app / *.weddingalbums.in
 * families are always allowed; add real custom domains to CORS_ORIGINS. */
const DEFAULT_ORIGINS = [
  'https://weddingalbums.in',
  'https://weddingalbums-b4bcd.web.app',
  'https://weddingalbums-b4bcd.firebaseapp.com',
  'https://studio.weddingalbums.in',
  'https://creator.weddingalbums.in',
  'https://ops.weddingalbums.in',
  'https://cms.weddingalbums.in',
  // All six local dev portals (client 5173, b2b 5174, editor 5175, sysadmin 5176, uiadmin 5177, api 4000)
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:4000',
  'http://localhost:4001',
];
const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...DEFAULT_ORIGINS, ...envOrigins])];


app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.web.app') ||
      origin.endsWith('.firebaseapp.com') ||
      origin.endsWith('.weddingalbums.in') ||
      origin === 'https://weddingalbums.in' ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));
// Stash the raw request body for Razorpay webhook HMAC verification (needs the exact bytes)
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    if (req.get('x-razorpay-signature')) req.rawBody = buf;
  }
}));
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

// Rate limiting for auth
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join('/tmp', 'uploads')));

// =======================
// DATABASE INITIALIZATION & READINESS
// =======================
let dbReadyPromise = null;
const ensureDbReady = () => {
  if (!dbReadyPromise) {
    dbReadyPromise = initDatabase().catch(err => {
      console.warn('⚠️ DB init notice:', err?.message);
    });
  }
  return dbReadyPromise;
};

// Trigger DB init immediately on boot
ensureDbReady();

app.use(async (req, res, next) => {
  await ensureDbReady();
  next();
});

// =======================
// FAIL-CLOSED SECURITY GUARD
// =======================
/* If we are running in production with the public dev secret (or no secret), every
 * request would otherwise be a full auth bypass. Refuse to serve non-diagnostic
 * traffic until JWT_SECRET is configured. `/api/health` and `/health` stay open so
 * uptime monitors still see the service (and its error body) instead of a timeout. */
if (isProduction && JWT_INSECURE) {
  app.use((req, res, next) => {
    if (req.path === '/api/health' || req.path === '/health') return next();
    return res.status(503).json({
      error: 'Server misconfigured: JWT_SECRET is not set',
      code: 'JWT_SECRET_MISSING',
      detail: 'Set JWT_SECRET in server/.env.<projectId> (or the Functions env) and redeploy.',
    });
  });
}

// =======================
// SYSTEM HEALTH & DIAGNOSTICS
// =======================
app.get(['/api/health', '/health'], async (req, res) => {
  try {
    const isDbReady = Boolean(dbReadyPromise);
    res.json({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      service: 'weddingalbums-api',
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      database: {
        status: isDbReady ? 'connected' : 'initializing',
        engine: 'postgresql-hybrid'
      },
      realtime: eventBus.getClientStats()
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// =======================
// REAL-TIME SERVER-SENT EVENTS (SSE) STREAM
// =======================
const handleSseConnection = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

  const clientId = crypto.randomUUID();

  // Helper to establish SSE headers and register client
  const establishStream = (user) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    if (res.flushHeaders) res.flushHeaders();

    eventBus.addClient(clientId, res, user);

    req.on('close', () => {
      eventBus.removeClient(clientId);
    });
  };

  if (token) {
    jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER }, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired stream token' });
      }
      establishStream(decoded);
    });
  } else {
    // Unauthenticated public stream (e.g. client storefront listening for content updates)
    establishStream({ id: `public-${clientId.slice(0, 8)}`, role: 'public' });
  }
};

app.get('/api/events', handleSseConnection);
app.get('/api/events/stream', handleSseConnection);

// =======================
// MOUNT MODULAR ROUTES
// =======================
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/b2b', b2bRouter);
app.use('/api/editor', editorRouter);
app.use('/api/client', clientRouter);
/* NOTE: contentRouter is intentionally NOT mounted at /api/content — every one of
 * its paths already begins with /content (or /upload, /images), so the /api mount
 * below yields /api/content, /api/content/history, /api/upload, /api/images. The
 * old extra mount only produced dead aliases like /api/content/content (G7). */
app.use('/api/public', publicRouter);

// Fallback mount for legacy paths & builder routes (publicRouter is also reachable
// as /api/builder/* thanks to this mount; see public.js G7 note).
app.use('/api/builder', publicRouter);
app.use('/api', contentRouter);
app.use('/api', publicRouter);

// Root search engine crawl endpoints
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public/sitemap.xml'));
});
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public/robots.txt'));
});

import { onRequest } from 'firebase-functions/v2/https';

// Export as Firebase 2nd-gen Cloud Function for serverless deployment
export const api = onRequest({
  cors: true,
  memory: '512MiB',
  timeoutSeconds: 60,
  maxInstances: 10
}, app);

// Run local HTTP server only if executed standalone directly as the main entrypoint
const isRunningInFirebase = Boolean(
  process.env.FIREBASE_CONFIG ||
  process.env.FUNCTION_TARGET ||
  process.env.FUNCTIONS_EMULATOR ||
  process.env.K_SERVICE ||
  process.env.FUNCTION_NAME ||
  process.argv.some(arg => typeof arg === 'string' && (arg.includes('firebase') || arg.includes('functions-framework')))
);

const isDirectRun = !isRunningInFirebase && Boolean(
  process.argv[1] &&
  path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()
);

if (isDirectRun) {
  if (isProduction && JWT_INSECURE) {
    console.error('❌ Refusing to start: production environment without a configured JWT_SECRET.');
    process.exit(1);
  }
  const standalonePort = process.env.PORT || process.env.SERVER_PORT || 4000;
  app.listen(standalonePort, () => {
    console.log(`🚀 Standalone server running on http://localhost:${standalonePort}`);
  });
}
