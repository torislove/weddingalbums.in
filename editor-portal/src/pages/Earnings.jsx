import React from 'react';
import { IndianRupee, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

const Earnings = () => {
  return (
    <div className="page-content fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Earnings & Payouts</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your income and withdraw to UPI instantly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(0,0,0,0.5))', border: '1px solid var(--accent-primary)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <IndianRupee color="var(--accent-primary)" size={24} />
            <h3 style={{ margin: 0 }}>Available for Payout</h3>
          </div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#fff' }}>₹4,500</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Next auto-payout: Friday</p>
          
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <ArrowUpRight size={18} /> Withdraw to UPI
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Job Payouts</h3>

          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Completion Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Teaser Video Edit (3 mins)</td>
                <td>Oct 10, 2026</td>
                <td style={{ color: 'var(--accent-success)', fontWeight: 600 }}>+ ₹1,500</td>
                <td><span className="badge badge-available" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> Pending Clearance</span></td>
              </tr>
              <tr>
                <td>Batch Photo Culling (500 pics)</td>
                <td>Oct 08, 2026</td>
                <td style={{ color: 'var(--accent-success)', fontWeight: 600 }}>+ ₹800</td>
                <td><span className="badge badge-working" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><CheckCircle size={12}/> Paid to UPI</span></td>
              </tr>
              <tr>
                <td>Cinematic Wedding Film (15m)</td>
                <td>Sep 28, 2026</td>
                <td style={{ color: 'var(--accent-success)', fontWeight: 600 }}>+ ₹4,000</td>
                <td><span className="badge badge-working" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><CheckCircle size={12}/> Paid to UPI</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
