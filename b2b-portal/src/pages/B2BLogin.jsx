import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const B2BLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)' }}>
        <Logo size={45} />
      </header>
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="glass-panel fade-in" style={{ maxWidth: '400px', width: '100%', padding: '3rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>Studio Login</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem' }}>Welcome back to your workspace</p>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                style={{ paddingLeft: '1rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
              <input 
                type="password" 
                className="form-control" 
                required
                style={{ paddingLeft: '1rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}>
              Login to Workspace
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              New to WeddingAlbums.in? <br />
              <button onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', textDecoration: 'underline', marginTop: '0.5rem', fontWeight: 600 }}>Create Studio Account</button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default B2BLogin;
