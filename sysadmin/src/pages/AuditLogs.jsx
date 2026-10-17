import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Search, ShieldAlert, ShieldCheck, RefreshCw } from 'lucide-react';
import { API } from '../apiConfig';

const ACTION_TONES = {
  LOGIN: { bg: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: 'rgba(34,211,238,0.3)' },
  LOGOUT: { bg: 'rgba(148,163,184,0.12)', color: 'var(--n-400)', border: 'rgba(148,163,184,0.3)' },
  ORDER_CREATE: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', border: 'rgba(34,197,94,0.3)' },
  CONTENT_PUBLISH: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7', border: 'rgba(168,85,247,0.3)' },
};

const toneFor = (action) =>
  ACTION_TONES[action] || Object.entries(ACTION_TONES).find(([k]) => action?.startsWith(k.split('_')[0]))?.[1] ||
  { bg: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: 'rgba(14,165,233,0.25)' };

const pretty = (ts) => {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const AuditLogs = () => {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');

  const fetchLogs = async () => {
    setError(null);
    setLogs(null);
    try {
      const res = await fetch(`${API}/api/admin/audit-logs`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401 || res.status === 403) throw new Error('Not authorised — sign in again');
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : Array.isArray(data?.logs) ? data.logs : []);
    } catch (e) {
      setError(e.message || 'Failed to load audit trail');
    }
  };

  useEffect(() => {
    if (token) fetchLogs();
    else setError('Not authorised — sign in again');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filtered = useMemo(() => {
    if (!Array.isArray(logs)) return [];
    if (!query.trim()) return logs;
    const q = query.trim().toLowerCase();
    return logs.filter(l =>
      (l.action || '').toLowerCase().includes(q) ||
      (l.user_id || '').toLowerCase().includes(q) ||
      (l.ip || '').toLowerCase().includes(q) ||
      String(l.details || '').toLowerCase().includes(q)
    );
  }, [logs, query]);

  return (
    <div style={{ padding: '36px 40px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(14,165,233,0.6)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>// system integrity</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--paper)', marginBottom: 6 }}>Audit Trail</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Security-relevant events across the platform (latest 100, newest first).</p>
        </div>
        <button onClick={fetchLogs} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 10,
          background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)',
          color: '#22d3ee', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '10px 14px', maxWidth: 520,
      }}>
        <Search size={15} color="rgba(255,255,255,0.35)" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter by action, user, IP or details…"
          style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--n-200)', fontFamily: 'inherit', fontSize: 13, width: '100%' }}
        />
      </div>

      {error ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 18, borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13 }}>
          <ShieldAlert size={18} /> {error}
        </div>
      ) : logs === null ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 30, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid rgba(14,165,233,0.15)', borderTopColor: '#0ea5e9', animation: 'audit-spin 0.8s linear infinite' }} />
          LOADING AUDIT TRAIL…
          <style>{`@keyframes audit-spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 26, borderRadius: 12, border: '1px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          <ShieldCheck size={18} style={{ color: '#22c55e' }} /> No audit events recorded yet — sign-ins and content publishes will appear here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(log => {
            const tone = toneFor(log.action);
            const isOpen = expanded === log.id;
            return (
              <div key={log.id} onClick={() => setExpanded(isOpen ? null : log.id)} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '14px 18px', cursor: 'pointer', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 700, letterSpacing: 1,
                    padding: '4px 10px', borderRadius: 8, background: tone.bg, color: tone.color, border: `1px solid ${tone.border}`,
                  }}>{log.action || 'EVENT'}</span>
                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                    {log.details && String(log.details).length > 90 ? `${String(log.details).slice(0, 90)}…` : String(log.details || '')}
                  </span>
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {log.user_id ? `user ${String(log.user_id).slice(0, 10)}…` : 'system'}
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>{pretty(log.timestamp)}</span>
                  </span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                    <span>Event ID: <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(34,211,238,0.7)' }}>{log.id}</span></span>
                    <span>IP: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{log.ip || '—'}</span></span>
                    <span>Full details: {String(log.details || '—')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
        <Activity size={13} /> Retention: latest 100 events · write-through to PostgreSQL when connected
      </div>
    </div>
  );
};

export default AuditLogs;
