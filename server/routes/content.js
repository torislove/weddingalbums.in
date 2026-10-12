/**
 * server/routes/content.js — CMS & Media API
 * Unprotected reads, protected writes
 * Resilient multi-tier architecture: PostgreSQL -> Server JSON -> Auto-seed
 */
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import crypto from 'crypto';
import { requireRole } from '../middleware/auth.js';
import { Content, Media } from '../db_content.js';
import { adminStorage } from '../firebaseAdmin.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const contentAdminOnly = requireRole(['admin', 'content_admin', 'sysadmin'], ['admin-portal', 'uiadmin-portal', 'sysadmin-portal']);

const isCloudEnv = Boolean(
  process.env.FUNCTION_TARGET ||
  process.env.FIREBASE_CONFIG ||
  process.env.FUNCTIONS_EMULATOR ||
  process.env.K_SERVICE ||
  process.env.FUNCTION_NAME
);

// Bundled in-memory fallback template
let fallbackContentData = null;
try {
  fallbackContentData = require('../content_fallback.json');
} catch (e) {
  console.warn('Could not load ../content_fallback.json via require:', e.message);
}

// Curated stock and catalog images extracted from fallback catalog
const CURATED_DEFAULT_IMAGES = [
  '/images/weddingalbums-home-hero.png',
  '/images/weddingalbums-talambralu.png',
  '/images/weddingalbums-layflat-album.png',
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583089892943-e02e5be26e10?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1544641979-51478546b3f7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1583391733958-d25e07fac662?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1530103862676-de8892b125f4?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1555529733-0e67056058e1?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1522715204671-e4aac94a7b7d?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1529024502020-3792eb5a54b1?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900'
];

/* ── Content API ────────────────────────────────────────────────────── */
router.get('/content', async (req, res) => {
  try {
    const contentDoc = await Content.findOne({ key: 'main_site' });
    if (contentDoc && contentDoc.data && Object.keys(contentDoc.data).length > 0 && contentDoc.data.pages && Object.keys(contentDoc.data.pages).length > 0) {
      return res.json(contentDoc.data);
    }
    
    // Fallback: If DB is empty or lacks pages, load from bundled fallback
    let fallback = fallbackContentData;
    if (!fallback) {
      const pathsToTry = [
        path.join(__dirname, '../content_fallback.json'),
        path.join(process.cwd(), 'content_fallback.json'),
        path.join(__dirname, 'content_fallback.json'),
        path.join(__dirname, '../../client/public/content.json')
      ];
      for (const p of pathsToTry) {
        try {
          const raw = await fs.readFile(p, 'utf-8');
          fallback = JSON.parse(raw);
          if (fallback && fallback.pages) break;
        } catch { /* try next */ }
      }
    }

    if (fallback && fallback.pages && Object.keys(fallback.pages).length > 0) {
      // Auto-seed into DB asynchronously so future queries read directly from DB
      Content.findOneAndUpdate({ key: 'main_site' }, { data: fallback }).catch(() => {});
      return res.json(fallback);
    }

    res.json({ pages: {}, global: {} });
  } catch (err) {
    console.error('Content fetch error:', err);
    if (fallbackContentData) {
      return res.json(fallbackContentData);
    }
    res.json({ pages: {}, global: {} });
  }
});

router.post('/content', contentAdminOnly, async (req, res) => {
  try {
    const newContent = req.body;
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ error: 'Invalid content body' });
    }

    // Save previous version to history if present
    const existing = await Content.findOne({ key: 'main_site' });
    if (existing && existing.data) {
      const versionId = crypto.randomUUID();
      try {
        const { query } = await import('../db_postgres.js');
        if (query) {
          await query(
            `INSERT INTO content_history (id, key, data, created_at) VALUES ($1, $2, $3, NOW())`,
            [versionId, 'main_site', JSON.stringify(existing.data)]
          );
        }
      } catch {
        /* optional history fallback */
      }
    }

    // Upsert into PostgreSQL / memory
    await Content.findOneAndUpdate(
      { key: 'main_site' },
      { key: 'main_site', data: newContent }
    );

    // Keep fallback cache synchronized
    fallbackContentData = newContent;

    // Persist to local fallback file if filesystem is writable
    try {
      const fallbackFile = path.join(__dirname, '../content_fallback.json');
      await fs.writeFile(fallbackFile, JSON.stringify(newContent, null, 2));
    } catch {
      /* ignore read-only filesystems in production cloud */
    }

    return res.json({ success: true, message: 'Content published successfully' });
  } catch (err) {
    console.error('Failed to save content:', err);
    res.status(500).json({ error: 'Failed to save content: ' + err.message });
  }
});

/* ── Cloud-Safe Memory Storage Multer ───────────────────────────────── */
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

/* ── Upload API ─────────────────────────────────────────────────────── */
router.post('/upload', contentAdminOnly, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(req.file.originalname) || '.jpg';
  const filename = (req.file.fieldname || 'img') + '-' + uniqueSuffix + ext;
  let imageUrl = '';

  // 1. Try uploading to Firebase Cloud Storage (preferred in production)
  try {
    if (adminStorage) {
      const bucket = adminStorage.bucket();
      const storageFilePath = `uploads/${filename}`;
      const fileRef = bucket.file(storageFilePath);

      await fileRef.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype || 'image/jpeg',
          cacheControl: 'public, max-age=31536000'
        }
      });

      try {
        await fileRef.makePublic();
      } catch {
        // if uniform bucket-level access is enabled, use standard storage URL
      }

      imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storageFilePath)}?alt=media`;
    }
  } catch (storageErr) {
    console.warn('Firebase Cloud Storage upload notice:', storageErr.message);
  }

  // 2. Fallback to local or /tmp disk storage
  if (!imageUrl) {
    try {
      const uploadsDir = isCloudEnv ? path.join('/tmp', 'uploads') : path.join(__dirname, '../uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.writeFile(path.join(uploadsDir, filename), req.file.buffer);
      const API_URL = process.env.VITE_API_URL || '';
      imageUrl = `${API_URL}/uploads/${filename}`;
    } catch (diskErr) {
      // 3. Fallback: Base64 data URI for small images if disk is completely unavailable
      const base64Data = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype || 'image/jpeg'};base64,${base64Data}`;
    }
  }

  // Persist into database Media table
  try {
    await Media.create({ url: imageUrl, type: 'image' });
  } catch (dbErr) {
    console.warn('Media record creation notice:', dbErr.message);
  }

  res.json({ url: imageUrl, success: true });
});

/* ── Media Images List API (Public read access so library never 401s) ─ */
router.get('/images', async (req, res) => {
  try {
    const dbMedia = await Media.find({ type: 'image' });
    const dbImages = Array.isArray(dbMedia) ? dbMedia.map(m => m.url).filter(Boolean) : [];
    
    // Merge DB uploaded images first, followed by curated catalog images (deduplicated)
    const combined = Array.from(new Set([...dbImages, ...CURATED_DEFAULT_IMAGES]));
    res.json(combined);
  } catch (err) {
    console.error('Failed to fetch images:', err);
    res.json(CURATED_DEFAULT_IMAGES);
  }
});

/* ── Add External Image URL to Media Library ────────────────────────── */
router.post('/images/add-url', contentAdminOnly, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Valid URL is required' });
    }
    const cleanUrl = url.trim();
    const created = await Media.create({ url: cleanUrl, type: 'image' });
    res.json({ success: true, item: created, url: cleanUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add image: ' + err.message });
  }
});

export default router;
