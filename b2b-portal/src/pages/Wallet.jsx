import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, History, ArrowUpRight, ArrowDownRight, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { API } from '../apiConfig';
import Toast from '../components/ui/Toast';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState(null); // { msg, tone }
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('b2bToken');
      const res = await fetch(`${API}/api/b2b/wallet`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.wallet_balance ?? user.wallet_balance ?? 0);
      }
    } catch (err) {
      console.error('Failed to fetch wallet', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return setToast({ msg: 'Enter a valid withdrawal amount', tone: 'danger' });
    if (Number(withdrawAmount) > balance) return setToast({ msg: `Insufficient funds. Your balance is ₹${balance}`, tone: 'danger' });

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('b2bToken');
      const res = await fetch(`${API}/api/b2b/payout-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ amount: Number(withdrawAmount), upiId: upiId || 'studio@upi' })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Payout request submitted to Admin! Processing within 24 hours.');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        fetchWallet();
      } else {
        setToast({ msg: data.error || 'Withdrawal failed', tone: 'danger' });
      }
    } catch (err) {
      console.error(err);
      setToast({ msg: 'Network error during payout request', tone: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Studio Wallet</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Manage your escrow balances, SLA penalty credits, and withdrawals.</p>
        </div>
        <button 
          onClick={fetchWallet} 
          className="btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', cursor: 'pointer' }}
          title="Refresh Balance"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {message && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--ok)', borderRadius: '8px', color: 'var(--ok)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem' }}>
        {/* Balance Card */}
        <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(0,0,0,0.5))', border: '1px solid var(--gold-primary)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <WalletIcon color="var(--gold-primary)" size={24} />
            <h3 style={{ margin: 0 }}>Available Balance</h3>
          </div>
          <h1 className="liquid-gold-text" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.5rem' }}>
            ₹{Number(balance).toLocaleString('en-IN')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Usable for batch album printing & fast-track editing
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="btn-gold" 
              style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Send size={18} /> Request Payout / Withdrawal
            </button>
            <button 
              onClick={() => setToast({ msg: 'To recharge, contact your account manager: support@weddingalbums.in or WhatsApp +91-9876543210', tone: 'default' })}
              className="btn-outline" 
              style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Plus size={18} /> Add Funds
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <History color="var(--text-muted)" size={20} />
            <h3 style={{ margin: 0 }}>Recent Activity</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowDownRight color="#10b981" size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>B2B Studio Welcome Credit</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Studio Partner Account</p>
                </div>
              </div>
              <h4 style={{ margin: 0, color: 'var(--ok)' }}>+ ₹5,000</h4>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight color="#ef4444" size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>Escrow Reservation</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quality Guaranteed Retouching</p>
                </div>
              </div>
              <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Secured</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2rem', background: '#111', border: '1px solid var(--gold-primary)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Request Payout</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Available Balance: <strong style={{ color: 'var(--gold-primary)' }}>₹{balance}</strong>
            </p>

            <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Withdrawal Amount (₹)</label>
                <input 
                  type="number" 
                  value={withdrawAmount} 
                  onChange={e => setWithdrawAmount(e.target.value)} 
                  placeholder="e.g. 2000"
                  max={balance}
                  min={100}
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--paper)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>UPI ID (GPay / PhonePe / Paytm)</label>
                <input 
                  type="text" 
                  value={upiId} 
                  onChange={e => setUpiId(e.target.value)} 
                  placeholder="yourname@okicici"
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--paper)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowWithdrawModal(false)}
                  className="btn-outline" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-gold" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {submitting ? 'Submitting...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toast?.msg} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
};

export default Wallet;
