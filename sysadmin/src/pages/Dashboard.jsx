import React, { useState, useCallback, useEffect } from 'react';
import { Users, CreditCard, ClipboardList, IndianRupee } from 'lucide-react';
import { API } from '../apiConfig';
import { useAuth } from '../context/AuthContext';

/* ── Dashboard Overview ─────────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');

  const loadStats = useCallback(() => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setStats(d); setError(null); })
      .catch(() => setError('Could not load live stats'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { loadStats(); }, [loadStats]);

  const cards = [
    { label: 'Total Users',    value: stats?.totalUsers   ?? '—', color: '#0ea5e9',  icon: Users },
    { label: 'Total Orders',   value: stats?.totalOrders  ?? '—', color: '#22c55e',  icon: CreditCard },
    { label: 'Active Tasks',   value: stats?.activeTasks  ?? '—', color: '#f59e0b',  icon: ClipboardList },
    { label: 'Pending Payouts',value: stats?.pendingJobs  ?? '—', color: '#a855f7',  icon: IndianRupee },
  ];

  return (
    <div style={{ padding: '36px 40px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(14,165,233,0.6)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>// ops.weddingalbums.in</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          Operations Dashboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Welcome back, {user?.name}. Here's your platform overview.</p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13 }}>
          <span>⚠ {error} — figures below may be stale.</span>
          <button onClick={loadStats} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', fontWeight: 600, fontSize: 12 }}>
            Retry
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '22px 20px', position: 'relative', overflow: 'hidden', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.color}30`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <c.icon size={18} color={c.color} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: loading ? 'rgba(255,255,255,0.35)' : '#fff', lineHeight: 1, animation: loading ? 'pulse 1.4s ease-in-out infinite' : 'none' }}>
              {loading ? '…' : c.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '20px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
          → Use the sidebar to navigate orders, users, pricing, editor payouts and quality control.
        </p>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
    </div>
  );
};

export default Dashboard;
