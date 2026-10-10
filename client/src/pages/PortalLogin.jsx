import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Camera, Users, ChevronRight, ArrowLeft,
  Mail, Lock, Eye, EyeOff, AlertCircle, Heart, Palette,
  Phone, KeyRound, CheckCircle2, X, RefreshCw
} from 'lucide-react';
import './PortalLogin.css';

const PortalLogin = () => {
  const [searchParams] = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'phone_otp' | 'email_otp'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    phone: '', city: '',
    coupleNames: '', weddingDate: '',
    otpCode: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const { 
    login, 
    register, 
    loginWithOtp, 
    loginWithGoogle, 
    sendOtp, 
    forgotPassword, 
    resetPassword, 
    user, 
    loading: authLoading, 
    loginAsGuest 
  } = useAuth();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'b2c' || user.role === 'admin' || user.role === 'sysadmin') {
        navigate('/client');
      }
    }
  }, [user, authLoading, navigate]);

  // OTP Countdown timer
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  // Trigger Send OTP for Login
  const handleSendOtp = async () => {
    setError('');
    const target = loginMethod === 'phone_otp' ? formData.phone : formData.email;
    const type = loginMethod === 'phone_otp' ? 'phone' : 'email';

    if (!target) {
      setError(`Please enter your ${type === 'phone' ? 'phone number' : 'email address'} first.`);
      return;
    }

    setLoading(true);
    try {
      await sendOtp(target, type, 'login');
      setOtpSent(true);
      setOtpTimer(60);
      setSuccessMsg(`Verification code sent to your ${type === 'phone' ? 'phone' : 'email'}!`);
    } catch (err) {
      setError(err.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Registration Flow
    if (isRegistering) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill out all required fields.');
        return;
      }
      setLoading(true);
      try {
        await register({ ...formData, role: 'b2c' });
      } catch (err) {
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Login Flows
    setLoading(true);
    try {
      if (loginMethod === 'password') {
        if (!formData.email || !formData.password) {
          throw new Error('Please enter both your email and password.');
        }
        await login(formData.email, formData.password);
      } else {
        const target = loginMethod === 'phone_otp' ? formData.phone : formData.email;
        if (!target || !formData.otpCode) {
          throw new Error('Please enter the target and the 6-digit OTP code.');
        }
        await loginWithOtp(target, formData.otpCode);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  // One-Click Google Login
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 1 (Send OTP)
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail) {
      setForgotError('Please enter your registered email address.');
      return;
    }

    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotStep(2);
      setForgotSuccess('A password reset code has been sent to your email.');
    } catch (err) {
      setForgotError(err.message || 'Failed to send password reset code.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot Password: Step 2 (Reset Password)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotOtp || !forgotNewPassword) {
      setForgotError('Please enter the reset code and your new password.');
      return;
    }

    if (forgotNewPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }

    setForgotLoading(true);
    try {
      await resetPassword(forgotEmail, forgotOtp, forgotNewPassword);
      setForgotSuccess('Password reset successfully! You can now log in.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setFormData(prev => ({ ...prev, email: forgotEmail }));
        setSuccessMsg('Password updated! Please log in with your new password.');
      }, 1500);
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="cpl-root">
      {/* ── Left Visual Panel ── */}
      <div className="cpl-visual">
        <div className="cpl-visual-bg" />

        <div className="cpl-orbs">
          <div className="cpl-orb" />
          <div className="cpl-orb" />
          <div className="cpl-orb" />
        </div>

        <div className="cpl-visual-content">
          <div className="cpl-brand">
            <div className="cpl-brand-dot">💍</div>
            <span className="cpl-brand-name">WeddingAlbums.in</span>
          </div>

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
          <div className="cpl-auth-screen">

            {/* Top Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="cpl-back-btn" type="button" style={{ margin: 0 }}>
                  <ArrowLeft size={14} /> Back to website
                </button>
              </Link>
              <button 
                className="cpl-back-btn" 
                type="button" 
                style={{ margin: 0, color: '#d4af37' }} 
                onClick={() => { loginAsGuest(); navigate('/client'); }}
              >
                Skip for now <ChevronRight size={14} />
              </button>
            </div>

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

            {/* Login / Register main tabs */}
            <div className="cpl-tabs">
              <button
                type="button"
                className={`cpl-tab${!isRegistering ? ' active' : ''}`}
                onClick={() => { setIsRegistering(false); setError(''); setSuccessMsg(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`cpl-tab${isRegistering ? ' active' : ''}`}
                onClick={() => { setIsRegistering(true); setError(''); setSuccessMsg(''); }}
              >
                Create Account
              </button>
            </div>

            {/* Login Method Sub-Tabs (Password vs Phone OTP vs Email OTP) */}
            {!isRegistering && (
              <div className="cpl-method-tabs">
                <button
                  type="button"
                  className={`cpl-method-tab${loginMethod === 'password' ? ' active' : ''}`}
                  onClick={() => { setLoginMethod('password'); setError(''); }}
                >
                  <Lock size={13} /> Password
                </button>
                <button
                  type="button"
                  className={`cpl-method-tab${loginMethod === 'phone_otp' ? ' active' : ''}`}
                  onClick={() => { setLoginMethod('phone_otp'); setError(''); }}
                >
                  <Phone size={13} /> Phone OTP
                </button>
                <button
                  type="button"
                  className={`cpl-method-tab${loginMethod === 'email_otp' ? ' active' : ''}`}
                  onClick={() => { setLoginMethod('email_otp'); setError(''); }}
                >
                  <Mail size={13} /> Email OTP
                </button>
              </div>
            )}

            {/* Feedback Banners */}
            {error && (
              <div className="cpl-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {successMsg && (
              <div className="cpl-success">
                <CheckCircle2 size={16} />
                {successMsg}
              </div>
            )}

            {/* Google One-Click Login */}
            {!isRegistering && (
              <>
                <button 
                  type="button" 
                  className="cpl-google-btn" 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="cpl-divider-or">or with credentials</div>
              </>
            )}

            {/* Primary Form */}
            <form className="cpl-form" onSubmit={handleSubmit}>
              
              {/* Registration: Full Name */}
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

              {/* Password Login or Email Registration or Email OTP */}
              {(isRegistering || loginMethod === 'password' || loginMethod === 'email_otp') && (
                <div className="cpl-field">
                  <label className="cpl-label">Email Address <span className="req">*</span></label>
                  <div className={!isRegistering && loginMethod === 'email_otp' ? "cpl-otp-row" : "cpl-input-wrap"}>
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
                    {!isRegistering && loginMethod === 'email_otp' && (
                      <button
                        type="button"
                        className="cpl-btn-secondary"
                        onClick={handleSendOtp}
                        disabled={loading || otpTimer > 0}
                      >
                        {otpTimer > 0 ? `${otpTimer}s` : (otpSent ? 'Resend' : 'Send Code')}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Phone OTP Login */}
              {!isRegistering && loginMethod === 'phone_otp' && (
                <div className="cpl-field">
                  <label className="cpl-label">Phone Number <span className="req">*</span></label>
                  <div className="cpl-otp-row">
                    <div className="cpl-input-wrap">
                      <Phone size={16} />
                      <input
                        className="cpl-input"
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                      />
                    </div>
                    <button
                      type="button"
                      className="cpl-btn-secondary"
                      onClick={handleSendOtp}
                      disabled={loading || otpTimer > 0}
                    >
                      {otpTimer > 0 ? `${otpTimer}s` : (otpSent ? 'Resend' : 'Send OTP')}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Code Input (when logging in with Phone or Email OTP) */}
              {!isRegistering && (loginMethod === 'phone_otp' || loginMethod === 'email_otp') && (
                <div className="cpl-field">
                  <label className="cpl-label">6-Digit Verification Code <span className="req">*</span></label>
                  <div className="cpl-input-wrap">
                    <KeyRound size={16} />
                    <input
                      className="cpl-input"
                      type="text"
                      name="otpCode"
                      maxLength={6}
                      required
                      placeholder="Enter 6-digit OTP"
                      value={formData.otpCode}
                      onChange={handleChange}
                      style={{ letterSpacing: '4px', fontWeight: 600 }}
                    />
                  </div>
                </div>
              )}

              {/* Password Input (for Password login or registration) */}
              {(isRegistering || loginMethod === 'password') && (
                <div className="cpl-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="cpl-label">Password <span className="req">*</span></label>
                    {!isRegistering && (
                      <button 
                        type="button" 
                        onClick={() => { setShowForgotModal(true); setForgotStep(1); setForgotError(''); }}
                        style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: '#d4af37', cursor: 'pointer', padding: 0 }}
                      >
                        Forgot password?
                      </button>
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
              )}

              {/* Extra registration details */}
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
                          placeholder="Priya & Rahul"
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
                          placeholder="Hyderabad / Vijayawada"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="cpl-submit"
                disabled={loading}
                style={{ marginTop: '8px' }}
              >
                {loading
                  ? 'Verifying…'
                  : (isRegistering
                      ? 'Enter Your Vault'
                      : (loginMethod === 'password' ? 'Sign In' : 'Verify & Enter Vault'))}
              </button>
            </form>

            {/* Switch between Sign In / Register */}
            <div className="cpl-switch">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => { setIsRegistering(v => !v); setError(''); setSuccessMsg(''); }}
              >
                {isRegistering ? 'Sign in' : 'Register here'}
              </button>
            </div>

            {/* Other Portals Links */}
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

      {/* ── Forgot Password Modal ── */}
      {showForgotModal && (
        <div className="cpl-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="cpl-modal-card" onClick={e => e.stopPropagation()}>
            <button className="cpl-modal-close" onClick={() => setShowForgotModal(false)}>
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                <KeyRound size={22} />
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#fff', fontSize: '1.25rem', fontFamily: "'Cormorant Garamond', serif" }}>
                Reset Your Password
              </h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                {forgotStep === 1 
                  ? 'Enter your registered email to receive a 6-digit verification code.' 
                  : 'Enter the verification code and choose your new password.'}
              </p>
            </div>

            {forgotError && (
              <div className="cpl-error" style={{ marginBottom: '16px' }}>
                <AlertCircle size={15} />
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="cpl-success" style={{ marginBottom: '16px' }}>
                <CheckCircle2 size={15} />
                {forgotSuccess}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleSendForgotOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="cpl-field">
                  <label className="cpl-label">Registered Email</label>
                  <div className="cpl-input-wrap">
                    <Mail size={16} />
                    <input
                      className="cpl-input"
                      type="email"
                      required
                      placeholder="hello@example.com"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="cpl-submit"
                  disabled={forgotLoading}
                  style={{ marginTop: '10px' }}
                >
                  {forgotLoading ? 'Sending Code…' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="cpl-field">
                  <label className="cpl-label">6-Digit Verification Code</label>
                  <div className="cpl-input-wrap">
                    <KeyRound size={16} />
                    <input
                      className="cpl-input"
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Enter 6-digit code"
                      value={forgotOtp}
                      onChange={e => setForgotOtp(e.target.value)}
                      style={{ letterSpacing: '4px', fontWeight: 600 }}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="cpl-field">
                  <label className="cpl-label">New Password</label>
                  <div className="cpl-input-wrap">
                    <Lock size={16} />
                    <input
                      className="cpl-input"
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={forgotNewPassword}
                      onChange={e => setForgotNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="cpl-submit"
                  disabled={forgotLoading}
                  style={{ marginTop: '10px' }}
                >
                  {forgotLoading ? 'Updating Password…' : 'Reset Password & Proceed'}
                </button>

                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center', marginTop: '6px' }}
                >
                  ← Back to email
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default PortalLogin;
