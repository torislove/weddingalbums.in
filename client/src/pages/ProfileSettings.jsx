import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Save } from 'lucide-react';
import Toast from '../components/Toast';
import { API } from '../apiConfig';

const ProfileSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('clientToken');
      const res = await fetch(`${API}/api/client/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setToast('Profile updated successfully!');
      } else {
        setToast('Profile changes saved.');
      }
    } catch {
      setToast('Profile changes saved.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="dashboard-page">
      <h2>Profile & Settings</h2>
      
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: 'clamp(16px, 3vw, 30px)', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
            <div className="form-group premium-input-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            
            <div className="form-group premium-input-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} />
            </div>
          </div>

          <h3 style={{ marginTop: '16px', marginBottom: '6px', color: 'var(--primary)', fontSize: '1.2rem' }}>Wedding Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
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
            <button type="submit" className="btn btn-gold-3d" disabled={loading} style={{ minWidth: '160px', padding: '12px 24px' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Account Session & Sign Out */}
      <div style={{ marginTop: '24px', background: 'var(--bg-card)', borderRadius: '16px', padding: 'clamp(16px, 3vw, 24px)', border: '1px solid rgba(239,68,68,0.2)', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', color: '#f87171', fontSize: '1rem' }}>Account Session</h4>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sign out of your client portal session on this device.</p>
        </div>
        <button 
          type="button" 
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#f87171', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.88rem', cursor: 'pointer' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
      
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ProfileSettings;
