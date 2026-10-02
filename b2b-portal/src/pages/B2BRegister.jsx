import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, MapPin, Upload, Briefcase, ChevronRight, ChevronLeft, CheckCircle, Store, Users, User, FileText, Smartphone } from 'lucide-react';
import Logo from '../components/Logo';

const B2BRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1
    studioName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    studioType: 'Solo Photographer',
    // Step 2
    city: '',
    state: '',
    pincode: '',
    region: 'Hyderabad High-End',
    // Step 3
    gst: '',
    pan: '',
    // Step 4
    services: 'Photography & Videography',
    eventsPerMonth: '5-15',
    hasPostTeam: 'No',
    // Step 5
    agreedToTerms: false
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
            state: data.address.state || '',
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

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert("Please agree to the white-label terms.");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.ownerName,
          email: formData.email,
          password: formData.password,
          role: 'b2b',
          phone: formData.phone,
          city: formData.city,
          studioName: formData.studioName,
          gstNumber: formData.gst
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
      console.error(err);
      alert('Network error');
    }
  };

  const nextDisabled = () => {
    if (step === 1) return !formData.studioName || !formData.ownerName || !formData.phone || !formData.email || !formData.password;
    if (step === 2) return !formData.city || !formData.state || !formData.pincode;
    if (step === 5) return !formData.agreedToTerms;
    return false;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)' }}>
        <Link to="/">
          <Logo size={45} />
        </Link>
      </header>
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="glass-panel fade-in" style={{ maxWidth: '800px', width: '100%', padding: '3rem', borderRadius: '24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Partner Registration</h2>
            <p style={{ color: 'var(--text-muted)' }}>Step {step} of 5: {
              step === 1 ? "Studio Identity" : 
              step === 2 ? "Location & Region" :
              step === 3 ? "Proofs & Compliance" :
              step === 4 ? "Capabilities" : "Review & Submit"
            }</p>
            
            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ 
                  height: '6px', 
                  width: '40px', 
                  borderRadius: '3px', 
                  background: i <= step ? 'var(--gold-primary)' : 'var(--bg-tertiary)',
                  transition: 'background 0.3s ease'
                }} />
              ))}
            </div>
          </div>
          
          <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} style={{ minHeight: '300px' }}>
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Studio Name</label>
                    <div className="input-group">
                      <Camera size={20} className="input-icon" />
                      <input type="text" className="form-control" placeholder="E.g. Ramesh Photography" required value={formData.studioName} onChange={e => setFormData({...formData, studioName: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Owner Name</label>
                    <div className="input-group">
                      <User size={20} className="input-icon" />
                      <input type="text" className="form-control" placeholder="Full Name" required value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
                    <input type="email" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="studio@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
                    <input type="password" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="Create a password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Studio Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {['Solo Photographer', 'Small Studio', 'Large Wedding House'].map(type => (
                      <div 
                        key={type}
                        onClick={() => setFormData({...formData, studioType: type})}
                        style={{ 
                          padding: '1rem', 
                          textAlign: 'center', 
                          border: `2px solid ${formData.studioType === type ? 'var(--gold-primary)' : 'var(--bg-tertiary)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: formData.studioType === type ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                          color: formData.studioType === type ? '#fff' : 'var(--text-muted)'
                        }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                  <label style={{ color: 'var(--text-secondary)', margin: 0 }}>Location Details</label>
                  <button type="button" onClick={handleAutoLocation} disabled={loadingLocation} style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <MapPin size={14} />
                    {loadingLocation ? 'Detecting...' : 'Auto-detect Location'}
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                  <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
                </div>
                <input type="text" className="form-control" style={{ paddingLeft: '1rem', width: '50%' }} placeholder="Pincode" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} required />

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Region Speciality</label>
                  <select className="form-control" style={{ paddingLeft: '1rem' }} value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
                    <option>Hyderabad High-End</option>
                    <option>Vizag Weddings</option>
                    <option>Godavari Belt</option>
                    <option>Rayalaseema</option>
                    <option>Other AP/TS</option>
                  </select>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>This helps us assign editors familiar with your local wedding traditions (e.g., Pellikuturu customs).</p>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Upload compliance documents to help us verify your studio. Files are strictly confidential.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>GST Number (Optional)</label>
                    <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="e.g. 36AABCU9603R1ZM" value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Business PAN (Optional)</label>
                    <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="PAN Number" value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Studio Registration / Address Proof</label>
                  <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: 'var(--bg-tertiary)', cursor: 'pointer' }}>
                    <Upload size={32} color="var(--gold-primary)" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: '#fff', marginBottom: '0.5rem' }}>Click to upload Aadhar PDF or GST Certificate</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Max file size: 5MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Services You Offer</label>
                  <select className="form-control" style={{ paddingLeft: '1rem' }} value={formData.services} onChange={e => setFormData({...formData, services: e.target.value})}>
                    <option>Photography & Videography</option>
                    <option>Photography Only</option>
                    <option>Videography Only</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Average Events per Month</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {['< 5', '5-15', '15+'].map(num => (
                      <div 
                        key={num}
                        onClick={() => setFormData({...formData, eventsPerMonth: num})}
                        style={{ 
                          padding: '1rem', 
                          textAlign: 'center', 
                          border: `2px solid ${formData.eventsPerMonth === num ? 'var(--gold-primary)' : 'var(--bg-tertiary)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: formData.eventsPerMonth === num ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                          color: formData.eventsPerMonth === num ? '#fff' : 'var(--text-muted)'
                        }}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Do you currently have a post-production team?</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {['Yes', 'No'].map(ans => (
                      <div 
                        key={ans}
                        onClick={() => setFormData({...formData, hasPostTeam: ans})}
                        style={{ 
                          padding: '1rem', 
                          textAlign: 'center', 
                          border: `2px solid ${formData.hasPostTeam === ans ? 'var(--gold-primary)' : 'var(--bg-tertiary)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: formData.hasPostTeam === ans ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                          color: formData.hasPostTeam === ans ? '#fff' : 'var(--text-muted)'
                        }}
                      >
                        {ans}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="fade-in">
                <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid var(--gold-primary)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ color: 'var(--gold-primary)', marginBottom: '1rem', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.5rem' }}>Summary</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                    <div>
                      <p style={{ color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Studio Name</p>
                      <p style={{ color: '#fff', margin: 0, fontWeight: 500 }}>{formData.studioName}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Owner</p>
                      <p style={{ color: '#fff', margin: 0, fontWeight: 500 }}>{formData.ownerName}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Location</p>
                      <p style={{ color: '#fff', margin: 0, fontWeight: 500 }}>{formData.city}, {formData.state}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Region</p>
                      <p style={{ color: '#fff', margin: 0, fontWeight: 500 }}>{formData.region}</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--gold-primary)', marginTop: '4px' }}
                  />
                  <label htmlFor="terms" style={{ color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.9rem' }}>
                    I agree to the <a href="http://localhost:5173/terms" target="_blank" rel="noreferrer" style={{ color: 'var(--gold-primary)' }}>100% White-Label Terms</a>. I understand that WeddingAlbums.in will never contact my clients directly and all delivered assets will remain strictly confidential.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChevronLeft size={18} /> Back
                </button>
              ) : (
                <button type="button" onClick={() => navigate('/login')} className="btn-outline">
                  Cancel
                </button>
              )}
              
              {step < 5 ? (
                <button type="button" onClick={handleNext} disabled={nextDisabled()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: nextDisabled() ? 0.5 : 1 }}>
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button type="submit" disabled={nextDisabled()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', fontSize: '1.1rem', opacity: nextDisabled() ? 0.5 : 1 }}>
                  Submit Registration <CheckCircle size={20} />
                </button>
              )}
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default B2BRegister;
