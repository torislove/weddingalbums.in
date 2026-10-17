import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Download, ArrowUpRight, CheckCircle, BarChart3, CreditCard, RefreshCw } from 'lucide-react';
import { API } from '../apiConfig';

import { useToast } from '../context/ToastContext';

const Earnings = () => {
  const toast = useToast();
  const [stats, setStats] = useState({
    walletBalance: 0,
    totalEarnings: 0,
    completedJobs: 0,
    activeJobs: 0,
    rating: 5.0
  });
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('editor@okaxis');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('editorToken');
      const res = await fetch(`${API}/api/editor/stats`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleWithdraw = async () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0 || !upiId) return toast.error('Please enter a valid withdrawal amount and UPI ID', 'Validation Error');
    if (amt > (stats.walletBalance || 0)) {
      return toast.error(`Insufficient funds. Your available balance is ₹${stats.walletBalance || 0}`, 'Insufficient Balance');
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('editorToken');
      const res = await fetch(`${API}/api/editor/payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ amount: amt, upi_id: upiId })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Payout request submitted to Escrow! Funds will be transferred upon admin approval.', 'Payout Requested');
        setMsg('Payout request submitted to Escrow! Funds will be transferred upon admin approval.');
        setWithdrawAmount('');
        fetchStats();
      } else {
        toast.error(data.error || 'Failed to request payout', 'Payout Error');
      }
    } catch (err) {
      toast.error('Network error while requesting payout', 'Connection Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Earnings & Payouts</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Track your creator income and withdraw escrow funds to your bank via UPI.</p>
        </div>
        <button onClick={fetchStats} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh Stats
        </button>
      </div>

      {msg && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--ok)', borderRadius: '8px', color: 'var(--ok)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} /> {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Main Earnings KPI */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel stat-card" style={{ padding: '2rem', borderTop: '4px solid var(--accent-success)' }}>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <IndianRupee size={28} color="var(--accent-success)" />
              </div>
              <div className="stat-info">
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Lifetime Earnings</p>
                <h3 style={{ margin: 0, fontSize: '2.2rem', color: 'var(--paper)' }}>
                  ₹{Number(stats.totalEarnings || 0).toLocaleString('en-IN')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent-success)', margin: '0.5rem 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> {stats.completedJobs} Completed Jobs
                </p>
              </div>
            </div>

            <div className="glass-panel stat-card" style={{ padding: '2rem' }}>
              <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                <BarChart3 size={28} color="var(--accent-primary)" />
              </div>
              <div className="stat-info">
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Active Pipeline Jobs</p>
                <h3 style={{ margin: 0, fontSize: '2.2rem', color: 'var(--paper)' }}>{stats.activeJobs}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Escrow released upon QC pass</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Income Overview (Monthly Cadence)</h3>
            <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', padding: '1rem 0' }}>
              {[15, 22, 18, 30, 25, 40].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '100%', height: `${h * 3.5}px`, background: i === 5 ? 'var(--accent-success)' : 'rgba(16, 185, 129, 0.2)', borderRadius: '6px 6px 0 0' }}></div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: i === 5 ? 'bold' : 'normal' }}>
                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Withdrawal Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Available to Withdraw</h3>
          <h2 style={{ fontSize: '2.8rem', margin: '0 0 1.5rem 0', color: 'var(--accent-success)' }}>
            ₹{Number(stats.walletBalance || 0).toLocaleString('en-IN')}
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Withdraw Amount (₹)</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Enter amount" 
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              style={{ fontSize: '1.2rem', padding: '0.8rem', width: '100%', boxSizing: 'border-box' }}
            />
            <button 
              type="button"
              onClick={() => setWithdrawAmount(String(stats.walletBalance || 0))}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', marginTop: '0.5rem', cursor: 'pointer', padding: 0 }}
            >
              Withdraw Max (₹{stats.walletBalance || 0})
            </button>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Transfer To (UPI ID)</label>
            <div className="input-group" style={{ position: 'relative' }}>
              <CreditCard size={18} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-control" 
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          
          <button 
            className="btn-primary" 
            onClick={handleWithdraw} 
            disabled={submitting || Number(stats.walletBalance || 0) <= 0}
            style={{ padding: '1rem', fontSize: '1.05rem', background: 'var(--accent-success)', color: 'var(--n-1000)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', cursor: 'pointer' }}
          >
            {submitting ? 'Submitting...' : 'Withdraw Instantly'} <ArrowUpRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Earnings;
