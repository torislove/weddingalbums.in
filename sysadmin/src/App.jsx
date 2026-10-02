import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, ClipboardList,
  Briefcase, Scissors, ShieldCheck, IndianRupee,
  LogOut, Bell, Activity, Settings, ChevronDown
} from 'lucide-react';

import UserManager from './pages/UserManager';
import TaskBoard from './pages/TaskBoard';
import PricingEngine from './pages/PricingEngine';
import OrderManager from './pages/OrderManager';
import Editors from './pages/Editors';
import JobQC from './pages/JobQC';
import Payouts from './pages/Payouts';
import AdminLogin from './pages/AdminLogin';
import Logo from './components/Logo';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/* ── Auth Context ──────────────────────────────────────────────────── */
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    if (saved && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin') {
          setToken(saved);
          setUser(parsed);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch { /* bad JSON */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback((tok, userData) => {
    localStorage.setItem('adminToken', tok);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setToken(tok);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

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
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

/* ── Sidebar ───────────────────────────────────────────────────────── */
const MENU = [
  { group: 'Operations',
    items: [
      { name: 'Dashboard',        path: '/',         icon: LayoutDashboard },
      { name: 'Orders & Payments',path: '/orders',   icon: CreditCard },
      { name: 'Production Tasks', path: '/tasks',    icon: ClipboardList },
      { name: 'Quality Control',  path: '/qc',       icon: ShieldCheck },
    ]
  },
  { group: 'People',
    items: [
      { name: 'Customers & Users',path: '/users',    icon: Users },
      { name: 'Editor Network',   path: '/editors',  icon: Scissors },
      { name: 'Editor Payouts',   path: '/payouts',  icon: IndianRupee },
    ]
  },
  { group: 'System',
    items: [
      { name: 'Pricing & Packages', path: '/pricing', icon: Briefcase },
      { name: 'Audit Logs',         path: '/audit',   icon: Activity },
      { name: 'Settings',           path: '/settings',icon: Settings },
    ]
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside style={{
      width: 250,
      background: 'rgba(0,6,15,0.95)',
      borderRight: '1px solid rgba(14,165,233,0.08)',
      height: '100vh',
      position: 'fixed',
      top: 0, left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(14,165,233,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Logo size={32} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 6px #22d3ee', animation: 'blink 1.5s infinite' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(14,165,233,0.6)', letterSpacing: 2 }}>OPS CENTER ONLINE</span>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user?.name || 'Admin'}</div>
          <div style={{ fontSize: 10, color: 'rgba(14,165,233,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>SYSADMIN</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {MENU.map(group => (
          <div key={group.group}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', padding: '10px 10px 6px', marginTop: 6 }}>{group.group}</div>
            {group.items.map(item => {
              const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                  color: active ? '#22d3ee' : 'rgba(255,255,255,0.4)',
                  background: active ? 'rgba(14,165,233,0.08)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(14,165,233,0.15)' : 'transparent'}`,
                  textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(239,68,68,0.6)', fontFamily: 'inherit', fontSize: 13,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(239,68,68,0.6)'; }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </aside>
  );
};

/* ── Dashboard Overview ─────────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => setStats(d))
      .catch(() => {});
  }, [token]);

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
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '20px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
          → Use the sidebar to navigate orders, users, pricing, editor payouts and quality control.
        </p>
      </div>
    </div>
  );
};

/* ── Login Bridge (setToken → login context method) ─────────────────── */
const LoginBridge = () => {
  const { login } = useAuth();
  const handleSetToken = (tok) => {
    const savedUser = JSON.parse(localStorage.getItem('adminUser') || '{"role":"admin","name":"Admin"}');
    login(tok, savedUser);
  };
  return <AdminLogin setToken={handleSetToken} />;
};

/* ── App ─────────────────────────────────────────────────────────────── */
function AppInner() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginBridge />} />
        <Route path="/*" element={
          <Guard>
            <div style={{ display: 'flex', minHeight: '100vh', background: '#00060f', color: '#e2e8f0' }}>
              <Sidebar />
              <main style={{ flex: 1, marginLeft: 250, minHeight: '100vh', overflowY: 'auto' }}>
                <Routes>
                  <Route path="/"        element={<Dashboard />} />
                  <Route path="/users"   element={<UserManager />} />
                  <Route path="/orders"  element={<OrderManager />} />
                  <Route path="/tasks"   element={<TaskBoard />} />
                  <Route path="/pricing" element={<PricingEngine />} />
                  <Route path="/editors" element={<Editors />} />
                  <Route path="/qc"      element={<JobQC />} />
                  <Route path="/payouts" element={<Payouts />} />
                  <Route path="/audit"   element={<div style={{ padding: '40px', color: '#fff' }}><h2>Audit Logs — Coming Soon</h2></div>} />
                  <Route path="/settings"element={<div style={{ padding: '40px', color: '#fff' }}><h2>Settings — Coming Soon</h2></div>} />
                  <Route path="*"        element={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: 80 }}>Page not found</div>} />
                </Routes>
              </main>
            </div>
          </Guard>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
