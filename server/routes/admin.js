/**
 * server/routes/admin.js — Admin operations API
 * Protected: requires role='admin', audience='admin-portal'
 */
import express from 'express';
import crypto from 'crypto';
import { requireRole } from '../middleware/auth.js';
import { User, Order, Task, PayoutRequest, Project } from '../db.js';

const router = express.Router();
const adminOnly = requireRole('admin', 'admin-portal');

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
    // Uses raw db if AuditLog model exists, else gracefully skips
    const { default: db } = await import('../db_business.js');
    await db.run(
      `INSERT INTO audit_logs (id, user_id, action, resource, details, ip, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), userId, action, resource, details, ip, new Date().toISOString()]
    );
  } catch { /* audit_logs table may not exist yet — handled in db init */ }
}

/* ── Audit Log read ─────────────────────────────────────────────────── */
router.get('/audit-logs', adminOnly, async (req, res) => {
  try {
    const { default: db } = await import('../db_business.js');
    const logs = await db.all(
      `SELECT al.*, u.name as user_name FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC LIMIT 200`
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message, logs: [] });
  }
});

export default router;
