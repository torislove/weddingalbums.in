/**
 * server/routes/admin.js — Admin operations API
 * Protected: requires role='admin', audience='admin-portal'
 */
import express from 'express';
import crypto from 'crypto';
import { requireRole } from '../middleware/auth.js';
import { User, Order, Task, PayoutRequest, Project, AuditLog, Package, Service, SheetType, AlbumSize } from '../db.js';

const router = express.Router();
const adminOnly = requireRole(['admin', 'sysadmin', 'content_admin'], ['admin-portal', 'sysadmin-portal', 'uiadmin-portal']);

/* ── Dashboard Stats ────────────────────────────────────────────────── */
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const [users, orders, tasks, payouts] = await Promise.all([
      User.count(),
      Order.count(),
      Task.count({ status: 'in_progress' }),
      PayoutRequest.count({ status: 'pending' }),
    ]);
    res.json({ totalUsers: users, totalOrders: orders, activeTasks: tasks, pendingJobs: payouts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── User Management ────────────────────────────────────────────────── */
router.get('/users', adminOnly, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const users = await User.findAll({ role, search, page: +page, limit: +limit });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id', adminOnly, async (req, res) => {
  try {
    await User.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', adminOnly, async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Order State Machine ─────────────────────────────────────────────
   States: DRAFT → CONFIRMED → IN_PRODUCTION → QC_REVIEW → DELIVERED → CLOSED
   Each transition triggers notification + audit log.
 ───────────────────────────────────────────────────────────────────── */
const ORDER_STATES = ['DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'QC_REVIEW', 'DELIVERED', 'CLOSED'];

router.get('/orders', adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const orders = await Order.findAll({ status, page: +page, limit: +limit });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders/:id/transition', adminOnly, async (req, res) => {
  try {
    const { newStatus } = req.body;
    if (!ORDER_STATES.includes(newStatus)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${ORDER_STATES.join(', ')}` });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const currentIdx = ORDER_STATES.indexOf(order.status || 'DRAFT');
    const newIdx     = ORDER_STATES.indexOf(newStatus);

    // Allow both forward and backward transitions for admins
    await Order.update(req.params.id, {
      status: newStatus,
      updated_at: new Date().toISOString(),
    });

    // Log the transition
    await writeAuditLog({
      userId: req.user.id,
      action: 'ORDER_STATUS_CHANGE',
      resource: `Order#${req.params.id}`,
      details: `${order.status} → ${newStatus}`,
      ip: req.ip,
    });

    res.json({ success: true, order: { id: req.params.id, status: newStatus } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/orders/:id', adminOnly, async (req, res) => {
  try {
    await Order.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Payout Approval Workflow ────────────────────────────────────────
   Editor requests payout → Admin approves → Razorpay transfer (mocked)
 ───────────────────────────────────────────────────────────────────── */
router.get('/payouts', adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const payouts = await PayoutRequest.findAll({ status });
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/payouts/:id/approve', adminOnly, async (req, res) => {
  try {
    const payout = await PayoutRequest.findById(req.params.id);
    if (!payout) return res.status(404).json({ error: 'Payout not found' });

    // Deduct from user wallet → update payout status
    await User.updateWalletBalance(payout.user_id, -Math.abs(payout.amount));
    await PayoutRequest.update(req.params.id, {
      status: 'approved',
      approved_by: req.user.id,
      approved_at: new Date().toISOString(),
      transaction_ref: `TXN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    });

    await writeAuditLog({
      userId: req.user.id,
      action: 'PAYOUT_APPROVED',
      resource: `Payout#${req.params.id}`,
      details: `₹${payout.amount} to user ${payout.user_id}`,
      ip: req.ip,
    });

    res.json({ success: true, message: 'Payout approved and queued for transfer' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/payouts/:id/reject', adminOnly, async (req, res) => {
  try {
    await PayoutRequest.update(req.params.id, {
      status: 'rejected',
      rejection_reason: req.body.reason || 'Rejected by admin',
      rejected_at: new Date().toISOString(),
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Job QC ─────────────────────────────────────────────────────────── */
router.get('/jobs/pending-qc', adminOnly, async (req, res) => {
  try {
    const tasks = await Task.findAll({ status: 'submitted' });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/jobs/:id/approve', adminOnly, async (req, res) => {
  try {
    await Task.update(req.params.id, { status: 'approved', qc_by: req.user.id });
    await writeAuditLog({ userId: req.user.id, action: 'JOB_QC_APPROVED', resource: `Task#${req.params.id}`, ip: req.ip });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/jobs/:id/reject', adminOnly, async (req, res) => {
  try {
    await Task.update(req.params.id, { status: 'rejected', qc_feedback: req.body.feedback });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Audit Log helper ────────────────────────────────────────────────── */
async function writeAuditLog({ userId, action, resource = '', details = '', ip = '' }) {
  try {
    await AuditLog.create({
      user_id: userId,
      action,
      resource,
      details,
      ip,
      timestamp: new Date().toISOString()
    });
  } catch { /* gracefully skip if table/store unavailable */ }
}

/* ── Audit Log read ─────────────────────────────────────────────────── */
router.get('/audit-logs', adminOnly, async (req, res) => {
  try {
    const logs = await AuditLog.find();
    res.json(logs || []);
  } catch (err) {
    res.status(500).json({ error: err.message, logs: [] });
  }
});

/* ── Jobs / Tasks Management ────────────────────────────────────────── */
router.get('/jobs', adminOnly, async (req, res) => {
  try {
    const tasks = await Task.findAll(req.query || {});
    res.json(tasks || []);
  } catch (err) {
    res.status(500).json({ error: err.message, jobs: [] });
  }
});

/* ── Packages Management ───────────────────────────────────────────── */
router.get('/packages', adminOnly, async (req, res) => {
  try {
    const packages = await Package.find(req.query || {});
    res.json(packages || []);
  } catch (err) {
    res.status(500).json({ error: err.message, packages: [] });
  }
});

router.post('/packages', adminOnly, async (req, res) => {
  try {
    const created = await Package.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/packages/:id', adminOnly, async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body);
    res.json(updated || { success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/packages/:id', adminOnly, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Services Management & Pricing Engine Endpoints ─────────────────── */
router.get(['/services', '/builder/services'], adminOnly, async (req, res) => {
  try {
    const services = await Service.find(req.query || {});
    res.json(services || []);
  } catch (err) {
    res.status(500).json({ error: err.message, services: [] });
  }
});

router.post(['/services', '/builder/services'], adminOnly, async (req, res) => {
  try {
    const created = await Service.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(['/services/:id', '/builder/services/:id'], adminOnly, async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body);
    res.json(updated || { success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete(['/services/:id', '/builder/services/:id'], adminOnly, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Sheet Types Management ─────────────────────────────────────────── */
router.get(['/sheets', '/builder/sheets'], adminOnly, async (req, res) => {
  try {
    const sheets = await SheetType.find(req.query || {});
    res.json(sheets || []);
  } catch (err) {
    res.status(500).json({ error: err.message, sheets: [] });
  }
});

router.post(['/sheets', '/builder/sheets'], adminOnly, async (req, res) => {
  try {
    const created = await SheetType.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(['/sheets/:id', '/builder/sheets/:id'], adminOnly, async (req, res) => {
  try {
    const updated = await SheetType.findByIdAndUpdate(req.params.id, req.body);
    res.json(updated || { success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete(['/sheets/:id', '/builder/sheets/:id'], adminOnly, async (req, res) => {
  try {
    await SheetType.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Album Sizes & Bundles Management ────────────────────────────────── */
router.get(['/album-sizes', '/builder/album-sizes'], adminOnly, async (req, res) => {
  try {
    const sizes = await AlbumSize.find(req.query || {});
    res.json(sizes || []);
  } catch (err) {
    res.status(500).json({ error: err.message, albumSizes: [] });
  }
});

router.post(['/album-sizes', '/builder/album-sizes'], adminOnly, async (req, res) => {
  try {
    const created = await AlbumSize.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(['/album-sizes/:id', '/builder/album-sizes/:id'], adminOnly, async (req, res) => {
  try {
    const updated = await AlbumSize.findByIdAndUpdate(req.params.id, req.body);
    res.json(updated || { success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete(['/album-sizes/:id', '/builder/album-sizes/:id'], adminOnly, async (req, res) => {
  try {
    await AlbumSize.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
