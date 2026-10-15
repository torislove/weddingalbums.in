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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || process.env.SERVER_PORT || 4000;

// =======================
// SECURITY & MIDDLEWARE
// =======================
const allowedOrigins = [
  'https://weddingalbums.in',
  'https://weddingalbums-b4bcd.web.app',
  'https://weddingalbums-b4bcd.firebaseapp.com',
  'https://studio.weddingalbums.in',
  'https://creator.weddingalbums.in',
  'https://ops.weddingalbums.in',
  'https://cms.weddingalbums.in',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:4000',
  'http://localhost:4001',
];

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
app.use(express.json({ limit: '50mb' }));
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
// MOUNT MODULAR ROUTES
// =======================
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/b2b', b2bRouter);
app.use('/api/editor', editorRouter);
app.use('/api/client', clientRouter);
app.use('/api/content', contentRouter);
app.use('/api/public', publicRouter);

// Fallback mount for legacy paths & builder routes
app.use('/api/builder', publicRouter);
app.use('/api', contentRouter);
app.use('/api', publicRouter);

import { onRequest } from 'firebase-functions/v2/https';

// Export as Firebase 2nd-gen Cloud Function for serverless deployment
export const api = onRequest({
  cors: true,
  memory: '512MiB',
  timeoutSeconds: 60,
  maxInstances: 10
}, app);

// Run local HTTP server only if executed standalone directly
const isRunningInFirebase = Boolean(
  process.env.FIREBASE_CONFIG ||
  process.env.FUNCTION_TARGET ||
  process.env.FUNCTIONS_EMULATOR ||
  process.env.K_SERVICE ||
  process.env.FUNCTION_NAME ||
  process.argv.some(arg => typeof arg === 'string' && (arg.includes('firebase') || arg.includes('functions-framework')))
);

const isDirectRun = !isRunningInFirebase && process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  const standalonePort = process.env.SERVER_PORT || 4000;
  app.listen(standalonePort, () => {
    console.log(`🚀 Standalone server running on http://localhost:${standalonePort}`);
  });
}
