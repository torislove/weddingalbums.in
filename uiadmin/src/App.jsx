import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Image as ImageIcon, Save, ExternalLink, Bell, LogOut, PenTool, Eye } from 'lucide-react';
import PageEditor from './pages/PageEditor';
import GlobalEditor from './pages/GlobalEditor';
import PushNotificationEditor from './pages/PushNotificationEditor';
import CalendarEditor from './pages/CalendarEditor';
import MediaLibrary from './pages/MediaLibrary';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Toast from './components/Toast';
import Logo from './components/Logo';
import { useAdminContent } from './hooks/useAdminContent';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/* ── Auth Context ──────────────────────────────────────────────────── */
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('uiAdminUser');
    if (saved && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin') {
          setToken(saved);
          setUser(parsed);
        }
      } catch { /* bad JSON */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback((tok, userData) => {
    localStorage.setItem('adminToken', tok);
    localStorage.setItem('uiAdminUser', JSON.stringify(userData));
    setToken(tok);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('uiAdminUser');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

/* ── Guard ─────────────────────────────────────────────────────────── */
const Guard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(245,158,11,0.15)', borderTopColor: '#f59e0b', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>Loading CMS…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

/* ── Sidebar ───────────────────────────────────────────────────────── */
const PAGES_MENU = [
  { name: 'Dashboard',          path: '/',                    icon: LayoutDashboard },
  { name: 'Home Page',          path: '/pages/home',          icon: FileText },
  { name: 'About Page',         path: '/pages/about',         icon: FileText },
  { name: 'Services Page',      path: '/pages/services',      icon: FileText },
  { name: 'Portfolio Page',     path: '/pages/portfolio',     icon: FileText },
  { name: 'Testimonials',       path: '/pages/testimonials',  icon: FileText },
  { name: 'Contact Page',       path: '/pages/contact',       icon: FileText },
];
const TOOLS_MENU = [
  { name: 'Booking Calendar',   path: '/calendar',   icon: LayoutDashboard },
  { name: 'Push Notifications', path: '/push',        icon: Bell },
  { name: 'Global Elements',    path: '/global',      icon: Settings },
  { name: 'Image Library',      path: '/images',      icon: ImageIcon },
];

const SidebarLink = ({ item }) => {
  const location = useLocation();
  const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
  return (
    <Link to={item.path} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 10, marginBottom: 2,
      color: active ? '#f59e0b' : 'rgba(255,255,255,0.4)',
      background: active ? 'rgba(245,158,11,0.08)' : 'transparent',
      border: `1px solid ${active ? 'rgba(245,158,11,0.15)' : 'transparent'}`,
      textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400,
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; } }}
    >
      <item.icon size={15} />
      {item.name}
    </Link>
  );
};

const Sidebar = ({ isDirty, onSave, saving }) => {
  const { user, logout } = useAuth();
  return (
    <aside style={{
      width: 250, background: '#050505', borderRight: '1px solid rgba(245,158,11,0.06)',
      height: '100vh', position: 'fixed', top: 0, left: 0,
      display: 'flex', flexDirection: 'column', zIndex: 50,
      overflowY: 'auto', scrollbarWidth: 'none',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PenTool size={15} color="#f59e0b" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Content Studio</div>
          <div style={{ fontSize: 10, color: 'rgba(245,158,11,0.5)', letterSpacing: 1 }}>CMS v2</div>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1a0e00', flexShrink: 0 }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{user?.name || 'Admin'}</div>
          <div style={{ fontSize: 10, color: 'rgba(245,158,11,0.5)', letterSpacing: 1 }}>CONTENT ADMIN</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', padding: '8px 10px 4px' }}>Pages</div>
        {PAGES_MENU.map(i => <SidebarLink key={i.path} item={i} />)}

        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', padding: '14px 10px 4px', marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>Tools</div>
        {TOOLS_MENU.map(i => <SidebarLink key={i.path} item={i} />)}
      </nav>

      {/* Footer actions */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Publish button */}
        <button onClick={onSave} disabled={!isDirty || saving} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '10px 12px', borderRadius: 10, border: 'none', cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
          background: isDirty && !saving ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255,255,255,0.04)',
          color: isDirty && !saving ? '#fff' : 'rgba(255,255,255,0.2)',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          transition: 'all 0.2s',
          boxShadow: isDirty && !saving ? '0 6px 16px rgba(34,197,94,0.25)' : 'none',
          marginBottom: 6,
        }}>
          <Save size={14} />
          {saving ? 'Publishing…' : isDirty ? 'Publish Changes' : 'All Published ✓'}
        </button>

        {/* Preview */}
        <a href="http://localhost:5173" target="_blank" rel="noreferrer" style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '9px 12px', borderRadius: 10,
          background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.35)', fontSize: 12, textDecoration: 'none',
          transition: 'all 0.2s', marginBottom: 6,
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
        >
          <Eye size={13} /> Preview Live Site
        </a>

        {/* Logout */}
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '9px 12px', borderRadius: 10,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(239,68,68,0.5)', fontSize: 12, fontFamily: 'inherit',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(239,68,68,0.5)'; e.currentTarget.style.background = 'none'; }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>
    </aside>
  );
};

/* ── Login Bridge ───────────────────────────────────────────────────── */
const LoginBridge = () => {
  const { login } = useAuth();
  const handleSetToken = (tok) => {
    const u = JSON.parse(localStorage.getItem('uiAdminUser') || '{"role":"admin","name":"Admin"}');
    login(tok, u);
  };
  return <AdminLogin setToken={handleSetToken} />;
};

/* ── Main App ───────────────────────────────────────────────────────── */
function AppInner() {
  const { user, token } = useAuth();
  const adminState = useAdminContent(token);
  const { saveContent } = adminState;
  const [toastMessage, setToastMessage] = useState(null);

  const handleSave = async () => {
    await saveContent();
    setToastMessage('Changes successfully published to the live site!');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginBridge />} />
        <Route path="/*" element={
          <Guard>
            {!adminState.content ? (
              <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050505', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(245,158,11,0.15)', borderTopColor: '#f59e0b', animation: 'spin 0.8s linear infinite' }} />
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>Loading CMS content…</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : (
              <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
                <Sidebar isDirty={adminState.isDirty} onSave={handleSave} saving={adminState.saving} />
                <main style={{ flex: 1, marginLeft: 250, minHeight: '100vh', overflowY: 'auto' }}>
                  <Routes>
                    <Route path="/"               element={<Dashboard />} />
                    <Route path="/pages/:pageId"  element={<PageEditor adminState={adminState} />} />
                    <Route path="/calendar"        element={<CalendarEditor adminState={adminState} />} />
                    <Route path="/push"            element={<PushNotificationEditor adminState={adminState} />} />
                    <Route path="/global"          element={<GlobalEditor adminState={adminState} />} />
                    <Route path="/images"          element={<MediaLibrary />} />
                    <Route path="*"               element={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: 80 }}>Under construction</div>} />
                  </Routes>
                </main>
                <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
              </div>
            )}
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
