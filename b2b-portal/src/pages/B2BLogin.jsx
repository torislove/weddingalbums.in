import React, { useState } from 'react';
import { Shield, ArrowRight, Zap, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GoldenParticles from '../components/GoldenParticles';

const B2BLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
      <GoldenParticles count={50} color="212, 175, 55" />
      
      {/* Left Side: Landing / Explanation */}
      <div style={{ flex: 1, padding: '4rem 6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>
        <div className="fade-in" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '50px', marginBottom: '2rem' }}>
            <span className="liquid-gold-text" style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>WeddingAlbums.in For Studios</span>
          </div>
          
          <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 300 }}>
            Scale Your Studio.<br />
            <span className="liquid-gold-text" style={{ fontWeight: 600 }}>Zero Bottlenecks.</span>
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '3rem', lineHeight: 1.6 }}>
            The ultimate white-label post-production engine for premium photographers in Andhra Pradesh & Telangana. Drop your raw files, we deliver the magic.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <Clock size={20} color="var(--gold-primary)" />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>48-Hour SLA</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Guaranteed delivery times or we credit your wallet.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <Zap size={20} color="var(--gold-primary)" />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>Smart Proxy Upload</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Culling starts instantly while high-res uploads in background.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <TrendingUp size={20} color="var(--gold-primary)" />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>Wholesale Pricing</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Up to 30% lower costs than freelance editors.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <CheckCircle size={20} color="var(--gold-primary)" />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>White-Label Shipping</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Direct-to-client album shipping with your branding.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div style={{ flex: '0 0 500px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', zIndex: 10, background: 'linear-gradient(90deg, transparent 0%, rgba(10,10,12,0.8) 100%)' }}>
        <div className="glass-panel fade-in" style={{ width: '100%', padding: '3rem', animationDelay: '0.4s', background: 'rgba(28, 28, 33, 0.6)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Shield size={24} color="var(--gold-primary)" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 500 }}>Partner Portal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Secure access to your studio backend.</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'var(--text-secondary)' }}>Studio Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="hello@yourstudio.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--gold-primary)' }} /> Remember me
              </label>
              <a href="#" style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', textDecoration: 'none', transition: 'opacity 0.2s' }}>Forgot password?</a>
            </div>
            
            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
              Initialize Workspace <ArrowRight size={18} />
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Want to become a partner? <br/>
              <button type="button" onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 500, textDecoration: 'underline', marginTop: '0.5rem', display: 'inline-block', cursor: 'pointer' }}>Apply for a Studio Account</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BLogin;
