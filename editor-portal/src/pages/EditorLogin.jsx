import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Scissors, Video, BookOpen, Zap } from 'lucide-react';
import Logo from '../components/Logo';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/* ── Animated grid background ── */
const GridBackground = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
    {/* Base gradient */}
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 0%, rgba(129,140,248,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(192,132,252,0.08) 0%, transparent 60%), #050510' }} />

    {/* Animated blueprint grid */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#818cf8" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid-big" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#818cf8" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#grid-big)" />
    </svg>

    {/* Glow orbs */}
    <div style={{ position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'edOrb1 15s infinite ease-in-out alternate' }} />
    <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.07) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'edOrb2 18s infinite ease-in-out alternate' }} />

    {/* Floating skill tags */}
    {[
      { text: 'Color Grade', icon: '🎨', x: '5%', y: '15%', delay: '0s' },
      { text: 'Album Design', icon: '📖', x: '75%', y: '8%', delay: '1.5s' },
      { text: 'Video Edit', icon: '🎬', x: '8%', y: '72%', delay: '3s' },
      { text: 'Photo Retouch', icon: '✨', x: '68%', y: '80%', delay: '4.5s' },
    ].map((tag, i) => (
      <div key={i} style={{
        position: 'absolute',
        left: tag.x, top: tag.y,
        background: 'rgba(129,140,248,0.08)',
        border: '1px solid rgba(129,140,248,0.15)',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '0.72rem',
        color: 'rgba(129,140,248,0.5)',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '500',
        animation: `edFloat 6s ${tag.delay} infinite ease-in-out`,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'none',
        backdropFilter: 'blur(4px)',
      }}>
        {tag.icon} {tag.text}
      </div>
    ))}

    <style>{`
      @keyframes edOrb1 { from { transform: translate(0,0) scale(1); } to { transform: translate(4%,6%) scale(1.15); } }
      @keyframes edOrb2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-3%,-5%) scale(1.1); } }
      @keyframes edFloat { 0%,100%{ transform:translateY(0); opacity:0.6; } 50%{ transform:translateY(-12px); opacity:1; } }
    `}</style>
  </div>
);

const SPECIALIZATIONS = [
  { label: 'Photo Culling & Retouching', icon: Scissors, color: '#3b82f6' },
  { label: 'Video Editing & Films', icon: Video, color: '#ec4899' },
  { label: 'Album Layout Design', icon: BookOpen, color: '#eab308' },
];

const EditorLogin = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, portalRole: 'editor' }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.user?.role !== 'editor' && data.user?.role !== 'admin') {
          setError('Access denied. This portal is for Editors only.');
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, phone, city, portfolioLink, specialization, role: 'editor' }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const inputSt = (accentColor = '#818cf8') => ({
    width: '100%',
    padding: '13px 14px 13px 44px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(129,140,248,0.15)',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontSize: '0.93rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.25s ease',
  });

  const focusBind = (accent = 'rgba(129,140,248,0.5)', glow = 'rgba(129,140,248,0.08)') => ({
    onFocus: e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${glow}`; },
    onBlur:  e => { e.target.style.borderColor = 'rgba(129,140,248,0.15)'; e.target.style.boxShadow = 'none'; },
  });

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', boxSizing: 'border-box' }}>
      <GridBackground />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '480px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
            <Logo size={42} />
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '20px', padding: '6px 16px' }}>
            <Zap size={12} color="#818cf8" />
            <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#818cf8' }}>Creator Portal</span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(10,10,30,0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(129,140,248,0.15)',
          borderRadius: '24px',
          padding: '40px 36px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 40px rgba(129,140,248,0.05), inset 0 1px 0 rgba(129,140,248,0.1)',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '30px', gap: '4px' }}>
            {['Login', 'Join Network'].map((t, i) => {
              const active = isRegister === (i === 1);
              return (
                <button key={t} type="button" onClick={() => { setIsRegister(i === 1); setError(''); }} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '9px', fontFamily: 'inherit', fontSize: '0.87rem', fontWeight: active ? '600' : '400', cursor: 'pointer', transition: 'all 0.3s ease', background: active ? 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(192,132,252,0.1))' : 'none', color: active ? '#818cf8' : 'rgba(255,255,255,0.3)', boxShadow: active ? 'inset 0 1px 0 rgba(129,140,248,0.2)' : 'none' }}>
                  {t}
                </button>
              );
            })}
          </div>

          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '700', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              {isRegister ? 'Join the Network' : 'Creator Login'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.87rem' }}>
              {isRegister ? 'Apply to join our elite post-production team.' : 'Access your editing workspace.'}
            </p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '11px 14px', color: '#fca5a5', fontSize: '0.83rem', marginBottom: '20px' }}>
              <AlertCircle size={14} />{error}
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isRegister && (
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.35)', fontSize: '0.77rem', fontWeight: '500', letterSpacing: '0.5px' }}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', pointerEvents: 'none' }}>👤</span>
                  <input type="text" required style={inputSt()} placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} {...focusBind()} />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.35)', fontSize: '0.77rem', fontWeight: '500', letterSpacing: '0.5px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(129,140,248,0.4)', pointerEvents: 'none' }} />
                <input type="email" required style={inputSt()} placeholder="creator@example.com" value={email} onChange={e => setEmail(e.target.value)} {...focusBind()} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.77rem', fontWeight: '500', letterSpacing: '0.5px' }}>Password</label>
                {!isRegister && <button type="button" style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.77rem', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Forgot?</button>}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                <input type={showPw ? 'text' : 'password'} required style={{ ...inputSt(), paddingRight: '44px' }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} {...focusBind()} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Registration extras */}
            {isRegister && (
              <>
                <div style={{ height: '1px', background: 'rgba(129,140,248,0.1)', margin: '4px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.35)', fontSize: '0.77rem', fontWeight: '500' }}>Phone</label>
                    <input type="tel" style={{ ...inputSt(), paddingLeft: '14px' }} placeholder="+91 ..." value={phone} onChange={e => setPhone(e.target.value)} {...focusBind()} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.35)', fontSize: '0.77rem', fontWeight: '500' }}>City</label>
                    <input type="text" style={{ ...inputSt(), paddingLeft: '14px' }} placeholder="Hyderabad" value={city} onChange={e => setCity(e.target.value)} {...focusBind()} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.35)', fontSize: '0.77rem', fontWeight: '500' }}>Portfolio Link *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', pointerEvents: 'none' }}>🔗</span>
                    <input type="url" required style={inputSt()} placeholder="behance.net/your-work" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} {...focusBind()} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.35)', fontSize: '0.77rem', fontWeight: '500' }}>Specialization *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {SPECIALIZATIONS.map(s => (
                      <button key={s.label} type="button" onClick={() => setSpecialization(s.label)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', background: specialization === s.label ? `rgba(${s.color.replace('#','').match(/../g).map(x=>parseInt(x,16)).join(',')},0.12)` : 'rgba(255,255,255,0.03)', border: `1px solid ${specialization === s.label ? s.color + '55' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', color: specialization === s.label ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: specialization === s.label ? '500' : '400', transition: 'all 0.2s ease' }}>
                        <s.icon size={15} color={specialization === s.label ? s.color : 'currentColor'} />
                        {s.label}
                        {specialization === s.label && <span style={{ marginLeft: 'auto', color: s.color, fontSize: '12px' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CTA Button */}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px 24px', marginTop: '8px', background: loading ? 'rgba(129,140,248,0.2)' : 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #c084fc 100%)', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '0.93rem', fontWeight: '700', fontFamily: 'inherit', letterSpacing: '0.5px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(99,102,241,0.5)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)'; }}
            >
              {loading ? 'Please wait…' : (isRegister ? 'Apply to Network' : 'Enter Workspace')}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.83rem' }}>
          {isRegister ? 'Already in the network?' : "Want to join our editor network?"}
          <button type="button" onClick={() => { setIsRegister(v => !v); setError(''); }} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', marginLeft: '5px' }}>
            {isRegister ? 'Sign in here' : 'Apply here →'}
          </button>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');`}</style>
    </div>
  );
};

export default EditorLogin;
