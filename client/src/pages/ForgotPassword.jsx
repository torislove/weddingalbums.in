import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(5rem, 10vh, 7rem) 1.25rem 4rem' }}>
      <div className="glass-3d" style={{ width: '100%', maxWidth: '440px', padding: 'clamp(1.75rem, 4vw, 2.5rem)', borderRadius: '20px' }}>
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="font-serif text-white mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>Reset Password</h1>
              <p className="text-gray-400" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>Enter your email address and we'll send you a link to reset your password.</p>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-secondary)' }} size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-gold-3d"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                Send Reset Link <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link to="/login" style={{ fontSize: '0.875rem', color: '#aaa', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = '#D4AF37'} onMouseOut={e => e.currentTarget.style.color = '#aaa'}>
                ← Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <CheckCircle2 size={56} style={{ color: '#10b981', margin: '0 auto 1.25rem' }} />
            <h2 className="font-serif text-white mb-3" style={{ fontSize: '1.5rem' }}>Check your email</h2>
            <p className="text-gray-400 mb-6" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Link to="/login" className="btn btn-outline w-full">Return to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
