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

// In-memory publish-history ledger (fallback when PostgreSQL is unavailable)
const memoryContentHistory = [];

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
  '/images/luxury-album-craftsmanship.jpg',
  '/images/cinematic-video-suite.jpg',
  '/images/bride-polished.jpg',
  '/images/bride-raw.jpg',
  '/images/weddingalbums-home-hero.png',
  '/images/weddingalbums-talambralu.png',
  '/images/weddingalbums-layflat-album.png',
  '/images/mangalya-dharana.png',
  '/images/saptapadi.png',
  '/images/appagintalu-farewell.png',
  '/images/family-blessings.png',
  '/images/bridal.jpg',
  '/images/cinematic.jpg',
  '/images/prewedding.jpg',
  // Album mockup & brand SVG assets (generated)
  '/images/mockup-layflat-spread.svg',
  '/images/mockup-acrylic-cover.svg',
  '/images/mockup-leatherette-embossed.svg',
  '/images/mockup-pocket-mini-book.svg',
  '/images/client-album-preview.svg',
  '/images/media-notification-icon.svg'
];

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_wedding_key_2026';

function isStudioOrAdmin(req) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return false;
    const token = authHeader.split(' ')[1];
    if (!token) return false;
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded && (decoded.role === 'b2b' || decoded.role === 'admin' || decoded.role === 'sysadmin');
  } catch {
    return false;
  }
}

function sanitizeContentForClient(contentData, isB2B) {
  if (isB2B || !contentData) return contentData;
  const copy = JSON.parse(JSON.stringify(contentData));
  const sanitizeCatalog = (catalog) => {
    if (!catalog || typeof catalog !== 'object') return;
    if (Array.isArray(catalog.photoEditing)) {
      catalog.photoEditing.forEach(item => {
        delete item.studioPrice;
        delete item.studioPriceBadge;
        delete item.tradePrice;
      });
    }
    if (Array.isArray(catalog.videoEditing)) {
      catalog.videoEditing.forEach(item => {
        delete item.studioPrice;
        delete item.studioPriceBadge;
        delete item.tradePrice;
      });
    }
    if (catalog.albumPrinting) {
      if (Array.isArray(catalog.albumPrinting.sheetStyles)) {
        catalog.albumPrinting.sheetStyles.forEach(item => {
          delete item.studioPricePerSheet;
          delete item.studioPriceBadge;
        });
      }
      if (Array.isArray(catalog.albumPrinting.albumSizes)) {
        catalog.albumPrinting.albumSizes.forEach(item => {
          delete item.studioBasePrice;
          delete item.studioPriceBadge;
        });
      }
    }
    if (Array.isArray(catalog.invitationsAndFlex)) {
      catalog.invitationsAndFlex.forEach(item => {
        delete item.studioPrice;
        delete item.studioPriceBadge;
      });
    }
    if (Array.isArray(catalog.bundles)) {
      catalog.bundles.forEach(item => {
        delete item.studioPrice;
        delete item.studioPriceBadge;
      });
    }
  };

  if (copy.servicesCatalog) sanitizeCatalog(copy.servicesCatalog);
  if (copy.global?.servicesCatalog) sanitizeCatalog(copy.global.servicesCatalog);
  return copy;
}

/* ── Content API ────────────────────────────────────────────────────── */
router.get('/content', async (req, res) => {
  try {
    const isB2B = isStudioOrAdmin(req);
    const contentDoc = await Content.findOne({ key: 'main_site' });
    if (contentDoc && contentDoc.data && Object.keys(contentDoc.data).length > 0 && contentDoc.data.pages && Object.keys(contentDoc.data.pages).length > 0) {
      const data = { ...contentDoc.data };
      if ((!data.servicesCatalog || !data.global?.servicesCatalog) && fallbackContentData?.global?.servicesCatalog) {
        if (!data.global) data.global = {};
        if (!data.global.servicesCatalog) data.global.servicesCatalog = fallbackContentData.global.servicesCatalog;
        if (!data.servicesCatalog) data.servicesCatalog = fallbackContentData.servicesCatalog || fallbackContentData.global.servicesCatalog;
      }
      return res.json(sanitizeContentForClient(data, isB2B));
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
      return res.json(sanitizeContentForClient(fallback, isB2B));
    }

    res.json({ pages: {}, global: {} });
  } catch (err) {
    console.error('Content fetch error:', err);
    if (fallbackContentData) {
      return res.json(sanitizeContentForClient(fallbackContentData, isStudioOrAdmin(req)));
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
      memoryContentHistory.unshift({
        id: versionId,
        version: versionId.slice(0, 8),
        key: 'main_site',
        data: existing.data,
        savedAt: new Date().toISOString()
      });
      if (memoryContentHistory.length > 50) memoryContentHistory.length = 50;
      try {
        const { query } = await import('../db_postgres.js');
        if (query) {
          await query(
            `INSERT INTO content_history (id, key, data, "createdAt") VALUES ($1, $2, $3, NOW())`,
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
      // Never overwrite the bundled seed with an empty/stub document (must contain pages)
      if (newContent?.pages && Object.keys(newContent.pages).length > 0) {
        await fs.writeFile(fallbackFile, JSON.stringify(newContent, null, 2));
      }
    } catch {
      /* ignore read-only filesystems in production cloud */
    }

    return res.json({ success: true, message: 'Content published successfully' });
  } catch (err) {
    console.error('Failed to save content:', err);
    res.status(500).json({ error: 'Failed to save content: ' + err.message });
  }
});

/* ── Publish History (latest versions of main_site content) ─────────── */
router.get('/content/history', contentAdminOnly, async (req, res) => {
  try {
    const { query } = await import('../db_postgres.js');
    let versions = [];
    try {
      const hist = await query('SELECT id, key, data, "createdAt" FROM content_history ORDER BY "createdAt" DESC LIMIT 20');
      if (hist?.rows) {
        versions = hist.rows.map(r => {
          let data;
          try { data = typeof r.data === 'string' ? JSON.parse(r.data) : r.data; } catch { data = null; }
          return {
            id: r.id,
            version: (r.id || '').slice(0, 8),
            key: r.key,
            data,
            savedAt: r.createdAt || r.created_at,
            editor: r.editor
          };
        });
      }
    } catch (e) {
      console.warn('content history query notice:', e.message);
    }
    if (versions.length === 0 && memoryContentHistory.length > 0) {
      versions = memoryContentHistory.slice(0, 20);
    }
    return res.json({ versions });
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to load publish history' });
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
