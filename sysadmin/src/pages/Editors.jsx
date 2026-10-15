import React, { useState, useEffect } from 'react';
import { Scissors, Star, RefreshCw, Trash2, Award } from 'lucide-react';
import { API } from '../apiConfig';

const Editors = () => {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEditors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/users?role=editor`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEditors(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditors();
  }, []);

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1400px', margin: '0 auto', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Creator & Editor Network</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '13px' }}>Vetted retouchers, colorists, and wedding video editors in the network.</p>
        </div>
        <button 
          onClick={fetchEditors}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', background: 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.25)', color: '#22d3ee',
            borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
            whiteSpace: 'nowrap'
          }}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh Network
        </button>
      </div>

      <div style={{
        background: 'rgba(0,6,15,0.6)',
        border: '1px solid rgba(14,165,233,0.1)',
        borderRadius: '12px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
              <th style={{ padding: '14px 16px' }}>Editor Name</th>
              <th style={{ padding: '14px 16px' }}>Specialization</th>
              <th style={{ padding: '14px 16px' }}>Quality Rating</th>
              <th style={{ padding: '14px 16px' }}>Escrow Balance</th>
              <th style={{ padding: '14px 16px' }}>Contact</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading editors...</td></tr>
            ) : editors.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No editors registered in system.</td></tr>
            ) : editors.map(editor => (
              <tr key={editor.id || editor._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{editor.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{editor.city || 'India'}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                    background: 'rgba(99,102,241,0.15)', color: '#818cf8', textTransform: 'capitalize'
                  }}>
                    {editor.specialization || 'Photo & Video'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#D4AF37', fontWeight: 700 }}>
                  ★ {editor.editor_rating || 5.0} / 5.0
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#10b981' }}>
                  ₹{Number(editor.wallet_balance || 0).toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div>{editor.email}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{editor.phone || 'No phone'}</div>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                    background: 'rgba(16,185,129,0.15)', color: '#34d399'
                  }}>
                    ACTIVE PRO
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Editors;
