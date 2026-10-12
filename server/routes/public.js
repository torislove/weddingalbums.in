/**
 * server/routes/public.js — Public, unprotected API
 */
import express from 'express';
import { Package, Service, SheetType, ContactLead, Order, Task } from '../db.js';
import crypto from 'crypto';

const router = express.Router();

/* ── Packages & Services & Sheets ──────────────────────────────────── */
router.get(['/packages', '/builder/packages'], async (req, res) => {
  try {
    const packages = await Package.find(req.query || {});
    res.json(packages || []);
  } catch (err) {
    res.status(500).json({ error: err.message, packages: [] });
  }
});

router.get(['/services', '/builder/services'], async (req, res) => {
  try {
    const services = await Service.find(req.query || {});
    res.json(services || []);
  } catch (err) {
    res.status(500).json({ error: err.message, services: [] });
  }
});

router.get(['/sheets', '/builder/sheets'], async (req, res) => {
  try {
    const sheets = await SheetType.find(req.query || {});
    res.json(sheets || []);
  } catch (err) {
    res.status(500).json({ error: err.message, sheets: [] });
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
    const orders = await Order.findAll ? await Order.findAll(req.query || {}) : await Order.find(req.query || {});
    res.json(orders || []);
  } catch (err) {
    res.status(500).json({ error: err.message, orders: [] });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const raw = req.body;
    const orderData = {
      id: raw.orderId || raw.id || `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name: raw.name || raw.data?.userName || raw.clientName || 'Valued Couple',
      email: raw.email || raw.data?.userEmail || '',
      phone: raw.phone || raw.data?.phone || '',
      total: raw.total || raw.data?.total || 0,
      status: raw.status || raw.data?.status || 'Confirmed',
      items: raw.items || raw.data?.items || [],
      address: raw.address || raw.data?.address || '',
      instructions: raw.instructions || raw.data?.instructions || '',
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
    res.json(order);
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
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll ? await Task.findAll(req.query || {}) : await Task.find(req.query || {});
    res.json(tasks || []);
  } catch (err) {
    res.status(500).json({ error: err.message, tasks: [] });
  }
});

router.patch('/tasks/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate ? await Task.findByIdAndUpdate(req.params.id, req.body) : await Task.update(req.params.id, req.body);
    res.json({ success: true, task: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/tasks/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate ? await Task.findByIdAndUpdate(req.params.id, req.body) : await Task.update(req.params.id, req.body);
    res.json({ success: true, task: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

export default router;
