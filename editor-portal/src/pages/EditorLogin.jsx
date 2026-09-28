import React, { useState } from 'react';
import { Scissors, ArrowRight, IndianRupee, Layers, ShieldCheck, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GoldenParticles from '../components/GoldenParticles';

const EditorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
      <GoldenParticles count={50} color="99, 102, 241" />
      
      {/* Left Side: Landing / Explanation */}
      <div style={{ flex: 1, padding: '4rem 6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>
        <div className="fade-in" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '50px', marginBottom: '2rem' }}>
            <span style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>WeddingAlbums.in Creators</span>
          </div>
          
          <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 300 }}>
            Edit on your terms.<br />
            <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Get paid instantly.</span>
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '3rem', lineHeight: 1.6 }}>
            Join the elite network of Photo, Video, and Album editors. Claim jobs that match your skills, maintain your rating, and withdraw earnings directly to UPI.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <IndianRupee size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>1-Click UPI Payouts</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Withdraw your earnings directly to GPay or PhonePe every Friday.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <Layers size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>Specialized Workspaces</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tailored UI for DaVinci Resolve, Premiere Pro, and Lightroom workflows.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <Target size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>Gamified Growth</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Maintain a >4.8 star rating to unlock 'Premium Pay' assignments.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <ShieldCheck size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>Automated QA</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Smart checklists ensure you hit client requirements before submission.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div style={{ flex: '0 0 500px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', zIndex: 10, background: 'linear-gradient(90deg, transparent 0%, rgba(10,10,12,0.8) 100%)' }}>
        <div className="glass-panel fade-in" style={{ width: '100%', padding: '3rem', animationDelay: '0.4s', background: 'rgba(19, 19, 34, 0.6)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Scissors size={24} color="var(--accent-primary)" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 500 }}>Creators Hub</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Enter your editor workspace.</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Editor Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="creator@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '2rem' }}>
              Load Workspace <ArrowRight size={18} />
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Want to join our editor network? <br/>
              <a href="#" style={{ color: 'var(--accent-primary)', fontWeight: 500, textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>Take the Assessment Test</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLogin;
