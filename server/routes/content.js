/**
 * server/routes/content.js — CMS & Media API
 * Unprotected reads, protected writes
 */
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { requireRole } from '../middleware/auth.js';
import { Content, Media } from '../db_content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const contentAdminOnly = requireRole('admin', 'admin-portal'); // UIAdmin sends admin-portal tokens in this setup

/* ── Content API ────────────────────────────────────────────────────── */
router.get('/content', async (req, res) => {
  try {
    const contentDoc = await Content.findOne({ key: 'main_site' });
    if (contentDoc && contentDoc.data && Object.keys(contentDoc.data).length > 0) {
      return res.json(contentDoc.data);
    }
    
    // Fallback to local file if DB is empty
    const localContentPath = path.join(__dirname, '../../client/public/content.json');
    const raw = await fs.readFile(localContentPath, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    try {
      const localContentPath = path.join(__dirname, '../../client/public/content.json');
      const raw = await fs.readFile(localContentPath, 'utf-8');
      res.json(JSON.parse(raw));
    } catch (fsErr) {
      res.status(500).json({ error: 'Failed to read content' });
    }
  }
});

router.post('/content', contentAdminOnly, async (req, res) => {
  try {
    // Phase 8.2 — Save History & Versioning
    const existing = await Content.findOne({ key: 'main_site' });
    if (existing) {
      // Save old version to history (limit to last 50 versions for example)
      // Save old version to history
      const versionId = crypto.randomUUID();
      try {
        const { default: db } = await import('../db_business.js');
        // We ensure the table exists or just create it if missing
        await db.run(`CREATE TABLE IF NOT EXISTS content_history (id TEXT PRIMARY KEY, key TEXT, data TEXT, created_at TEXT)`);
        await db.run(
          `INSERT INTO content_history (id, key, data, created_at) VALUES (?, ?, ?, ?)`,
          [versionId, 'main_site', JSON.stringify(existing.data), new Date().toISOString()]
        );
      } catch (err) {
        console.warn('Failed to save content version history:', err.message);
      }
    }

    await Content.findOneAndUpdate(
      { key: 'main_site' },
      { key: 'main_site', data: req.body }
    );
    return res.json({ success: true });
  } catch (err) {
    try {
      const localContentPath = path.join(__dirname, '../../client/public/content.json');
      await fs.writeFile(localContentPath, JSON.stringify(req.body, null, 2));
      res.json({ success: true, message: 'Saved to local file fallback' });
    } catch (fsErr) {
      res.status(500).json({ error: 'Failed to save content' });
    }
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
    const media = await Media.find({ type: 'image' }).sort({ createdAt: -1 });
    const images = media.map(m => m.url);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

export default router;
