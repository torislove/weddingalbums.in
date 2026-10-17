import React, { useState, useEffect } from 'react';
import { Database, Server, KeyRound, ShieldCheck, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { API } from '../apiConfig';

const CONFIG_KEYS = [
  { key: 'DATABASE_URL', desc: 'PostgreSQL connection string — all orders, tasks, payouts, carts & audit logs persist here', required: true },
  { key: 'JWT_SECRET', desc: 'Token signing secret shared across all portals', required: true },
  { key: 'ADMIN_SEED_PASSWORD', desc: 'Replacement for the default admin123 demo password on seeded accounts', required: false },
  { key: 'RAZORPAY_KEY_ID', desc: 'Razorpay live/test key id — enables real payment orders', required: false },
  { key: 'RAZORPAY_KEY_SECRET', desc: 'Razorpay secret — enables pay/verify signature checks', required: false },
  { key: 'RAZORPAY_WEBHOOK_SECRET', desc: 'Razorpay webhook signing secret — enables /api/pay/webhook', required: false },
  { key: 'VITE_API_URL (uiadmin urls)', desc: 'Cross-portal URLs used by uiadmin editors (CLIENT_URL / OPS_URL / STUDIO_URL / CREATOR_URL)', required: false },
];

const ENDPOINTS = [
  { name: 'Health', url: '/api/health', hint: 'Uptime · DB engine' },
  { name: 'Catalog', url: '/api/public/packages', hint: 'Public packages' },
  { name: 'Sheet Configs', url: '/api/public/configs', hint: 'Sheet catalogue' },
  { name: 'Content', url: '/api/content', hint: 'CMS snapshot' },
];

const Settings = () => {
  const [health, setHealth] = useState(null);
  const [pings, setPings] = useState({});
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/health`).then(r => r.ok ? r.json() : null).then(setHealth).catch(() => {});
    ENDPOINTS.forEach(e => {
      fetch(`${API}${e.url}`)
        .then(r => setPings(p => ({ ...p, [e.url]: r.ok })))
        .catch(() => setPings(p => ({ ...p, [e.url]: false })));
    });
  }, []);

  const copyAll = async () => {
    const text = CONFIG_KEYS.map(k => `${k.key}=`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };

  const statRow = (label, value, ok) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span style={{ fontSize: 12.5, fontFamily: 'JetBrains Mono, monospace', color: ok === null ? 'rgba(255,255,255,0.3)' : (ok ? '#22c55e' : value ? '#22d3ee' : 'var(--warn)') }}>{value}</span>
    </div>
  );

  return (
    <div style={{ padding: '36px 40px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(14,165,233,0.6)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>// system configuration</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--paper)', marginBottom: 6 }}>Settings & Health</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Live service health plus the environment variables this deployment expects.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* Health card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Server size={17} color="#22d3ee" />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--paper)', margin: 0 }}>API Service</h2>
          </div>
          <div>
            {statRow('Status', health ? 'operational' : 'unreachable', health ? true : false)}
            {statRow('Environment', health?.environment ?? '—', null)}
            {statRow('Port', health?.port ?? '—', null)}
            {statRow('Uptime', health ? `${Number(health.uptime || 0)}s` : '—', null)}
            {statRow('Database engine', health?.database?.engine ?? '—', null)}
            {statRow('DB status', health?.database?.status ?? '—', health?.database?.status === 'connected' ? true : null)}
          </div>
        </div>

        {/* Endpoint probes */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <ShieldCheck size={17} color="#22c55e" />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--paper)', margin: 0 }}>Endpoint Probes</h2>
          </div>
          {ENDPOINTS.map(e => (
            <div key={e.url} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>
                <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{e.name}</span>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)', marginLeft: 8, fontFamily: 'JetBrains Mono, monospace' }}>{e.hint}</span>
              </span>
              {pings[e.url] === undefined ? (
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>pinging…</span>
              ) : pings[e.url] ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#22c55e', fontFamily: 'JetBrains Mono, monospace' }}><CheckCircle2 size={13} /> 200</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--warn)', fontFamily: 'JetBrains Mono, monospace' }}><AlertTriangle size={13} /> fail</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Env reference */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '22px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <KeyRound size={17} color="#f59e0b" />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--paper)', margin: 0 }}>Environment Reference</h2>
          </div>
          <button onClick={copyAll} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 10,
            background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)',
            color: '#22d3ee', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy keys'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 12px' }}>
          Configure these on the API host (or `server/.env` in development). Rotated secrets take effect on restart.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONFIG_KEYS.map(k => (
            <div key={k.key} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 10,
              background: 'rgba(0,6,15,0.5)', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap',
            }}>
              <code style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#22d3ee',
                background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)',
                padding: '3px 10px', borderRadius: 8, whiteSpace: 'nowrap',
              }}>{k.key}</code>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', flex: 1, minWidth: 220 }}>{k.desc}</span>
              {k.required ? (
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--warn)', fontFamily: 'JetBrains Mono, monospace', padding: '2px 8px', borderRadius: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>REQUIRED</span>
              ) : (
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>OPTIONAL</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security posture note */}
      <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: 16, padding: '18px 24px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Database size={17} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.7 }}>
          Orders, tasks, projects, payouts, carts, refresh tokens and audit logs are persisted through the
          dual-engine store (PostgreSQL write-through with resilient in-memory fallback). Razorpay payments
          verify HMAC signatures server-side — wire keys in <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#22d3ee' }}>.env</span> only.
        </p>
      </div>
    </div>
  );
};

export default Settings;
