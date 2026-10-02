import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Download, ArrowUpRight, CheckCircle, BarChart3, CreditCard } from 'lucide-react';

const Earnings = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('rahul@okicici');

  const handleWithdraw = async () => {
    if (!withdrawAmount || !upiId) return alert('Enter amount and UPI ID');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/editor/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: withdrawAmount, upi_id: upiId })
      });
      if (res.ok) {
        alert('Payout request submitted to Escrow! You will receive funds upon admin approval.');
        setWithdrawAmount('');
      } else {
        alert('Failed to request payout');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="page-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Earnings & Payouts</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Track your income and withdraw funds instantly to your bank via UPI.</p>
        </div>
        <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> Export Tax Statement
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginBottom: '2.5rem' }}>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Main Earnings KPI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel stat-card" style={{ padding: '2rem', borderTop: '4px solid var(--accent-success)' }}>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <IndianRupee size={28} color="var(--accent-success)" />
              </div>
              <div className="stat-info">
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Lifetime Earnings</p>
                <h3 style={{ margin: 0, fontSize: '2.5rem', color: '#fff' }}>₹1,45,200</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent-success)', margin: '0.5rem 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> +24% from last quarter
                </p>
              </div>
            </div>

            <div className="glass-panel stat-card" style={{ padding: '2rem' }}>
              <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                <BarChart3 size={28} color="var(--accent-primary)" />
              </div>
              <div className="stat-info">
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Pending in Escrow (In QC)</p>
                <h3 style={{ margin: 0, fontSize: '2.5rem', color: '#fff' }}>₹2,300</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Will be released upon QC approval.</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Income Overview (Last 6 Months)</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', padding: '1rem 0' }}>
              {[12, 18, 15, 25, 20, 32].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '100%', height: `${h * 3}px`, background: i === 5 ? 'var(--accent-success)' : 'rgba(16, 185, 129, 0.2)', borderRadius: '6px 6px 0 0', transition: 'height 1s ease' }}></div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: i === 5 ? 'bold' : 'normal' }}>{['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Withdrawal Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Available to Withdraw</h3>
          <h2 style={{ fontSize: '3rem', margin: '0 0 2rem 0', color: 'var(--accent-success)' }}>₹8,500</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Withdraw Amount (₹)</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Enter amount" 
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              style={{ fontSize: '1.2rem', padding: '1rem' }}
            />
            <button 
              onClick={() => setWithdrawAmount('8500')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', marginTop: '0.5rem', cursor: 'pointer', padding: 0 }}
            >
              Withdraw Max
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
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          
          <button className="btn-primary" onClick={handleWithdraw} style={{ padding: '1rem', fontSize: '1.1rem', background: 'var(--accent-success)', color: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
            Withdraw Instantly <ArrowUpRight size={20} />
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Recent Payment History</h3>
        
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Description</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Amount</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Sep 28, 2026</td>
              <td style={{ padding: '1rem', fontWeight: 500 }}>Sangeet Highlights Video (#JOB-8799)</td>
              <td style={{ padding: '1rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>+₹2,000</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                  <CheckCircle size={12} /> Escrow Released
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Sep 25, 2026</td>
              <td style={{ padding: '1rem', fontWeight: 500 }}>Withdrawal to rahul@okicici</td>
              <td style={{ padding: '1rem', color: '#fff', fontWeight: 'bold' }}>-₹12,500</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                  <CheckCircle size={12} /> Settled
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Sep 22, 2026</td>
              <td style={{ padding: '1rem', fontWeight: 500 }}>Photo Culling - Pellikuturu (#JOB-8742)</td>
              <td style={{ padding: '1rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>+₹1,500</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                  <CheckCircle size={12} /> Escrow Released
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Earnings;
