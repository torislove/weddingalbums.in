/**
 * server/routes/public.js — Public, unprotected API
 */
import express from 'express';
import { Package, Service, ContactLead } from '../db.js';
import crypto from 'crypto';

const router = express.Router();

/* ── Packages & Services ────────────────────────────────────────────── */
router.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
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
