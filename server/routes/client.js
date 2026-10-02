/**
 * server/routes/client.js — Public/Client Portal API
 * Protected: requires role='b2c', audience='client-portal'
 */
import express from 'express';
import { requireRole } from '../middleware/auth.js';
import { Order, Project, User } from '../db.js';

const router = express.Router();
const clientOnly = requireRole('b2c', 'client-portal');

/* ── My Orders ──────────────────────────────────────────────────────── */
router.get('/orders', clientOnly, async (req, res) => {
  try {
    const orders = await Order.findAll({ user_id: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/:id', clientOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Proofs & Projects ──────────────────────────────────────────────── */
router.get('/projects', clientOnly, async (req, res) => {
  try {
    const projects = await Project.findAll({ client_id: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── User Profile & Wallet ──────────────────────────────────────────── */
router.get('/profile', clientOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Omit sensitive data
    const { password_hash, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', clientOnly, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'address', 'coupleNames']; // Add fields as needed
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    
    if (Object.keys(updates).length > 0) {
      await User.update(req.user.id, updates);
    }
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Referral ───────────────────────────────────────────────────────── */
router.get('/referral', clientOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Generate referral code if not set
    if (!user.referral_code) {
      const code = `CLIENT-${req.user.id.slice(0, 6).toUpperCase()}`;
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
