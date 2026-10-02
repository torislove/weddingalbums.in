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
const PORT = process.env.PORT || 4000;

// =======================
// SECURITY & MIDDLEWARE
// =======================
const allowedOrigins = [
  'https://weddingalbums.in',
  'https://studio.weddingalbums.in',
  'https://creator.weddingalbums.in',
  'https://ops.weddingalbums.in',
  'https://cms.weddingalbums.in',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
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

// Fallback mount for legacy paths
app.use('/api', contentRouter);
app.use('/api', publicRouter);

// =======================
// START SERVER
// =======================
await initDatabase();

app.listen(PORT, () => {
  console.log(`Clean Server running on http://localhost:${PORT}`);
});
