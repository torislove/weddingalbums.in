import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Camera, Users, ChevronRight, ArrowLeft,
  Mail, Lock, Eye, EyeOff, AlertCircle, Heart, Palette
} from 'lucide-react';
import './PortalLogin.css';

const ROLE_CONFIG = {
  b2c: {
    label: 'Couple Access',
    badge: '💑 Client Vault',
    description: 'View your album designs, approve proofs and track your order.',
    icon: Heart,
    color: '#d4af37',
  },
};

const PortalLogin = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role');

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    phone: '', city: '',
    coupleNames: '', weddingDate: '',
  });
  const [error, setError] = useState('');

  const { login, register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'b2c' || user.role === 'admin') navigate('/client');
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }
    if (isRegistering && !formData.name) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await register({ ...formData, role: 'b2c' });
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cpl-root">
      {/* ── Left Visual Panel ── */}
      <div className="cpl-visual">
        <div className="cpl-visual-bg" />

        {/* Bokeh orbs */}
        <div className="cpl-orbs">
          <div className="cpl-orb" />
          <div className="cpl-orb" />
          <div className="cpl-orb" />
        </div>

        <div className="cpl-visual-content">
          {/* Brand */}
          <div className="cpl-brand">
            <div className="cpl-brand-dot">💍</div>
            <span className="cpl-brand-name">WeddingAlbums.in</span>
          </div>

          {/* Tagline */}
          <div className="cpl-tagline-block">
            <h2>
              Your wedding,<br />
              <em>preserved forever.</em>
            </h2>
            <p>
              Access your private vault to view proofs, approve layouts
              and track your album from design to delivery.
            </p>
            <div className="cpl-divider-lines">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="cpl-form-panel">
        <div className="cpl-form-inner">
          {/* Auth Form — B2C only */}
          <div className="cpl-auth-screen">

            {/* Back to site link */}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button className="cpl-back-btn" type="button">
                <ArrowLeft size={14} /> Back to website
              </button>
            </Link>

            <div className="cpl-auth-header">
              <div className="cpl-portal-badge">
                <Heart size={12} /> Client Portal
              </div>
              <h2>{isRegistering ? 'Create Your Vault' : 'Welcome Back'}</h2>
              <p>
                {isRegistering
                  ? 'Set up your account to access your wedding album journey.'
                  : 'Sign in to view your album proofs and order status.'}
              </p>
            </div>

            {/* Login / Register tabs */}
            <div className="cpl-tabs">
              <button
                type="button"
                className={`cpl-tab${!isRegistering ? ' active' : ''}`}
                onClick={() => { setIsRegistering(false); setError(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`cpl-tab${isRegistering ? ' active' : ''}`}
                onClick={() => { setIsRegistering(true); setError(''); }}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="cpl-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form className="cpl-form" onSubmit={handleSubmit}>
              {isRegistering && (
                <div className="cpl-field">
                  <label className="cpl-label">Full Name <span className="req">*</span></label>
                  <div className="cpl-input-wrap">
                    <Users size={16} />
                    <input
                      className="cpl-input"
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div className="cpl-field">
                <label className="cpl-label">Email Address <span className="req">*</span></label>
                <div className="cpl-input-wrap">
                  <Mail size={16} />
                  <input
                    className="cpl-input"
                    type="email"
                    name="email"
                    required
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="cpl-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="cpl-label">Password <span className="req">*</span></label>
                  {!isRegistering && (
                    <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#d4af37', textDecoration: 'none' }}>
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="cpl-input-wrap">
                  <Lock size={16} />
                  <input
                    className="cpl-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete={isRegistering ? 'new-password' : 'current-password'}
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    className="cpl-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Extra fields on register */}
              {isRegistering && (
                <>
                  <div className="cpl-extra-divider" />
                  <div className="cpl-field-grid">
                    <div className="cpl-field">
                      <label className="cpl-label">Couple Names <span className="req">*</span></label>
                      <div className="cpl-input-wrap">
                        <Heart size={16} />
                        <input
                          className="cpl-input"
                          type="text"
                          name="coupleNames"
                          required
                          placeholder="Ram & Sita"
                          value={formData.coupleNames}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="cpl-field">
                      <label className="cpl-label">Wedding Date <span className="req">*</span></label>
                      <div className="cpl-input-wrap">
                        <input
                          className="cpl-input"
                          style={{ paddingLeft: '14px' }}
                          type="date"
                          name="weddingDate"
                          required
                          value={formData.weddingDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="cpl-field">
                      <label className="cpl-label">Phone Number</label>
                      <div className="cpl-input-wrap">
                        <input
                          className="cpl-input"
                          style={{ paddingLeft: '14px' }}
                          type="tel"
                          name="phone"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="cpl-field">
                      <label className="cpl-label">City</label>
                      <div className="cpl-input-wrap">
                        <input
                          className="cpl-input"
                          style={{ paddingLeft: '14px' }}
                          type="text"
                          name="city"
                          placeholder="Hyderabad"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="cpl-submit"
                disabled={loading}
                style={{ marginTop: '8px' }}
              >
                {loading
                  ? (isRegistering ? 'Creating Account…' : 'Signing in…')
                  : (isRegistering ? 'Enter Your Vault' : 'Sign In')}
              </button>
            </form>

            <div className="cpl-switch">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => { setIsRegistering(v => !v); setError(''); }}
              >
                {isRegistering ? 'Sign in' : 'Register here'}
              </button>
            </div>

            {/* Redirect hints for other portals */}
            <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>Other Portals</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="http://localhost:5174" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                >
                  <Camera size={14} /> Photographer Studio Portal
                </a>
                <a href="http://localhost:5175" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                >
                  <Palette size={14} /> Editor &amp; Creator Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
