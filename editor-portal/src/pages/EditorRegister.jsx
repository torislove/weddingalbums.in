import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, MapPin, Upload, Briefcase, ChevronRight, ChevronLeft, CheckCircle, Smartphone, User, MonitorPlay, Key, Mail, Calendar, Video, Image, Play, Edit3 } from 'lucide-react';
import Logo from '../components/Logo';
import GoldenParticles from '../components/GoldenParticles';

const EditorRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    phone: '',
    email: '',
    password: '',
    dob: '',
    // Step 2
    city: '',
    pincode: '',
    availability: 'Full-time',
    // Step 3
    specialty: 'Video Editing',
    software: 'Premiere Pro',
    experience: '1-2 years',
    portfolio: '',
    // Step 4
    agreedToTrial: false
  });

  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        
        if (data && data.address) {
          setFormData(prev => ({
            ...prev,
            city: data.address.city || data.address.state_district || '',
            pincode: data.address.postcode || ''
          }));
        }
      } catch (err) {
        console.error("Error fetching location", err);
      } finally {
        setLoadingLocation(false);
      }
    }, () => {
      setLoadingLocation(false);
      alert("Unable to retrieve your location");
    });
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedToTrial) {
      alert("Please agree to the trial terms.");
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: 'editor',
          phone: formData.phone,
          city: formData.city,
          specialization: formData.specialty,
          portfolioLink: formData.portfolio
        })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const nextDisabled = () => {
    if (step === 1) return !formData.fullName || !formData.phone || !formData.email || !formData.password || !formData.dob;
    if (step === 2) return !formData.city || !formData.pincode;
    if (step === 4) return !formData.agreedToTrial;
    return false;
  };

  // Helper for animated inputs
  const onFocusStyle = e => {
    e.target.style.borderColor = 'var(--accent-primary)';
    e.target.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.3)';
  };
  const onBlurStyle = e => {
    e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)';
    e.target.style.boxShadow = 'none';
  };

  const specialtyIcons = {
    'Video Editing': <Video size={20} />,
    'Photo Culling': <Image size={20} />,
    'Album Design': <Briefcase size={20} />
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Particles matched to Creator theme */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.4 }}>
        <GoldenParticles count={50} color="99, 102, 241" />
      </div>

      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)', zIndex: 1 }}>
        <Link to="/">
          <Logo size={45} />
        </Link>
      </header>
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', zIndex: 1 }}>
        <div className="glass-panel fade-in" style={{ maxWidth: '800px', width: '100%', padding: '3rem', borderRadius: '24px', background: 'rgba(20, 20, 35, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>Join the Creator Network</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Step {step} of 4: {
              step === 1 ? "Personal Details" : 
              step === 2 ? "Location & Availability" :
              step === 3 ? "Skills & Tools" : "Assessment Agreement"
            }</p>
            
            {/* Animated Progress Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ 
                  height: '6px', 
                  width: '50px', 
                  borderRadius: '3px', 
                  background: i <= step ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                  boxShadow: i === step ? '0 0 10px var(--accent-primary)' : 'none',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              ))}
            </div>
          </div>
          
          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} style={{ minHeight: '320px' }}>
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="fade-in" style={{ display: 'grid', gap: '1.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                    <div className="input-group" style={{ position: 'relative' }}>
                      <User size={18} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                      <input 
                        type="text" 
                        className="form-control" 
                        style={{ paddingLeft: '2.8rem', border: '1px solid rgba(99, 102, 241, 0.3)', transition: 'all 0.3s' }} 
                        placeholder="E.g. Rahul Kumar" 
                        required 
                        value={formData.fullName} 
                        onChange={e => setFormData({...formData, fullName: e.target.value})} 
                        onFocus={onFocusStyle}
                        onBlur={onBlurStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Date of Birth</label>
                    <div className="input-group" style={{ position: 'relative' }}>
                      <Calendar size={18} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                      <input 
                        type="date" 
                        className="form-control" 
                        style={{ paddingLeft: '2.8rem', border: '1px solid rgba(99, 102, 241, 0.3)', transition: 'all 0.3s', colorAdjust: 'exact' }} 
                        required 
                        value={formData.dob} 
                        onChange={e => setFormData({...formData, dob: e.target.value})} 
                        onFocus={onFocusStyle}
                        onBlur={onBlurStyle}
                      />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>You must be 18+ to join.</p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>WhatsApp Number</label>
                    <div className="input-group" style={{ position: 'relative' }}>
                      <Smartphone size={18} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                      <input 
                        type="tel" 
                        className="form-control" 
                        style={{ paddingLeft: '2.8rem', border: '1px solid rgba(99, 102, 241, 0.3)', transition: 'all 0.3s' }} 
                        placeholder="+91" 
                        required 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        onFocus={onFocusStyle}
                        onBlur={onBlurStyle}
                      />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Mandatory for quick job updates.</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
                    <div className="input-group" style={{ position: 'relative' }}>
                      <Mail size={18} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                      <input 
                        type="email" 
                        className="form-control" 
                        style={{ paddingLeft: '2.8rem', border: '1px solid rgba(99, 102, 241, 0.3)', transition: 'all 0.3s' }} 
                        placeholder="creator@example.com" 
                        required 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        onFocus={onFocusStyle}
                        onBlur={onBlurStyle}
                      />
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
                    <div className="input-group" style={{ position: 'relative' }}>
                      <Key size={18} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                      <input 
                        type="password" 
                        className="form-control" 
                        style={{ paddingLeft: '2.8rem', border: '1px solid rgba(99, 102, 241, 0.3)', transition: 'all 0.3s' }} 
                        placeholder="Create a password" 
                        required 
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                        onFocus={onFocusStyle}
                        onBlur={onBlurStyle}
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="fade-in" style={{ display: 'grid', gap: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                  <label style={{ color: 'var(--text-secondary)', margin: 0 }}>Location Details</label>
                  <button type="button" onClick={handleAutoLocation} disabled={loadingLocation} style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', transition: 'all 0.3s', boxShadow: loadingLocation ? '0 0 15px rgba(99,102,241,0.5)' : 'none' }}>
                    <MapPin size={16} />
                    {loadingLocation ? 'Detecting...' : 'Auto-detect Location'}
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <input type="text" className="form-control" style={{ paddingLeft: '1rem', border: '1px solid rgba(99, 102, 241, 0.3)' }} placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} onFocus={onFocusStyle} onBlur={onBlurStyle} required />
                  <input type="text" className="form-control" style={{ paddingLeft: '1rem', border: '1px solid rgba(99, 102, 241, 0.3)' }} placeholder="Pincode" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} onFocus={onFocusStyle} onBlur={onBlurStyle} required />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Working Hours Preference</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {['Part-time', 'Full-time', 'Weekends Only'].map(avail => (
                      <div 
                        key={avail}
                        onClick={() => setFormData({...formData, availability: avail})}
                        style={{ 
                          padding: '1.2rem', 
                          textAlign: 'center', 
                          border: `2px solid ${formData.availability === avail ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          background: formData.availability === avail ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0,0,0,0.2)',
                          color: formData.availability === avail ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: formData.availability === avail ? 'translateY(-2px)' : 'none',
                          boxShadow: formData.availability === avail ? '0 8px 20px rgba(99,102,241,0.2)' : 'none'
                        }}
                      >
                        {avail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="fade-in" style={{ display: 'grid', gap: '1.8rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Core Specialty</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {['Photo Culling', 'Video Editing', 'Album Design'].map(spec => (
                      <div 
                        key={spec}
                        onClick={() => setFormData({...formData, specialty: spec})}
                        style={{ 
                          padding: '1.5rem 1rem', 
                          textAlign: 'center', 
                          border: `2px solid ${formData.specialty === spec ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          background: formData.specialty === spec ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0,0,0,0.2)',
                          color: formData.specialty === spec ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: formData.specialty === spec ? 'translateY(-2px)' : 'none',
                          boxShadow: formData.specialty === spec ? '0 8px 20px rgba(99,102,241,0.2)' : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.8rem'
                        }}
                      >
                        <div style={{ color: formData.specialty === spec ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                          {specialtyIcons[spec] || <Edit3 size={20} />}
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: formData.specialty === spec ? 'bold' : 'normal' }}>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Primary Software</label>
                    <select 
                      className="form-control" 
                      style={{ paddingLeft: '1rem', border: '1px solid rgba(99, 102, 241, 0.3)' }} 
                      value={formData.software} 
                      onChange={e => setFormData({...formData, software: e.target.value})}
                      onFocus={onFocusStyle} onBlur={onBlurStyle}
                    >
                      <option>Premiere Pro</option>
                      <option>DaVinci Resolve</option>
                      <option>Lightroom Classic</option>
                      <option>Photoshop</option>
                      <option>Final Cut Pro</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Portfolio URL (Optional)</label>
                    <div className="input-group" style={{ position: 'relative' }}>
                      <MonitorPlay size={18} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                      <input 
                        type="url" 
                        className="form-control" 
                        style={{ paddingLeft: '2.8rem', border: '1px solid rgba(99, 102, 241, 0.3)', transition: 'all 0.3s' }} 
                        placeholder="https://vimeo.com/..." 
                        value={formData.portfolio} 
                        onChange={e => setFormData({...formData, portfolio: e.target.value})} 
                        onFocus={onFocusStyle}
                        onBlur={onBlurStyle}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Years of Experience</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                    {['Fresher', '1-2 years', '3-5 years', '5+ years'].map(exp => (
                      <div 
                        key={exp}
                        onClick={() => setFormData({...formData, experience: exp})}
                        style={{ 
                          padding: '0.8rem', 
                          textAlign: 'center', 
                          border: `1px solid ${formData.experience === exp ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: formData.experience === exp ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0,0,0,0.2)',
                          color: formData.experience === exp ? '#fff' : 'var(--text-muted)',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        {exp}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="fade-in">
                <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '16px', padding: '2.5rem', marginBottom: '2rem', textAlign: 'center', boxShadow: 'inset 0 0 20px rgba(99,102,241,0.1)' }}>
                  <MonitorPlay size={56} color="var(--accent-primary)" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.5))' }} />
                  <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 'bold' }}>Welcome to the Big Leagues</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '550px', margin: '0 auto', fontSize: '1.05rem' }}>
                    You are applying to be part of the elite WeddingAlbums.in creator network. We only work with the best, and we guarantee the best pay.
                  </p>
                </div>

                <div 
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  onClick={() => setFormData({...formData, agreedToTrial: !formData.agreedToTrial})}
                >
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${formData.agreedToTrial ? 'var(--accent-primary)' : 'var(--text-muted)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.agreedToTrial ? 'var(--accent-primary)' : 'transparent',
                    marginTop: '2px', transition: 'all 0.2s'
                  }}>
                    {formData.agreedToTrial && <CheckCircle size={16} color="#000" strokeWidth={3} />}
                  </div>
                  <label style={{ color: '#e2e8f0', lineHeight: '1.6', fontSize: '0.95rem', cursor: 'pointer', flex: 1 }}>
                    By submitting this application, I agree to a <strong style={{ color: '#fff' }}>1-week trial period</strong> where I will be assigned 1-2 test jobs. I understand that I will be paid for these jobs <em style={{ color: 'var(--accent-primary)' }}>only after Quality Control (QC) approval</em>, and any failure to meet deadlines will result in immediate network removal.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <ChevronLeft size={18} /> Back
                </button>
              ) : (
                <button type="button" onClick={() => navigate('/login')} className="btn-outline" style={{ padding: '0.8rem 1.5rem', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Cancel
                </button>
              )}
              
              {step < 4 ? (
                <button type="button" onClick={handleNext} disabled={nextDisabled()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', opacity: nextDisabled() ? 0.5 : 1, transition: 'all 0.3s', boxShadow: !nextDisabled() ? '0 4px 15px rgba(99,102,241,0.4)' : 'none' }}>
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button type="submit" disabled={nextDisabled()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', fontSize: '1.1rem', opacity: nextDisabled() ? 0.5 : 1, transition: 'all 0.3s', boxShadow: !nextDisabled() ? '0 4px 20px rgba(99,102,241,0.6)' : 'none' }}>
                  Submit Application <CheckCircle size={20} />
                </button>
              )}
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default EditorRegister;
