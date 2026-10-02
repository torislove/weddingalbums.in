import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, MessageCircle, ArrowRight, AlertCircle, Camera, ChevronLeft } from 'lucide-react';
import Logo from '../components/Logo';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/* ── Inline CSS-in-JS styles for self-contained premium design ── */
const S = {
  root: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse 100% 80% at 20% 0%, #1a1200 0%, #0a0800 40%, #050400 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
};

/* Floating particle canvas effect via CSS only */
const Particles = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    {/* Large ambient glow */}
    <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)', animation: 'b2bGlow1 18s infinite ease-in-out alternate' }} />
    <div style={{ position: 'absolute', bottom: '-25%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,130,10,0.06) 0%, transparent 70%)', animation: 'b2bGlow2 22s infinite ease-in-out alternate' }} />
    {/* Fine golden sparks */}
    {[...Array(14)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: `${2 + (i % 3)}px`,
        height: `${2 + (i % 3)}px`,
        borderRadius: '50%',
        background: `rgba(212,175,55,${0.2 + (i % 4) * 0.12})`,
        left: `${(i * 37 + 10) % 100}%`,
        top: `${(i * 53 + 5) % 100}%`,
        animation: `b2bSpark ${8 + (i % 6)}s ${i * 0.6}s infinite ease-in-out alternate`,
        filter: 'blur(0.5px)',
      }} />
    ))}
    <style>{`
      @keyframes b2bGlow1 { from { transform: scale(1) translate(0,0); } to { transform: scale(1.15) translate(3%,4%); } }
      @keyframes b2bGlow2 { from { transform: scale(1) translate(0,0); } to { transform: scale(1.1) translate(-2%,-5%); } }
      @keyframes b2bSpark { from { transform: translateY(0) scale(1); opacity: 0.3; } to { transform: translateY(-30px) scale(1.5); opacity: 0; } }
    `}</style>
  </div>
);

const B2BLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, portalRole: 'b2b' }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.user?.role !== 'b2b' && data.user?.role !== 'admin') {
          setError('Access denied. This portal is for Studio Partners only.');
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Cannot connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!phone) return;
    setForgotSent(true);
    setTimeout(() => { setForgotSent(false); setMode('login'); setPhone(''); }, 3000);
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 14px 13px 44px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.93rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.25s ease',
    boxSizing: 'border-box',
  };

  return (
    <div style={S.root}>
      <Particles />

      {/* Decorative horizontal rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)', zIndex: 1 }} />

      {/* Header */}
      <header style={{ marginBottom: '40px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: '24px' }}>
          <Logo size={44} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4))' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(212,175,55,0.6)' }}>Studio Portal</span>
          <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.4))' }} />
        </div>
      </header>

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: '440px',
        background: 'rgba(15,12,5,0.7)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(212,175,55,0.12)',
        borderRadius: '24px',
        padding: '44px 40px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.05), inset 0 1px 0 rgba(212,175,55,0.08)',
      }}>

        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)', borderRadius: '999px' }} />

        {/* Camera icon badge */}
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 30px rgba(212,175,55,0.1)' }}>
          <Camera size={26} color="#d4af37" strokeWidth={1.5} />
        </div>

        {mode === 'login' ? (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                Studio Login
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Welcome back. Access your B2B dashboard.
              </p>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 14px', color: '#fca5a5', fontSize: '0.83rem', marginBottom: '22px', animation: 'b2bShake 0.4s ease' }}>
                <AlertCircle size={15} />{error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '7px', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: '500', letterSpacing: '0.5px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(212,175,55,0.4)', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    required
                    style={inputStyle}
                    placeholder="studio@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={e => { e.target.style.borderColor = 'rgba(212,175,55,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(212,175,55,0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: '500', letterSpacing: '0.5px' }}>Password</label>
                  <button type="button" onClick={() => setMode('forgot')} style={{ background: 'none', border: 'none', color: '#d4af37', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={e => { e.target.style.borderColor = 'rgba(212,175,55,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(212,175,55,0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Gold CTA Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '15px 24px', marginTop: '6px',
                  background: loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #e6c867 0%, #d4af37 50%, #b8860b 100%)',
                  border: 'none', borderRadius: '14px',
                  color: loading ? 'rgba(255,255,255,0.5)' : '#1a0e00',
                  fontSize: '0.93rem', fontWeight: '700', fontFamily: 'inherit',
                  letterSpacing: '0.5px', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(212,175,55,0.5), inset 0 1px 0 rgba(255,255,255,0.4)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 24px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.3)'; }}
              >
                {loading ? 'Authenticating…' : 'Enter Dashboard'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.84rem' }}>
                New studio?{' '}
                <Link to="/signup" style={{ color: '#d4af37', fontWeight: '600', textDecoration: 'none' }}>
                  Partner With Us →
                </Link>
              </p>
            </div>
          </>
        ) : (
          /* ── Forgot Password Mode ── */
          <>
            <button type="button" onClick={() => setMode('login')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', cursor: 'pointer', marginBottom: '28px', fontFamily: 'inherit', padding: 0 }}>
              <ChevronLeft size={14} /> Back to login
            </button>

            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', color: '#fff', marginBottom: '10px' }}>Reset Access</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem', marginBottom: '28px' }}>Enter your registered WhatsApp number and we'll send an OTP.</p>

            {forgotSent && (
              <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '10px', padding: '12px 16px', color: '#4ade80', fontSize: '0.84rem', marginBottom: '20px', textAlign: 'center' }}>
                ✓ OTP sent to your WhatsApp!
              </div>
            )}

            <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '7px', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: '500' }}>WhatsApp Number</label>
                <div style={{ position: 'relative' }}>
                  <MessageCircle size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#25D366', pointerEvents: 'none' }} />
                  <input
                    type="tel"
                    required
                    style={{ ...inputStyle, borderColor: 'rgba(37,211,102,0.2)' }}
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onFocus={e => { e.target.style.borderColor = 'rgba(37,211,102,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,211,102,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(37,211,102,0.2)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
              <button type="submit" style={{ width: '100%', padding: '14px', background: '#25D366', border: 'none', borderRadius: '12px', color: '#000', fontWeight: '700', fontSize: '0.93rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <MessageCircle size={16} /> Send WhatsApp OTP
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes b2bShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
      `}</style>
    </div>
  );
};

export default B2BLogin;
