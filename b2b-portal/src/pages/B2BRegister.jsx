import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, Briefcase, Camera } from 'lucide-react';
import Logo from '../components/Logo';

const B2BRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studioName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst: '',
    experience: '1-3 years'
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
        // Free open-source Nominatim API
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
    navigate('/dashboard'); // Mock successful registration
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)' }}>
        <Logo size={45} />
      </header>
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="glass-panel fade-in" style={{ maxWidth: '800px', width: '100%', padding: '3rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Partner Registration</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem' }}>Join India's largest network of elite studios.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Studio Name</label>
              <div className="input-group">
                <Camera size={20} className="input-icon" />
                <input type="text" className="form-control" placeholder="E.g. Kiran Photography" required value={formData.studioName} onChange={e => setFormData({...formData, studioName: e.target.value})} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Owner Name</label>
              <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} required value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number</label>
              <input type="tel" className="form-control" style={{ paddingLeft: '1rem' }} required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', margin: 0 }}>Location Details</label>
                <button type="button" onClick={handleAutoLocation} disabled={loadingLocation} style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Proofs & Compliance</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="GST Number (Optional)" value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} />
                <div style={{ border: '1px dashed var(--glass-border)', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-tertiary)' }}>
                  <Upload size={18} color="var(--gold-primary)" />
                  <span style={{ fontSize: '0.85rem' }}>Upload Address Proof (Aadhar/GST)</span>
                </div>
              </div>
            </div>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
                By registering, you agree to our <a href="http://localhost:5173/terms" target="_blank" rel="noreferrer" style={{ color: 'var(--gold-primary)' }}>Terms & Conditions</a> and <a href="http://localhost:5173/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--gold-primary)' }}>Privacy Policy</a>.
              </p>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}>
                Complete Registration
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

export default B2BRegister;
