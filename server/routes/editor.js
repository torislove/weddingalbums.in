/**
 * server/routes/editor.js — Creator/Editor Portal API
 * Protected: requires role='editor', audience='editor-portal'
 */
import express from 'express';
import { requireRole } from '../middleware/auth.js';
import { Task, User } from '../db.js';

const router = express.Router();
const editorOnly = requireRole('editor', 'editor-portal');

/* ── Available Tasks ────────────────────────────────────────────────── */
router.get('/available-jobs', editorOnly, async (req, res) => {
  try {
    const { type } = req.query; // 'photo' | 'video' | 'album'
    // Editors can only see unassigned, pending tasks
    const query = { status: 'pending', assigned_editor_id: null };
    if (type) query.type = type;
    
    const tasks = await Task.findAll(query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Claim Task ─────────────────────────────────────────────────────── */
router.post('/claim-job/:id', editorOnly, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Job not found' });
    if (task.status !== 'pending' || task.assigned_editor_id) {
      return res.status(400).json({ error: 'Job is no longer available' });
    }

    await Task.update(req.params.id, {
      assigned_editor_id: req.user.id,
      status: 'in_progress',
      updated_at: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Job claimed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── My Tasks ───────────────────────────────────────────────────────── */
router.get('/my-jobs', editorOnly, async (req, res) => {
  try {
    const tasks = await Task.findAll({ assigned_editor_id: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Submit Work ────────────────────────────────────────────────────── */
router.post('/submit-job/:id', editorOnly, async (req, res) => {
  try {
    const { workLink, notes } = req.body;
    if (!workLink) return res.status(400).json({ error: 'Work link is required' });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Job not found' });
    if (task.assigned_editor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized for this job' });
    }

    await Task.update(req.params.id, {
      status: 'submitted',
      work_link: workLink,
      editor_notes: notes || '',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Work submitted for QC' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Earnings & Rating ──────────────────────────────────────────────── */
router.get('/stats', editorOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Calculate stats
    const tasks = await Task.findAll({ assigned_editor_id: req.user.id });
    const completedTasks = tasks.filter(t => t.status === 'approved');
    const totalEarnings = completedTasks.reduce((sum, t) => sum + (t.payout_amount || 0), 0);
    const pendingTasksCount = tasks.filter(t => ['in_progress', 'submitted'].includes(t.status)).length;

    res.json({
      rating: user.editor_rating || 5.0,
      totalEarnings,
      walletBalance: user.wallet_balance || 0,
      completedJobs: completedTasks.length,
      activeJobs: pendingTasksCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
