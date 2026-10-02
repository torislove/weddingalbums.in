import React, { useState, useEffect } from 'react';
import { PenTool, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, FileText, Image, Settings } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/* ── Typewriter hook ── */
const useTypewriter = (text, speed = 55) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const t = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return displayed;
};

const FEATURES = [
  { icon: FileText, label: 'Page Content Editor', desc: 'Edit every word on the site live' },
  { icon: Image, label: 'Media Library', desc: 'Upload & manage all images' },
  { icon: Settings, label: 'Global Settings', desc: 'Control navigation, footer & more' },
];

const AdminLogin = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const headline = useTypewriter('Content Studio');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, portalRole: 'content_admin' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
      } else if (data.user?.role !== 'admin') {
        setError('Unauthorized: Content Admin access only.');
      } else {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
      }
    } catch {
      setError('Cannot connect to server. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const inputSt = {
    width: '100%',
    padding: '13px 14px 13px 44px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(245,158,11,0.15)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.93rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.25s ease',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
    }}>

      {/* Left — Editorial Panel */}
      <div style={{
        background: 'linear-gradient(160deg, #0f0f0f 0%, #111008 100%)',
        borderRight: '1px solid rgba(245,158,11,0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 50px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.02'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, pointerEvents: 'none' }} />

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PenTool size={18} color="#f59e0b" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff', letterSpacing: '-0.2px' }}>WeddingAlbums.in</span>
          </div>

          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(245,158,11,0.6)', marginBottom: '16px' }}>Content Management</div>
            <h1 style={{ fontSize: '3.2rem', fontWeight: '700', color: '#fff', lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '20px' }}>
              {headline}
              <span style={{ color: '#f59e0b', animation: 'uiaBlink 1s infinite' }}>|</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '300px' }}>
              Your command center for editing live website content, managing media, and configuring global settings.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', animation: `uiaFadeIn 0.4s ${0.1 + i * 0.1}s both` }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={16} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: '0.87rem', fontWeight: '500', color: '#fff', marginBottom: '2px' }}>{f.label}</div>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.3)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, rgba(245,158,11,0.3), transparent)' }} />
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '1.5px' }}>CMS v2</span>
        </div>
      </div>

      {/* Right — Login Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 50px', background: '#080808', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '380px', animation: 'uiaFadeIn 0.5s ease both' }}>

          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '20px', marginBottom: '20px' }}>
              <PenTool size={11} color="#f59e0b" />
              <span style={{ fontSize: '0.71rem', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b' }}>Content Admin</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Sign In
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>
              Access the content management system.
            </p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '11px 14px', color: '#fca5a5', fontSize: '0.83rem', marginBottom: '20px' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.78rem', fontWeight: '500', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,158,11,0.4)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  required
                  style={inputSt}
                  placeholder="admin@weddingalbums.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={e => { e.target.style.borderColor = 'rgba(245,158,11,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.07)'; e.target.style.background = 'rgba(245,158,11,0.03)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(245,158,11,0.15)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.78rem', fontWeight: '500', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  style={{ ...inputSt, paddingRight: '44px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={e => { e.target.style.borderColor = 'rgba(245,158,11,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.07)'; e.target.style.background = 'rgba(245,158,11,0.03)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(245,158,11,0.15)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px 20px', marginTop: '8px', background: loading ? 'rgba(245,158,11,0.15)' : 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: '12px', color: loading ? 'rgba(0,0,0,0.3)' : '#111', fontSize: '0.92rem', fontWeight: '700', fontFamily: 'inherit', letterSpacing: '0.3px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: loading ? 'none' : '0 8px 24px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.25)', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(245,158,11,0.45)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 24px rgba(245,158,11,0.3)'; }}
            >
              {loading ? 'Signing in…' : 'Sign In to CMS'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{ marginTop: '36px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px' }}>
            <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: '1.6' }}>
              This portal is for authorized content administrators only.<br />
              <a href="http://localhost:5176" style={{ color: 'rgba(245,158,11,0.5)', textDecoration: 'none' }}>Need Operations Panel?</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes uiaBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes uiaFadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
