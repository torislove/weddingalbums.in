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

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const contentAdminOnly = requireRole(['admin', 'content_admin', 'sysadmin'], ['admin-portal', 'uiadmin-portal', 'sysadmin-portal']);

// Bundled in-memory fallback template
let fallbackContentData = null;
try {
  fallbackContentData = require('../content_fallback.json');
} catch (e) {
  console.warn('Could not load ../content_fallback.json via require:', e.message);
}

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

/* ── Local File Storage ─────────────────────────────────────────────── */
const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

/* ── Upload API ─────────────────────────────────────────────────────── */
router.post('/upload', contentAdminOnly, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const API_URL = process.env.VITE_API_URL || 'http://localhost:4000';
  const imageUrl = `${API_URL}/uploads/${req.file.filename}`;
  
  await Media.create({ url: imageUrl, type: 'image' });
  res.json({ url: imageUrl });
});

router.get('/images', contentAdminOnly, async (req, res) => {
  try {
    const media = await Media.find({ type: 'image' });
    const images = Array.isArray(media) ? media.map(m => m.url) : [];
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

export default router;
