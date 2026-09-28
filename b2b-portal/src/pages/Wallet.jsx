import React from 'react';
import { Wallet as WalletIcon, Plus, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Wallet = () => {
  return (
    <div className="page-content fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Studio Wallet</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Add funds and manage your SLA credits.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Balance Card */}
        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(0,0,0,0.5))', border: '1px solid var(--gold-primary)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <WalletIcon color="var(--gold-primary)" size={24} />
            <h3 style={{ margin: 0 }}>Available Balance</h3>
          </div>
          <h1 className="liquid-gold-text" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>₹2,500</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Includes ₹500 SLA Penalty Credit</p>
          
          <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
            <Plus size={18} /> Add Funds
          </button>
        </div>

        {/* Transaction History */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <History color="var(--text-muted)" size={20} />
            <h3 style={{ margin: 0 }}>Recent Transactions</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight color="#ef4444" size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>Job Deduction (#JOB-8832)</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Oct 10, 2026</p>
                </div>
              </div>
              <h4 style={{ margin: 0, color: '#ef4444' }}>- ₹1,500</h4>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowDownRight color="#10b981" size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>SLA Penalty Credit</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Late delivery on #JOB-8650</p>
                </div>
              </div>
              <h4 style={{ margin: 0, color: '#10b981' }}>+ ₹500</h4>
            </div>
            
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowDownRight color="#10b981" size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>Wallet Recharge (Razorpay)</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sep 28, 2026</p>
                </div>
              </div>
              <h4 style={{ margin: 0, color: '#10b981' }}>+ ₹5,000</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
