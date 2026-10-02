/**
 * server/routes/b2b.js — B2B Studio Portal API
 * Protected: requires role='b2b', audience='b2b-portal'
 */
import express from 'express';
import crypto from 'crypto';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Task, Order, User, PayoutRequest, Package } from '../db.js';

const router = express.Router();
const b2bOnly = requireRole('b2b', 'b2b-portal');

/* ── Job Submission ─────────────────────────────────────────────────── */
router.post('/jobs', b2bOnly, async (req, res) => {
  try {
    const { title, type, description, packageId, driveLink, deadline, notes } = req.body;
    if (!title || !type || !driveLink) {
      return res.status(400).json({ error: 'title, type and driveLink are required' });
    }

    const task = await Task.create({
      id: crypto.randomUUID(),
      studio_id: req.user.id,
      title,
      type,           // 'photo' | 'video' | 'album'
      description: description || '',
      package_id: packageId || null,
      drive_link: driveLink,
      deadline: deadline || null,
      notes: notes || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/jobs', b2bOnly, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const tasks = await Task.findAll({ studio_id: req.user.id, status, type, page: +page, limit: +limit });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/jobs/:id', b2bOnly, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.studio_id !== req.user.id) return res.status(404).json({ error: 'Job not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Album Orders ─────────────────────────────────────────────────── */
router.get('/albums', b2bOnly, async (req, res) => {
  try {
    const orders = await Order.findAll({ user_id: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Invoices ────────────────────────────────────────────────────────── */
router.get('/invoices', b2bOnly, async (req, res) => {
  try {
    const tasks = await Task.findAll({ studio_id: req.user.id, status: 'approved' });
    // Return summarised invoice data per job
    const invoices = tasks.map(t => ({
      id: t.id,
      title: t.title,
      type: t.type,
      amount: t.payout_amount || 0,
      status: t.payout_status || 'pending',
      date: t.created_at,
    }));
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Wallet ──────────────────────────────────────────────────────────── */
router.get('/wallet', b2bOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ wallet_balance: user?.wallet_balance ?? 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/payout-request', b2bOnly, async (req, res) => {
  try {
    const { amount, upiId } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Valid amount required' });

    const user = await User.findById(req.user.id);
    if ((user?.wallet_balance ?? 0) < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    const payout = await PayoutRequest.create({
      id: crypto.randomUUID(),
      user_id: req.user.id,
      amount,
      upi_id: upiId || user?.upi_id || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    res.status(201).json({ success: true, payout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Analytics ───────────────────────────────────────────────────────── */
router.get('/analytics', b2bOnly, async (req, res) => {
  try {
    const [allTasks, pendingTasks, approvedTasks, user] = await Promise.all([
      Task.count({ studio_id: req.user.id }),
      Task.count({ studio_id: req.user.id, status: 'pending' }),
      Task.count({ studio_id: req.user.id, status: 'approved' }),
      User.findById(req.user.id),
    ]);
    res.json({
      totalJobs: allTasks,
      pendingJobs: pendingTasks,
      completedJobs: approvedTasks,
      walletBalance: user?.wallet_balance ?? 0,
      referralCode: user?.referral_code || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Referral ─────────────────────────────────────────────────────────── */
router.get('/referral', b2bOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Generate referral code if not set
    if (!user.referral_code) {
      const code = `STUDIO-${req.user.id.slice(0, 6).toUpperCase()}`;
      await User.update(req.user.id, { referral_code: code });
      user.referral_code = code;
    }
    res.json({
      referralCode: user.referral_code,
      referralCount: user.referral_count || 0,
      referralEarnings: user.referral_earnings || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
