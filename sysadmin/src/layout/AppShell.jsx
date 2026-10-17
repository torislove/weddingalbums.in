import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

import UserManager from '../pages/UserManager';
import TaskBoard from '../pages/TaskBoard';
import PricingEngine from '../pages/PricingEngine';
import OrderManager from '../pages/OrderManager';
import Editors from '../pages/Editors';
import JobQC from '../pages/JobQC';
import Payouts from '../pages/Payouts';
import AuditLogs from '../pages/AuditLogs';
import SettingsPage from '../pages/Settings';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import Logo from '../components/Logo';
import Guard from '../components/Guard';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

/* ── Login Bridge (setToken → login context method) ─────────────────── */
const LoginBridge = () => {
  const { login } = useAuth();
  const handleSetToken = (tok, userObj) => {
    const savedUser = userObj || JSON.parse(localStorage.getItem('sysadminUser') || localStorage.getItem('adminUser') || '{"role":"admin","name":"Admin"}');
    login(tok, savedUser);
  };
  return <AdminLogin setToken={handleSetToken} />;
};

/* ── App shell: sidebar + top bar + nested routes ─────────────────────── */
const AppShell = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginBridge />} />
        <Route path="/*" element={
          <Guard>
            <div style={{ display: 'flex', minHeight: '100vh', background: '#00060f', color: 'var(--n-200)' }}>
              {/* Mobile top bar */}
              {isMobile && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, height: 60,
                  background: 'rgba(0,6,15,0.98)', borderBottom: '1px solid rgba(14,165,233,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 16px', zIndex: 60, fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}>
                  <button
                    onClick={() => setSidebarOpen(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22d3ee', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Toggle menu"
                  >
                    {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                  <Logo size={28} portalTag="Ops Center" />
                  <div style={{ width: 38 }} />
                </div>
              )}
              <Sidebar isOpen={isMobile ? sidebarOpen : true} onClose={() => setSidebarOpen(false)} />
              <main style={{
                flex: 1,
                marginLeft: isMobile ? 0 : 250,
                minHeight: '100vh',
                overflowY: 'auto',
                paddingTop: isMobile ? 60 : 0,
              }}>
                {/* Desktop top header bar aligned with 72px sidebar */}
                {!isMobile && (
                  <header style={{
                    height: 72,
                    boxSizing: 'border-box',
                    borderBottom: '1px solid rgba(14,165,233,0.08)',
                    background: 'rgba(0,6,15,0.7)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 36px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(14,165,233,0.7)', letterSpacing: 2, fontWeight: 700 }}>OPS CENTER</span>
                      <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Operations Management</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(34,211,238,0.8)', fontFamily: 'JetBrains Mono, monospace', padding: '4px 10px', borderRadius: 20, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }} />
                        <span>NETWORK HEALTH 100%</span>
                      </div>
                      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono, monospace' }}>{user?.email || 'ops@weddingalbums.in'}</span>
                    </div>
                  </header>
                )}
                <Routes>
                  <Route path="/"        element={<Dashboard />} />
                  <Route path="/users"   element={<UserManager />} />
                  <Route path="/orders"  element={<OrderManager />} />
                  <Route path="/tasks"   element={<TaskBoard />} />
                  <Route path="/pricing" element={<PricingEngine />} />
                  <Route path="/editors" element={<Editors />} />
                  <Route path="/qc"      element={<JobQC />} />
                  <Route path="/payouts" element={<Payouts />} />
                  <Route path="/audit"   element={<AuditLogs />} />
                  <Route path="/settings"element={<SettingsPage />} />
                  <Route path="*"        element={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: 80 }}>Page not found</div>} />
                </Routes>
              </main>
            </div>
          </Guard>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppShell;
