import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Users, MonitorPlay, ArrowLeft, Sparkles, Eye, EyeOff } from 'lucide-react';
import './PortalLogin.css';

const PortalLogin = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role');
  
  const [role, setRole] = useState(initialRole || null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', 
    phone: '', city: '', studioName: '', gstNumber: '', 
    coupleNames: '', weddingDate: '', portfolioLink: '', specialization: '' 
  });
  const [error, setError] = useState('');
  
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'b2b') navigate('/photographer');
      else if (user.role === 'b2c') navigate('/order');
      else if (user.role === 'editor') navigate('/editor');
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (isRegistering && !formData.name)) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      if (isRegistering) {
        await register({ ...formData, role });
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const renderExtraFields = () => {
    if (!isRegistering) return null;

    return (
      <div className="premium-extra-fields">
        <div className="form-group premium-input-group">
          <label>Phone Number <span className="req">*</span></label>
          <input type="tel" name="phone" required placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group premium-input-group">
          <label>City <span className="req">*</span></label>
          <input type="text" name="city" required placeholder="e.g. Hyderabad" value={formData.city} onChange={handleChange} />
        </div>

        {role === 'b2b' && (
          <>
            <div className="form-group premium-input-group">
              <label>Studio Name <span className="req">*</span></label>
              <input type="text" name="studioName" required placeholder="Dream Weddings Studio" value={formData.studioName} onChange={handleChange} />
            </div>
            <div className="form-group premium-input-group">
              <label>GST Number <span className="text-muted text-sm">(Optional)</span></label>
              <input type="text" name="gstNumber" placeholder="22AAAAA0000A1Z5" value={formData.gstNumber} onChange={handleChange} />
            </div>
          </>
        )}

        {role === 'b2c' && (
          <>
            <div className="form-group premium-input-group">
              <label>Couple Names <span className="req">*</span></label>
              <input type="text" name="coupleNames" required placeholder="Ram & Sita" value={formData.coupleNames} onChange={handleChange} />
            </div>
            <div className="form-group premium-input-group">
              <label>Wedding Date <span className="req">*</span></label>
              <input type="date" name="weddingDate" required value={formData.weddingDate} onChange={handleChange} />
            </div>
          </>
        )}

        {role === 'editor' && (
          <>
            <div className="form-group premium-input-group">
              <label>Portfolio Link <span className="req">*</span></label>
              <input type="url" name="portfolioLink" required placeholder="https://behance.net/portfolio" value={formData.portfolioLink} onChange={handleChange} />
            </div>
            <div className="form-group premium-input-group">
              <label>Specialization <span className="req">*</span></label>
              <select name="specialization" required value={formData.specialization} onChange={handleChange}>
                <option value="">Select Specialization</option>
                <option value="Color Grading">Color Grading</option>
                <option value="Photo Retouching">Photo Retouching</option>
                <option value="Album Designing">Album Designing</option>
                <option value="Video Editing">Video Editing</option>
              </select>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="premium-portal-container">
      {/* Background Ambience */}
      <div className="ambient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      
      {/* Floating Particles Overlay */}
      <div className="gold-dust-overlay"></div>

      <div className={`premium-portal-box ${isRegistering ? 'mode-register' : 'mode-login'}`}>
        {!role ? (
          <div className="role-selection-view fade-in-up">
            <div className="portal-header text-center">
              <h1 className="liquid-gold-text display-title">Welcome to the Portal</h1>
              <p className="portal-subtitle">Select your access level to enter the secure environment.</p>
            </div>
            
            <div className="premium-role-grid">
              <div className="premium-role-card" onClick={() => setRole('b2b')}>
                <div className="role-card-glow"></div>
                <div className="role-icon-wrapper">
                  <Camera size={36} strokeWidth={1.5} />
                </div>
                <h3>Studio Partner</h3>
                <p>Access your B2B dashboard to submit editing jobs and request premium album prints.</p>
                <div className="role-select-indicator">Select Portal</div>
              </div>

              <div className="premium-role-card" onClick={() => setRole('b2c')}>
                <div className="role-card-glow"></div>
                <div className="role-icon-wrapper">
                  <Users size={36} strokeWidth={1.5} />
                </div>
                <h3>Couple Access</h3>
                <p>Enter your private vault to select photos and review your album designs.</p>
                <div className="role-select-indicator">Select Portal</div>
              </div>

              <div className="premium-role-card" onClick={() => setRole('editor')}>
                <div className="role-card-glow"></div>
                <div className="role-icon-wrapper">
                  <MonitorPlay size={36} strokeWidth={1.5} />
                </div>
                <h3>Freelance Editor</h3>
                <p>Join our elite post-production team and claim available editing jobs.</p>
                <div className="role-select-indicator">Select Portal</div>
              </div>
            </div>
          </div>
        ) : (
          <form className="premium-form fade-in" onSubmit={handleSubmit}>
            <div className="form-header">
              <button type="button" className="back-link" onClick={() => { setRole(null); setIsRegistering(false); }}>
                <ArrowLeft size={16} /> Back to Portals
              </button>
              <div className="form-title-wrapper">
                <Sparkles className="title-icon" size={24} />
                <h2 className="liquid-gold-text">
                  {isRegistering ? 'Create Account' : 'Secure Login'}
                </h2>
              </div>
              <p className="role-badge">
                {role === 'b2b' && 'Studio Partner Portal'}
                {role === 'b2c' && 'Client Vault Portal'}
                {role === 'editor' && 'Freelancer Portal'}
              </p>
            </div>
            
            {error && <div className="premium-error-banner">{error}</div>}

            <div className="form-fields-container">
              {isRegistering && (
                <div className="form-group premium-input-group">
                  <label>Full Name / Contact Person <span className="req">*</span></label>
                  <input type="text" name="name" required placeholder="Your Name" value={formData.name} onChange={handleChange} />
                </div>
              )}
              
              <div className="form-group premium-input-group">
                <label>Email Address <span className="req">*</span></label>
                <input type="email" name="email" required placeholder="hello@example.com" value={formData.email} onChange={handleChange} />
              </div>

              <div className="form-group premium-input-group">
                <label>Password <span className="req">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} style={{ width: '100%', paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer', padding: 0 }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {renderExtraFields()}
            </div>

            <div className="form-actions-wrapper">
              <button type="submit" className="liquid-gold-button">
                <span className="btn-text">{isRegistering ? 'Enter Portal' : 'Authenticate'}</span>
                <span className="btn-shimmer"></span>
              </button>

              <div className="auth-switch">
                <span className="text-muted">
                  {isRegistering ? 'Already have access? ' : "Need to request access? "}
                </span>
                <button type="button" className="text-gold-link" onClick={() => setIsRegistering(!isRegistering)}>
                  {isRegistering ? 'Login here' : 'Register here'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PortalLogin;
