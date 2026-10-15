import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Search, RefreshCw, Trash2, Shield, Briefcase, Camera, Heart } from 'lucide-react';
import { API } from '../apiConfig';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const roleParam = activeRole !== 'all' ? `?role=${activeRole}` : '';
      const res = await fetch(`${API}/api/admin/users${roleParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeRole]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id && u._id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch {
      alert('Network error');
    }
  };

  const filtered = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u.phone && u.phone.includes(search))
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'b2b':
        return <span style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>STUDIO (B2B)</span>;
      case 'editor':
        return <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>CREATOR</span>;
      case 'sysadmin':
      case 'admin':
        return <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>ADMIN</span>;
      default:
        return <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>CLIENT (B2C)</span>;
    }
  };

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1400px', margin: '0 auto', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Customer & User Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '13px' }}>Comprehensive directory of all B2B studios, wedding couples, and freelance editors.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%', maxWidth: '420px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} size={16} />
            <input 
              type="text" 
              placeholder="Search name, email, phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
                fontSize: '13px'
              }}
            />
          </div>

          <button 
            onClick={fetchUsers}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', background: 'rgba(14,165,233,0.1)',
              border: '1px solid rgba(14,165,233,0.25)', color: '#22d3ee',
              borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
              whiteSpace: 'nowrap'
            }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Role Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {[
          { key: 'all', label: 'All Users' },
          { key: 'b2b', label: 'Studios (B2B)' },
          { key: 'b2c', label: 'Couples (B2C)' },
          { key: 'editor', label: 'Creators / Editors' },
          { key: 'admin', label: 'Admins' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveRole(tab.key)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeRole === tab.key ? '#0ea5e9' : 'rgba(255,255,255,0.04)',
              color: activeRole === tab.key ? '#fff' : 'rgba(255,255,255,0.6)',
              fontWeight: activeRole === tab.key ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Panel */}
      <div style={{
        background: 'rgba(0,6,15,0.6)',
        border: '1px solid rgba(14,165,233,0.1)',
        borderRadius: '12px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
              <th style={{ padding: '14px 16px' }}>User / Business</th>
              <th style={{ padding: '14px 16px' }}>Contact Info</th>
              <th style={{ padding: '14px 16px' }}>Role</th>
              <th style={{ padding: '14px 16px' }}>Wallet Balance</th>
              <th style={{ padding: '14px 16px' }}>Joined Date</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading users from database...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No users match the search filter.</td></tr>
            ) : filtered.map(user => (
              <tr key={user.id || user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: 'rgba(14,165,233,0.15)', color: '#22d3ee',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: '14px', flexShrink: 0
                    }}>
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{user.name}</div>
                      {user.studioName && (
                        <div style={{ fontSize: '11px', color: '#D4AF37' }}>{user.studioName}</div>
                      )}
                      {user.city && (
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{user.city}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.8)' }}>{user.email}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{user.phone || 'No phone'}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {getRoleBadge(user.role)}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#10b981' }}>
                  ₹{Number(user.wallet_balance || 0).toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(user.createdAt || user.created_at || Date.now()).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(user.id || user._id)}
                    style={{
                      background: 'none', border: 'none',
                      color: 'rgba(239,68,68,0.7)', cursor: 'pointer',
                      padding: '4px 8px', borderRadius: '4px'
                    }}
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
