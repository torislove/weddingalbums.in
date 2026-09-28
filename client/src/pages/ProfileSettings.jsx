import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    coupleNames: user?.coupleNames || '',
    weddingDate: user?.weddingDate ? user.weddingDate.substring(0, 10) : ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, you would have a PUT endpoint to update user profile
    // e.g., await fetch('/api/client/profile', { method: 'PUT', body: JSON.stringify(formData) })
    
    setTimeout(() => {
      setLoading(false);
      setToast('Profile updated successfully! (Mock)');
    }, 1000);
  };

  return (
    <div className="dashboard-page">
      <h2>Profile & Settings</h2>
      
      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group premium-input-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group premium-input-group">
              <label>Email Address</label>
              <input type="email" value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
              <small style={{ color: 'var(--text-muted)' }}>Email cannot be changed.</small>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group premium-input-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            
            <div className="form-group premium-input-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} />
            </div>
          </div>

          <h3 style={{ marginTop: '20px', marginBottom: '10px', color: 'var(--primary)', fontSize: '1.2rem' }}>Wedding Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group premium-input-group">
              <label>Couple Names</label>
              <input type="text" name="coupleNames" value={formData.coupleNames} onChange={handleChange} placeholder="e.g. Ram & Sita" />
            </div>
            
            <div className="form-group premium-input-group">
              <label>Wedding Date</label>
              <input type="date" name="weddingDate" value={formData.weddingDate} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-gold-3d" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ProfileSettings;
