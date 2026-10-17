import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Image as ImageIcon, Save, ExternalLink, Bell, LogOut, PenTool, Eye, Menu, X, History as HistoryIcon } from 'lucide-react';
import { useMediaQuery } from './hooks/useMediaQuery';
import PageEditor from './pages/PageEditor';
import GlobalEditor from './pages/GlobalEditor';
import PushNotificationEditor from './pages/PushNotificationEditor';
import CalendarEditor from './pages/CalendarEditor';
import MediaLibrary from './pages/MediaLibrary';
import History from './pages/History';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import HubCatalogEditor from './pages/HubCatalogEditor';
import Toast from './components/Toast';
import Logo from './components/Logo';
import ErrorBoundary from './components/ErrorBoundary';
import { CLIENT_URL, OPS_URL } from './config/urls';
import { useAdminContent } from './hooks/useAdminContent';
import { API } from './apiConfig';

/* ── Auth Context ──────────────────────────────────────────────────── */
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('uiadminToken') || localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('uiAdminUser');
    if (saved && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin' || parsed.role === 'sysadmin' || parsed.role === 'content_admin') {
          setToken(saved);
          setUser(parsed);
        } else {
          localStorage.removeItem('uiadminToken');
          localStorage.removeItem('uiAdminUser');
          localStorage.removeItem('adminToken');
        }
      } catch { /* bad JSON */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback((tok, userData) => {
    localStorage.setItem('uiadminToken', tok);
    localStorage.setItem('uiAdminUser', JSON.stringify(userData));
    setToken(tok);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }
    localStorage.removeItem('uiadminToken');
    localStorage.removeItem('uiAdminUser');
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('uiadminToken', data.token);
        setToken(data.token);
        return data.token;
      }
      logout();
      return null;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, logout, refreshToken, api: API }}>
      {children}
    </AuthCtx.Provider>
  );
};

/* ── Guard ─────────────────────────────────────────────────────────── */
const Guard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(245,158,11,0.15)', borderTopColor: 'var(--warn)', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>Loading CMS…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!user || (user.role !== 'admin' && user.role !== 'content_admin')) return <Navigate to="/login" replace />;
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
  { name: 'Publish History',    path: '/history',             icon: HistoryIcon },
];
const TOOLS_MENU = [
  { name: 'Hub Catalog & Pricing', path: '/catalog',   icon: PenTool },
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
      color: active ? 'var(--warn)' : 'rgba(255,255,255,0.4)',
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

const Sidebar = ({ isDirty, onSave, saving, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 49,
            display: 'block',
          }}
        />
      )}
    <aside style={{
        width: 250, background: 'var(--ink)', borderRight: '1px solid rgba(245,158,11,0.06)',
        height: '100vh', position: 'fixed', top: 0, left: 0,
        display: 'flex', flexDirection: 'column', zIndex: 50,
        overflowY: 'auto', scrollbarWidth: 'none',
        fontFamily: 'Inter, sans-serif',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>
      {/* Brand */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', height: 72, boxSizing: 'border-box' }}>
        <Logo size={32} portalTag="CMS Studio" />
      </div>

      {/* User */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, var(--warn), #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1a0e00', flexShrink: 0 }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--paper)' }}>{user?.name || 'Admin'}</div>
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
          color: isDirty && !saving ? 'var(--paper)' : 'rgba(255,255,255,0.2)',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          transition: 'all 0.2s',
          boxShadow: isDirty && !saving ? '0 6px 16px rgba(34,197,94,0.25)' : 'none',
          marginBottom: 6,
        }}>
          <Save size={14} />
          {saving ? 'Publishing…' : isDirty ? 'Publish Changes' : 'All Published ✓'}
        </button>

        {/* Preview */}
        <a href={CLIENT_URL} target="_blank" rel="noreferrer" style={{
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
    </>
  );
};

/* ── Login Bridge ───────────────────────────────────────────────────── */
const LoginBridge = () => {
  const { login } = useAuth();
  const handleSetToken = (tok, userObj) => {
    const u = userObj || JSON.parse(localStorage.getItem('uiAdminUser') || '{"role":"admin","name":"Admin"}');
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

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
              <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(245,158,11,0.15)', borderTopColor: 'var(--warn)', animation: 'spin 0.8s linear infinite' }} />
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>Loading CMS content…</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : (
              <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ink)', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
                {/* Mobile hamburger header */}
                {isMobile && (
                  <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, height: 60,
                    background: 'var(--ink)', borderBottom: '1px solid rgba(245,158,11,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 16px', zIndex: 60, fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box'
                  }}>
                    <button
                      onClick={() => setSidebarOpen(v => !v)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warn)', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label="Toggle menu"
                    >
                      {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <Logo size={28} portalTag="CMS Studio" />
                    <div style={{ width: 38 }} />
                  </div>
                )}
                <Sidebar
                  isDirty={adminState.isDirty}
                  onSave={handleSave}
                  saving={adminState.saving}
                  isOpen={isMobile ? sidebarOpen : true}
                  onClose={() => setSidebarOpen(false)}
                />
                <main style={{
                  flex: 1,
                  marginLeft: isMobile ? 0 : 250,
                  minHeight: '100vh',
                  overflowY: 'auto',
                  paddingTop: isMobile ? 60 : 0,
                }}>
                  <Routes>
                    <Route path="/"               element={<Dashboard />} />
                    <Route path="/pages/:pageId"  element={<PageEditor adminState={adminState} />} />
                    <Route path="/catalog"        element={<HubCatalogEditor adminState={adminState} />} />
                    <Route path="/calendar"        element={<CalendarEditor adminState={adminState} />} />
                    <Route path="/push"            element={<PushNotificationEditor adminState={adminState} />} />
                    <Route path="/global"          element={<GlobalEditor adminState={adminState} />} />
                    <Route path="/images"          element={<MediaLibrary />} />
                    <Route path="/history"         element={<History />} />
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
    <ErrorBoundary label="CMS Studio" accent="var(--warn)">
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
