import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, Briefcase, Camera } from 'lucide-react';
import Logo from '../components/Logo';

const EditorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
    specialty: 'Video Editing',
    portfolioUrl: ''
  });
  
  const [loadingLocation, setLoadingLocation] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard'); 
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)' }}>
        <Logo size={45} />
      </header>
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="glass-panel fade-in" style={{ maxWidth: '800px', width: '100%', padding: '3rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Editor Registration</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem' }}>Join the elite network of WeddingAlbums.in Creators.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number</label>
              <input type="tel" className="form-control" style={{ paddingLeft: '1rem' }} required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', margin: 0 }}>Location Details</label>
                <button type="button" onClick={handleAutoLocation} disabled={loadingLocation} style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <MapPin size={14} />
                  {loadingLocation ? 'Detecting...' : 'Auto-detect Location'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
                <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="Pincode" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} required />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Professional Details</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select className="form-control" style={{ paddingLeft: '1rem' }} value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}>
                  <option>Video Editing (Premiere Pro)</option>
                  <option>Photo Culling (Lightroom)</option>
                  <option>Album Designing (Photoshop)</option>
                </select>
                <div style={{ border: '1px dashed var(--glass-border)', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-tertiary)' }}>
                  <Upload size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.85rem' }}>Upload ID Proof (Aadhar)</span>
                </div>
              </div>
            </div>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
                By registering, you agree to our <a href="http://localhost:5173/terms" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>Terms & Conditions</a> and <a href="http://localhost:5173/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>Privacy Policy</a>.
              </p>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}>
                Submit Creator Application
              </button>
            </div>
            
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem' }}>
              <button type="button" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#fff', textDecoration: 'underline', cursor: 'pointer' }}>Back to Login</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditorRegister;
