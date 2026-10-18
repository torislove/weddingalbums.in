/**
 * server/routes/public.js — Public, unprotected API
 */
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Package, Service, SheetType, AlbumSize, ContactLead, Order, Task, Cart, Project, Config } from '../db.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { requireRole } from '../middleware/auth.js';
import { JWT_SECRET, JWT_ISSUER } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

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

const decodeUser = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER });
  } catch {
    return null;
  }
};

/* Staff gate for workforce routes (task queue / projects): studios, editors, operators */
const requireStaff = requireRole(['b2b', 'editor', 'admin', 'sysadmin'], ['b2b-portal', 'editor-portal', 'client-portal']);

/* ── Packages & Services & Sheets & Album Sizes ─────────────────────── */
/* NOTE: no `/builder/*` aliases here — the router is mounted at both `/api/public`
 * and `/api/builder`, so `/api/builder/packages` already resolves. The old
 * in-router alias produced junk paths like /api/builder/builder/packages (G7). */
router.get('/packages', async (req, res) => {
  try {
    const isB2B = isStudioOrAdmin(req);
    const packages = await Package.find(req.query || {});
    const sanitized = (packages || []).map(p => {
      const item = p.toObject ? p.toObject() : { ...p };
      if (!isB2B) {
        delete item.studioPrice;
        delete item.b2bPrice;
        delete item.b2bDiscount;
        delete item.studioCost;
      }
      return item;
    });
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message, packages: [] });
  }
});

router.get('/services', async (req, res) => {
  try {
    const isB2B = isStudioOrAdmin(req);
    const services = await Service.find(req.query || {});
    const sanitized = (services || []).map(s => {
      const item = s.toObject ? s.toObject() : { ...s };
      if (!isB2B) {
        delete item.studioPrice;
        delete item.studioBasePrice;
        delete item.b2bPrice;
      }
      return item;
    });
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message, services: [] });
  }
});

router.get('/sheets', async (req, res) => {
  try {
    const isB2B = isStudioOrAdmin(req);
    const sheets = await SheetType.find(req.query || {});
    const sanitized = (sheets || []).map(sh => {
      const item = sh.toObject ? sh.toObject() : { ...sh };
      if (!isB2B) {
        delete item.studioPricePerSheet;
        delete item.studioBasePrice;
      }
      return item;
    });
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message, sheets: [] });
  }
});

router.get('/album-sizes', async (req, res) => {
  try {
    const isB2B = isStudioOrAdmin(req);
    const sizes = await AlbumSize.find(req.query || {});
    const sanitized = (sizes || []).map(sz => {
      const item = sz.toObject ? sz.toObject() : { ...sz };
      if (!isB2B) {
        delete item.studioBasePrice;
        delete item.studioCoverSurcharge;
      }
      return item;
    });
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message, albumSizes: [] });
  }
});

/* ── Unified E-Commerce Products & Catalog Endpoint ─────────────────── */
router.get('/products', async (req, res) => {
  try {
    const isB2B = isStudioOrAdmin(req);
    const { category, search, minPrice, maxPrice, sort, orientation } = req.query || {};

    const [services, sizes, sheets, packages] = await Promise.all([
      Service.find({}).catch(() => []),
      AlbumSize.find({}).catch(() => []),
      SheetType.find({}).catch(() => []),
      Package.find({}).catch(() => [])
    ]);

    let products = [];

    // 1. Album Formats
    (sizes || []).forEach(sz => {
      const item = sz.toObject ? sz.toObject() : { ...sz };
      if (item.isActive === false) return;
      const basePrice = item.clientBasePrice || ((item.clientPricePerSheet || 260) * 30);
      const studioPrice = item.studioBasePrice || ((item.studioPricePerSheet || 180) * 30);

      products.push({
        id: item.id || `album-${item._id}`,
        type: 'album',
        category: 'albums',
        name: item.name,
        telugu: item.telugu || '',
        dimensions: item.dimensions || '',
        orientation: item.orientation || 'landscape',
        clientPrice: basePrice,
        studioPrice: isB2B ? studioPrice : undefined,
        perSheetClient: item.clientPricePerSheet || 260,
        perSheetStudio: isB2B ? (item.studioPricePerSheet || 180) : undefined,
        turnaround: '3-5 Days',
        badge: item.popular ? 'Best Seller' : (item.badge || 'Archival Layflat'),
        popular: Boolean(item.popular),
        description: item.description || `${item.dimensions} Seamless 180° Layflat Album with HP Indigo Archival Binding.`,
        image: item.image || '/images/weddingalbums-layflat-album.png'
      });
    });

    // 2. Photo & Video & Flex Services
    (services || []).forEach(svc => {
      const item = svc.toObject ? svc.toObject() : { ...svc };
      if (item.isActive === false) return;
      const cat = String(item.category || '').toLowerCase();
      let normCat = 'editing';
      if (cat.includes('video') || cat.includes('film') || cat.includes('cinematic')) normCat = 'video';
      else if (cat.includes('flex') || cat.includes('banner') || cat.includes('invite')) normCat = 'flex';

      products.push({
        id: item.id || `service-${item._id}`,
        type: 'service',
        category: normCat,
        name: item.title || item.name,
        telugu: item.telugu || '',
        clientPrice: item.clientPrice || item.price || 45,
        studioPrice: isB2B ? (item.studioPrice || item.studioBasePrice) : undefined,
        unit: item.unit || 'unit',
        turnaround: item.turnaround || '24-48h SLA',
        badge: item.badge || (normCat === 'video' ? '4K UHD' : normCat === 'flex' ? 'Custom Sizing' : '24h SLA'),
        popular: Boolean(item.popular),
        description: item.desc || item.description || '',
        image: item.image || (normCat === 'video' ? '/images/cinematic-video-suite.jpg' : normCat === 'flex' ? '/images/opt/weddingalbums-home-herow1600.webp' : '/images/opt/weddingalbums-talambraluw800.webp')
      });
    });

    // Apply Filtering
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (orientation && orientation !== 'all') {
      products = products.filter(p => !p.orientation || p.orientation === orientation);
    }

    if (minPrice) {
      const min = Number(minPrice) || 0;
      products = products.filter(p => (p.clientPrice || 0) >= min);
    }

    if (maxPrice) {
      const max = Number(maxPrice) || Infinity;
      products = products.filter(p => (p.clientPrice || 0) <= max);
    }

    if (search && String(search).trim()) {
      const q = String(search).toLowerCase().trim();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.telugu && p.telugu.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.dimensions && p.dimensions.toLowerCase().includes(q))
      );
    }

    // Apply Sorting
    if (sort === 'price_asc') {
      products.sort((a, b) => (a.clientPrice || 0) - (b.clientPrice || 0));
    } else if (sort === 'price_desc') {
      products.sort((a, b) => (b.clientPrice || 0) - (a.clientPrice || 0));
    } else if (sort === 'fastest') {
      products.sort((a, b) => {
        const aT = String(a.turnaround || '');
        const bT = String(b.turnaround || '');
        const aRank = aT.includes('24') ? 1 : aT.includes('48') ? 2 : 3;
        const bRank = bT.includes('24') ? 1 : bT.includes('48') ? 2 : 3;
        return aRank - bRank;
      });
    } else if (sort === 'rating') {
      products.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    res.json({
      success: true,
      count: products.length,
      isB2B,
      products
    });
  } catch (err) {
    res.status(500).json({ error: err.message, products: [] });
  }
});

/* ── Muhurtham Auspicious Wedding Dates ─────────────────────────────── */
router.get('/muhurtham', async (req, res) => {
  try {
    const dates = [
      "2026-10-18", "2026-10-22", "2026-10-26", "2026-10-29",
      "2026-11-04", "2026-11-08", "2026-11-12", "2026-11-18", "2026-11-25", "2026-11-29",
      "2026-12-03", "2026-12-06", "2026-12-11", "2026-12-14",
      "2027-01-18", "2027-01-22", "2027-01-27",
      "2027-02-05", "2027-02-11", "2027-02-15", "2027-02-21",
      "2027-04-14", "2027-04-19", "2027-04-25", "2027-05-02", "2027-05-08"
    ];
    res.json({ success: true, count: dates.length, dates });
  } catch (err) {
    res.status(500).json({ error: err.message, dates: [] });
  }
});

/* ── Public Orders & Tasks (Retail & Form Submissions Queue) ────────── */
router.get('/orders', async (req, res) => {
  try {
    const user = decodeUser(req);
    let filter = { ...req.query };

    if (user) {
      if (user.role === 'admin' || user.role === 'sysadmin') {
        /* operators see the full book */
      } else if (user.role === 'b2b') {
        filter.studio_id = user.id;
      } else {
        // b2c / editor / content_admin: only orders tied to their own account
        const ownEmail = String(user.email || '').toLowerCase();
        if (!ownEmail) return res.status(403).json({ error: 'Order history unavailable for this account' });
        filter = { email: ownEmail, status: filter.status };
      }
    } else if (!req.query.email) {
      return res.status(401).json({ error: 'Authentication required. Sign in, or pass the booking email (?email=) to look up guest orders.' });
    }

    const orders = await Order.findAll ? await Order.findAll(filter) : await Order.find(filter);
    const sanitized = (orders || []).map(o => {
      const item = o.toObject ? o.toObject() : { ...o };
      if (!user || user.role === 'b2c' || user.role === 'editor') {
        // hide commercial/internal data from non-staff viewers
        delete item.studioCost;
        delete item.wholesaleTotal;
        delete item.internalNotes;
      }
      return item;
    });
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message, orders: [] });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const raw = req.body || {};
    const rawName = String(raw.name || raw.data?.userName || raw.clientName || '').trim();
    const email = String(raw.email || raw.data?.userEmail || '').trim();
    const phone = String(raw.phone || raw.data?.phone || '').trim();

    if (rawName.length < 2 || rawName.length > 120) {
      return res.status(400).json({ error: 'A valid customer name is required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!/^[0-9+\-\s()]{7,15}$/.test(phone)) {
      return res.status(400).json({ error: 'A valid phone number is required' });
    }
    if (raw.items != null && !Array.isArray(raw.items)) {
      return res.status(400).json({ error: 'Items must be a list' });
    }

    const safeNumber = (v) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 0 && n <= 100000000 ? n : 0;
    };

    const orderData = {
      id: raw.orderId || raw.id || `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name: rawName,
      email,
      phone,
      total: safeNumber(raw.total ?? raw.data?.total),
      status: raw.status || raw.data?.status || 'Confirmed',
      items: Array.isArray(raw.items) ? raw.items.slice(0, 200) : (Array.isArray(raw.data?.items) ? raw.data.items.slice(0, 200) : []),
      address: String(raw.address || raw.data?.address || '').slice(0, 500),
      instructions: String(raw.instructions || raw.data?.instructions || '').slice(0, 2000),
      cloudLink: raw.cloudLink || raw.raw_files_link || '',
      uploadPreference: raw.uploadPreference || 'cloud',
      data: raw.data || raw,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const created = await Order.create(orderData);
    res.status(201).json({ success: true, id: created.id || created._id, order: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const user = decodeUser(req);
    const isStaff = user && ['admin', 'sysadmin', 'b2b', 'editor'].includes(user.role);
    const isOwner = user && (
      String(order.email || '').toLowerCase() === String(user.email || '').toLowerCase() ||
      (user.id && order.userId && String(order.userId) === String(user.id))
    );
    if (isStaff || isOwner) return res.json(order);

    // Unauthenticated order tracking (order id acts as a capability link): strip personal data
    const { email, phone, address, instructions, userId, user_id, client_id, studio_id, data, ...publicOrder } = order;
    return res.json(publicOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send('<h2>Order not found</h2>');

    const total = order.total || order.data?.total || 0;
    const items = order.items || order.data?.items || [{ name: 'Handcrafted Wedding Album', quantity: 1, price: total }];
    const clientName = order.name || order.data?.userName || 'Customer';
    const clientEmail = order.email || order.data?.userEmail || '';
    const dateStr = new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    // Check if client expects JSON
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ order, invoiceNumber: `INV-${String(order.id).slice(0, 8).toUpperCase()}`, date: dateStr });
    }

    // High-end Printable HTML Invoice
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice #${order.id || order._id} — WeddingAlbums.in</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a0c; color: #e2e8f0; margin: 0; padding: 40px; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #121318; border: 1px solid rgba(212,175,55,0.25); border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 24px; margin-bottom: 30px; }
    .brand { font-size: 24px; font-weight: 800; letter-spacing: 1px; color: #D4AF37; }
    .invoice-title { font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 6px 0; text-align: right; }
    .meta { font-size: 13px; color: #94a3b8; text-align: right; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px; }
    .val { font-size: 15px; color: #fff; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { text-align: left; padding: 12px; font-size: 12px; color: #D4AF37; text-transform: uppercase; border-bottom: 1px solid rgba(212,175,55,0.2); }
    td { padding: 14px 12px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #cbd5e1; }
    .total-box { display: flex; justify-content: flex-end; margin-bottom: 30px; }
    .total-row { display: flex; justify-content: space-between; width: 280px; padding: 10px 0; font-size: 18px; font-weight: 700; color: #fff; border-top: 2px solid #D4AF37; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background: rgba(16,185,129,0.15); color: #34d399; font-size: 12px; font-weight: 700; border: 1px solid rgba(16,185,129,0.3); }
    .btn-print { background: #D4AF37; color: #000; font-weight: 700; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; }
    .btn-print:hover { background: #e5bd40; }
    @media print {
      body { background: #fff; color: #000; padding: 0; }
      .invoice-card { border: none; box-shadow: none; background: #fff; color: #000; }
      .val, .invoice-title, .total-row, th, td { color: #000 !important; }
      .brand { color: #b45309; }
      .btn-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand">WEDDINGALBUMS.IN</div>
        <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">Couture Handcrafted Wedding Photobooks & Post-Production</p>
      </div>
      <div>
        <h1 class="invoice-title">TAX INVOICE</h1>
        <div class="meta">Invoice: INV-${String(order.id).slice(0, 8).toUpperCase()}</div>
        <div class="meta">Date: ${dateStr}</div>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="label">Billed To</div>
        <div class="val">${clientName}</div>
        <div style="font-size: 13px; color: #94a3b8;">${clientEmail}</div>
        <div style="font-size: 13px; color: #94a3b8;">${order.phone || ''}</div>
        ${order.address ? `<div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">${order.address}</div>` : ''}
      </div>
      <div style="text-align: right;">
        <div class="label">Payment Status</div>
        <div><span class="badge">PAID IN FULL</span></div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">Order Ref: ${order.id}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(it => `
          <tr>
            <td><strong>${it.name || 'Custom Photobook'}</strong>${it.details ? `<br><small style="color:#94a3b8">${it.details}</small>` : ''}</td>
            <td style="text-align: center;">${it.quantity || 1}</td>
            <td style="text-align: right;">₹${((it.price || total)).toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total-box">
      <div class="total-row">
        <span>Grand Total:</span>
        <span style="color: #D4AF37;">₹${Number(total).toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
      <div style="font-size: 12px; color: #94a3b8;">
        Thank you for trusting WeddingAlbums.in with your eternal memories.
      </div>
      <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
    </div>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).send(`Error generating invoice: ${err.message}`);
  }
});

/* ── Tasks Endpoints (Queue & Dispatches) ────────────────────────────── */
router.get('/tasks', requireStaff, async (req, res) => {
  try {
    const filter = { ...req.query };
    const tasks = await Task.findAll ? await Task.findAll(filter) : await Task.find(filter);
    res.json(tasks || []);
  } catch (err) {
    res.status(500).json({ error: err.message, tasks: [] });
  }
});

router.patch('/tasks/:id', requireStaff, async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate ? await Task.findByIdAndUpdate(req.params.id, req.body) : await Task.update(req.params.id, req.body);
    res.json({ success: true, task: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/tasks/:id', requireStaff, async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate ? await Task.findByIdAndUpdate(req.params.id, req.body) : await Task.update(req.params.id, req.body);
    res.json({ success: true, task: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tasks', requireStaff, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Projects Endpoints ─────────────────────────────────────────────── */
router.get('/projects', requireStaff, async (req, res) => {
  try {
    const projects = await Project.findAll ? await Project.findAll(req.query || {}) : await Project.find(req.query || {});
    res.json(projects || []);
  } catch (err) {
    res.status(500).json({ error: err.message, projects: [] });
  }
});

router.post('/projects', requireStaff, async (req, res) => {
  try {
    const project = await Project.create ? await Project.create(req.body) : req.body;
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Cart API (Shopping Cart Persistence) ────────────────────────────── */
const getUserIdFromReq = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      if (decoded && (decoded.id || decoded._id)) return decoded.id || decoded._id;
    } catch {
      /* ignore invalid token */
    }
  }
  return req.body?.userId || req.query?.userId || 'guest_user';
};

router.get('/cart', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const cart = await Cart.findOne({ userId });
    res.json(cart || { items: [], totalAmount: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message, items: [], totalAmount: 0 });
  }
});

router.post('/cart', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { items = [], totalAmount = 0, estimatedDeliveryEta = null } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items, totalAmount, estimatedDeliveryEta }
    );
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/cart', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalAmount: 0 }
    );
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Payment API (Razorpay Order Generation & Verification) ─────────── */
let razorpayClient = null;

async function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
  if (!keyId || !keySecret) return null;
  if (!razorpayClient) {
    const mod = await import('razorpay');
    const Razorpay = mod.default || mod;
    razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return razorpayClient;
}

router.post('/pay/create-order', async (req, res) => {
  try {
    const amountPaise = Math.round(Number(req.body?.amount) * 100);
    if (!req.body?.amount || !Number.isFinite(amountPaise) || amountPaise <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const client = await getRazorpayClient();
    if (client) {
      const rzpOrder = await client.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: `receipt_${crypto.randomBytes(6).toString('hex')}`,
        notes: req.body?.orderId ? { orderId: String(req.body.orderId) } : undefined
      });
      return res.json({
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        status: rzpOrder.status,
        created_at: rzpOrder.created_at,
        live: true
      });
    }

    // Dev fallback when Razorpay keys are not configured — clearly flagged as mock
    const orderId = 'order_' + crypto.randomBytes(8).toString('hex');
    return res.json({
      id: orderId,
      amount: amountPaise,
      currency: 'INR',
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
      live: false
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment order creation failed: ' + err.message });
  }
});

router.post('/pay/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing payment confirmation parameters' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
    if (keySecret) {
      // Real Razorpay: verify HMAC-SHA256 signature of "order_id|payment_id"
      const expected = crypto.createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      const a = Buffer.from(expected);
      const b = Buffer.from(String(razorpay_signature || ''));
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(400).json({ success: false, error: 'Payment signature verification failed' });
      }
    } else {
      console.warn('pay/verify: RAZORPAY_KEY_SECRET not configured — running in dev/mock mode (signature not verified)');
    }

    if (orderId) {
      try {
        await Order.findByIdAndUpdate(orderId, {
          status: 'Confirmed',
          paymentStatus: 'paid',
          paymentDetails: { razorpay_order_id, razorpay_payment_id, verifiedAt: new Date().toISOString() }
        });
      } catch (e) {
        console.warn('Order payment status update notice:', e.message);
      }
    }

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      paymentId: razorpay_payment_id
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment verification failed: ' + err.message });
  }
});

/* ── Razorpay Webhook (server-to-server payment events) ─────────────── */
router.post('/pay/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.get('x-razorpay-signature');
    const rawBody = req.rawBody;
    if (!secret || !signature || !rawBody) {
      return res.status(400).json({ error: 'Webhook verification not configured' });
    }
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(String(signature));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const pay = event?.payload?.payment?.entity;
    if (pay && String(event?.event || '').startsWith('payment.')) {
      const linkedOrderId = pay.notes?.orderId || pay.notes?.order_id;
      const captured = event.event === 'payment.captured' || event.event === 'payment.authorized';
      const failed = event.event === 'payment.failed';
      if ((captured || failed) && linkedOrderId) {
        try {
          await Order.findByIdAndUpdate(linkedOrderId, {
            status: captured ? 'Confirmed' : 'Payment Failed',
            paymentStatus: captured ? 'paid' : 'failed',
            paymentDetails: { razorpay_order_id: pay.order_id, razorpay_payment_id: pay.id, webhook: true }
          });
        } catch (e) {
          console.warn('Webhook order update notice:', e.message);
        }
      }
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: 'Webhook processing failed: ' + err.message });
  }
});

/* ── Platform Configuration / Wholesale Catalog Configs ─────────────── */
router.get(['/configs', '/admin/configs'], async (req, res) => {
  try {
    const sheets = await SheetType.find ? await SheetType.find({}) : [];
    const options = (sheets.length > 0 ? sheets : [
      { id: 'luster', name: 'Karizma Royal Luster (Standard)', pricePerSheet: 65, studioPricePerSheet: 42, description: 'Deep rich colors, fingerprint resistant' },
      { id: 'gloss', name: 'Crystal Ultra High-Gloss', pricePerSheet: 85, studioPricePerSheet: 55, description: 'Glass-like high reflection vibrancy' },
      { id: 'velvet', name: 'Velvet Feather Touch (Scuff-Free)', pricePerSheet: 95, studioPricePerSheet: 62, description: 'Soft silk touch, zero glare' },
      { id: 'metallic', name: 'Metallic Pearl Luxury Shimmer', pricePerSheet: 110, studioPricePerSheet: 72, description: '3D iridescent glow for jewelry' },
      { id: 'nt', name: 'Non-Tearable Waterproof NT Sheet', pricePerSheet: 90, studioPricePerSheet: 58, description: 'Heavy composite tear-proof sheets' }
    ]).map(s => ({
      id: s.id || s._id,
      name: s.name,
      price: Number(s.pricePerSheet || s.price || 65),
      studioPrice: Number(s.studioPricePerSheet || 42),
      telugu: s.telugu || '',
      description: s.description || ''
    }));

    // Wholesale price is commercial data — only expose to studios/operators
    if (!isStudioOrAdmin(req)) {
      options.forEach(o => { delete o.studioPrice; });
    }

    res.json([
      { key: 'sheet_types', options }
    ]);
  } catch (err) {
    res.status(500).json({ error: err.message, configs: [] });
  }
});

/* ── Public Forms ───────────────────────────────────────────────────── */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, message } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const lead = await ContactLead.create({
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || '',
      event_type: eventType || '',
      event_date: eventDate || null,
      message: message || '',
      status: 'new',
      created_at: new Date().toISOString()
    });

    res.status(201).json({ success: true, message: 'Message received', id: lead.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Turnaround / ETA Calculation ────────────────────────────────────── */
router.post('/calculate-eta', async (req, res) => {
  try {
    const { serviceIds = [], speed = 'standard' } = req.body;
    let days = 3;
    if (Array.isArray(serviceIds) && serviceIds.length > 2) {
      days += 1;
    }
    if (speed === 'express') {
      days = Math.max(1, Math.round(days / 2));
    } else if (speed === 'sameday') {
      days = 1;
    }

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    res.json({
      success: true,
      estimatedDays: days,
      deliveryDate: targetDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    });
  } catch (err) {
    res.status(500).json({ error: err.message, estimatedDays: 3 });
  }
});

/* ── WhatsApp Lead Capture ───────────────────────────────────────────── */
router.post('/whatsapp-lead', async (req, res) => {
  try {
    const { phone = '', name = '', service = 'General Inquiry', note = '' } = req.body;
    if (phone || name) {
      await ContactLead.create({
        id: crypto.randomUUID(),
        name: name || 'WhatsApp Inquirer',
        email: '',
        phone,
        event_type: service,
        message: note || 'Lead initiated via WhatsApp CTA',
        status: 'whatsapp_lead',
        created_at: new Date().toISOString()
      });
    }
    res.json({ success: true, message: 'Lead captured' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Curated Portfolio & Testimonials Endpoints ──────────────────────── */
router.get('/portfolio', async (req, res) => {
  try {
    const items = [
      {
        id: 'port-1',
        title: 'Sita & Rama Krishna',
        category: 'wedding',
        location: 'Vijayawada',
        albumType: 'Karizma Flush Mount',
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=900',
        sheetCount: 40,
        tag: 'Pelli & Reception'
      },
      {
        id: 'port-2',
        title: 'Ananya & Karthik',
        category: 'wedding',
        location: 'Visakhapatnam',
        albumType: 'Velvet Royal Hardcover',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900',
        sheetCount: 50,
        tag: 'Beach Wedding'
      },
      {
        id: 'port-3',
        title: 'Meghana & Sai',
        category: 'engagement',
        location: 'Guntur',
        albumType: 'Artistic Matte Fine Art',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=900',
        sheetCount: 30,
        tag: 'Nischitartham'
      },
      {
        id: 'port-4',
        title: 'Grand Mandap Entrance Flex',
        category: 'flex',
        location: 'Tirupati',
        albumType: 'Large Format High-Res Banner',
        imageUrl: 'https://images.unsplash.com/photo-1544641979-51478546b3f7?auto=format&fit=crop&q=80&w=900',
        sheetCount: 1,
        tag: 'Flex & Hoarding'
      },
      {
        id: 'port-5',
        title: 'Harika Saree Ceremony',
        category: 'birthday',
        location: 'Rajahmundry',
        albumType: 'Glossy Vibrant Photobook',
        imageUrl: 'https://images.unsplash.com/photo-1583089892943-e02e5be26e10?auto=format&fit=crop&q=80&w=900',
        sheetCount: 25,
        tag: 'Half Saree'
      }
    ];
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ error: err.message, items: [] });
  }
});

router.get('/testimonials', async (req, res) => {
  try {
    const reviews = [
      {
        id: 'rev-1',
        name: 'Venkatesh & Supriya Rao',
        city: 'Vijayawada',
        rating: 5,
        service: 'Karizma Album & Cinematic Film',
        review: 'The album quality is pure royal gold. Our relatives from US were completely stunned by the crystal sheet quality and Telugu song score!',
        date: '2 weeks ago'
      },
      {
        id: 'rev-2',
        name: 'Suresh Kumar (SK Photo Studio)',
        city: 'Guntur',
        rating: 5,
        service: 'B2B Batch Editing & Printing',
        review: 'We have been ordering 30+ albums every muhurtham season. Fastest delivery in AP and color correction matches our Sony RAW exactly.',
        date: '1 month ago'
      },
      {
        id: 'rev-3',
        name: 'Divya & Praneeth',
        city: 'Visakhapatnam',
        rating: 5,
        service: 'Flush Mount Album & Instagram Reels',
        review: 'Same-day reels were delivered before our reception even started! Truly world-class post production service.',
        date: '3 weeks ago'
      }
    ];
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message, reviews: [] });
  }
});

// ==============================================================================
// INSTANT SEO & SEARCH ENGINE INDEXING SUITE
// ==============================================================================

/**
 * GET /sitemap.xml
 * Dynamically serves the high-performance XML sitemap with image namespaces
 */
router.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemapPath = path.resolve(__dirname, '../../client/public/sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.sendFile(sitemapPath);
    }
    res.status(404).send('Sitemap not found');
  } catch (err) {
    res.status(500).send('Error loading sitemap');
  }
});

/**
 * GET /robots.txt
 * Serves canonical robots.txt with crawl directives
 */
router.get('/robots.txt', async (req, res) => {
  try {
    const robotsPath = path.resolve(__dirname, '../../client/public/robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(robotsPath);
    }
    res.status(404).send('Robots.txt not found');
  } catch (err) {
    res.status(500).send('Error loading robots.txt');
  }
});

/**
 * POST /api/seo/ping-indexnow
 * Instant Search Engine Indexing via the IndexNow protocol (Bing, Yandex, Seznam)
 * Forces immediate search engine crawlers to index newly created or updated URLs.
 */
router.post('/seo/ping-indexnow', async (req, res) => {
  try {
    const defaultUrls = [
      'https://weddingalbums.in/',
      'https://weddingalbums.in/shop',
      'https://weddingalbums.in/albums',
      'https://weddingalbums.in/pricing',
      'https://weddingalbums.in/b2b',
      'https://weddingalbums.in/services',
      'https://weddingalbums.in/portfolio',
      'https://weddingalbums.in/muhurtham',
      'https://weddingalbums.in/contact'
    ];

    const urlList = Array.isArray(req.body?.urls) && req.body.urls.length > 0
      ? req.body.urls
      : defaultUrls;

    const payload = {
      host: 'weddingalbums.in',
      key: 'e5d078a9c8b7463da295e87a29e41b9c',
      keyLocation: 'https://weddingalbums.in/e5d078a9c8b7463da295e87a29e41b9c.txt',
      urlList: urlList
    };

    // Ping IndexNow Endpoint
    let indexNowResult = { status: 'mock_local', note: 'IndexNow payload prepared' };
    try {
      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
      });
      indexNowResult = {
        httpStatus: response.status,
        statusText: response.statusText,
        submittedUrls: urlList.length
      };
    } catch (networkErr) {
      indexNowResult = {
        error: networkErr.message,
        payload
      };
    }

    res.json({
      success: true,
      protocol: 'IndexNow v1.0',
      timestamp: new Date().toISOString(),
      indexNowResult,
      urls: urlList
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

