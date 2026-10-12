import React, { useState, useEffect } from 'react';
import { IndianRupee, CheckCircle, XCircle, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { API } from '../apiConfig';

const Payouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/payouts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayouts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load payouts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve payout and mark escrow funds as settled?')) return;
    setProcessingId(id);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/payouts/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPayouts();
      } else {
        alert('Failed to approve payout');
      }
    } catch {
      alert('Network error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;
    setProcessingId(id);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/payouts/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        fetchPayouts();
      } else {
        alert('Failed to reject payout');
      }
    } catch {
      alert('Network error');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Editor & Studio Payout Requests</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Review, approve, and disburse UPI transfers from the Escrow pool.</p>
        </div>
        <button 
          onClick={fetchPayouts}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', background: 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.25)', color: '#22d3ee',
            borderRadius: '8px', cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh Payouts
        </button>
      </div>

      <div style={{
        background: 'rgba(0,6,15,0.6)',
        border: '1px solid rgba(14,165,233,0.1)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
              <th style={{ padding: '14px 16px' }}>Request ID</th>
              <th style={{ padding: '14px 16px' }}>Recipient User</th>
              <th style={{ padding: '14px 16px' }}>UPI ID</th>
              <th style={{ padding: '14px 16px' }}>Amount</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px' }}>Requested At</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading payouts...</td></tr>
            ) : payouts.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No pending payout requests.</td></tr>
            ) : payouts.map(item => (
              <tr key={item.id || item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#22d3ee' }}>
                  #{String(item.id || item._id).substring(0, 8)}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff' }}>
                  {item.user_name || item.user_id || 'Editor Partner'}
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#D4AF37' }}>
                  {item.upi_id || 'editor@upi'}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10b981', fontSize: '14px' }}>
                  ₹{Number(item.amount || 0).toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                    background: item.status === 'approved' ? 'rgba(16,185,129,0.15)' : item.status === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: item.status === 'approved' ? '#34d399' : item.status === 'rejected' ? '#f87171' : '#fbbf24',
                    textTransform: 'uppercase'
                  }}>
                    {item.status || 'pending'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(item.created_at || Date.now()).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  {item.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleApprove(item.id || item._id)}
                        disabled={processingId === (item.id || item._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 12px', background: 'rgba(16,185,129,0.2)',
                          border: '1px solid rgba(16,185,129,0.4)', color: '#34d399',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                        }}
                      >
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id || item._id)}
                        disabled={processingId === (item.id || item._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 12px', background: 'rgba(239,68,68,0.2)',
                          border: '1px solid rgba(239,68,68,0.4)', color: '#f87171',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payouts;
