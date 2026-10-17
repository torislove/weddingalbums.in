import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Protected Route ───────────────────────────────────────────────── */
const Guard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00060f', flexDirection: 'column', gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(14,165,233,0.15)', borderTopColor: '#0ea5e9', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>LOADING SESSION…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!user || (user.role !== 'admin' && user.role !== 'sysadmin')) return <Navigate to="/login" replace />;
  return children;
};

export default Guard;
