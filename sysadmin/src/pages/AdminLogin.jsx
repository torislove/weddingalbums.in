import React, { useState, useEffect, useRef } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Terminal } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/* ── Falling data matrix columns ── */
const MatrixRain = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1);
    const chars = '01アイウエオカキクケコABCDEF0123456789';
    const draw = () => {
      ctx.fillStyle = 'rgba(0,6,15,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const opacity = Math.random() > 0.8 ? 0.8 : 0.2;
        ctx.fillStyle = `rgba(14,165,233,${opacity})`;
        ctx.fillText(char, i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }} />;
};

const AdminLogin = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  const [typedText, setTypedText] = useState('');

  const TYPEWRITER = 'SECURE OPERATIONS CENTER — AUTHORIZED ACCESS ONLY';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTypedText(TYPEWRITER.slice(0, i));
      i++;
      if (i > TYPEWRITER.length) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, portalRole: 'admin' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
      } else if (data.user?.role !== 'admin') {
        setError('ACCESS DENIED: Insufficient clearance level.');
      } else {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
      }
    } catch {
      setError('SYSTEM ERROR: Cannot reach server. Check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const inputSt = {
    width: '100%',
    padding: '12px 14px 12px 42px',
    background: 'rgba(14,165,233,0.04)',
    border: '1px solid rgba(14,165,233,0.15)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '0.9rem',
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.25s ease',
    letterSpacing: '0.5px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#00060f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <MatrixRain />

      {/* Glow overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14,165,233,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Top scanline bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #0ea5e9, #22d3ee, #0ea5e9, transparent)', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)', zIndex: 10 }} />

      <div style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: '460px' }}>

        {/* Status bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', padding: '10px 14px', background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee', animation: 'sysAdminBlink 1.5s infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(14,165,233,0.7)', letterSpacing: '1px' }}>SYSTEM ONLINE</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(14,165,233,0.5)', letterSpacing: '1px' }}>
            {time.toLocaleTimeString('en-IN', { hour12: false })}
          </span>
        </div>

        {/* Typewriter heading */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Terminal size={16} color="#0ea5e9" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(14,165,233,0.6)', letterSpacing: '2px' }}>{typedText}<span style={{ animation: 'sysAdminBlink 1s infinite', color: '#22d3ee' }}>_</span></span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Operations<br />
            <span style={{ background: 'linear-gradient(to right, #0ea5e9, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Control Center</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace" }}>
            weddingalbums.in / admin / auth
          </p>
        </div>

        {/* Shield badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.12)', borderRadius: '14px', marginBottom: '28px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(14,165,233,0.15)' }}>
            <Shield size={22} color="#0ea5e9" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '3px' }}>Admin Access Required</div>
            <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>Clearance Level: RESTRICTED</div>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 14px', color: '#fca5a5', fontSize: '0.82rem', marginBottom: '20px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.3px' }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>ERROR: {error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '7px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: 'rgba(14,165,233,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>// Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(14,165,233,0.4)', pointerEvents: 'none' }} />
              <input
                type="email"
                required
                style={inputSt}
                placeholder="admin@weddingalbums.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={e => { e.target.style.borderColor = 'rgba(14,165,233,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.07)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(14,165,233,0.15)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '7px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: 'rgba(14,165,233,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>// Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
              <input
                type={showPw ? 'text' : 'password'}
                required
                style={{ ...inputSt, paddingRight: '42px' }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={e => { e.target.style.borderColor = 'rgba(14,165,233,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.07)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(14,165,233,0.15)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px 20px', marginTop: '8px', background: loading ? 'rgba(14,165,233,0.15)' : 'linear-gradient(135deg, #0ea5e9, #0284c7)', border: 'none', borderRadius: '12px', color: loading ? 'rgba(255,255,255,0.3)' : '#fff', fontSize: '0.88rem', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1.5px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: loading ? 'none' : '0 8px 24px rgba(14,165,233,0.3)', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 14px 32px rgba(14,165,233,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 24px rgba(14,165,233,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? '> AUTHENTICATING...' : '> AUTHENTICATE'}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '1px' }}>
          UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;600;700&display=swap');
        @keyframes sysAdminBlink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
};

export default AdminLogin;
