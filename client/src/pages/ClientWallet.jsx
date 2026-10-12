import React, { useState, useEffect } from 'react';
import { Wallet, IndianRupee, ArrowUpRight, Gift, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:4000'));

const ClientWallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user?.wallet_balance || 0);
  const [voucherCode, setVoucherCode] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API}/api/client/profile`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.wallet_balance !== undefined) setBalance(d.wallet_balance); })
      .catch(() => {});
  }, []);

  const handleRedeem = (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    if (voucherCode.toUpperCase() === 'WEDDING1000' || voucherCode.toUpperCase() === 'ROYAL500') {
      const bonus = voucherCode.toUpperCase() === 'WEDDING1000' ? 1000 : 500;
      setBalance(prev => prev + bonus);
      setMsg({ type: 'success', text: `Voucher successfully applied! ₹${bonus} added to your wallet.` });
      setVoucherCode('');
    } else {
      setMsg({ type: 'error', text: 'Invalid or expired voucher code.' });
    }
  };

  return (
    <div className="dashboard-page" style={{ maxWidth: '850px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', margin: '0 0 6px 0' }}>Client Wallet & Credits</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Use your credits towards album printing, gold foiling, and express shipping.</p>
      </div>

      {/* Balance Card */}
      <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(18,19,24,0.9))', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', padding: '30px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Available Balance</span>
            <h1 style={{ fontSize: '2.8rem', margin: '8px 0 4px', color: '#fff', fontWeight: 800 }}>
              ₹{Number(balance).toLocaleString('en-IN')}
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              100% redeemable on any custom album checkout
            </p>
          </div>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={32} color="#D4AF37" />
          </div>
        </div>
      </div>

      {/* Redeem Voucher */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gift size={20} color="#D4AF37" /> Redeem Gift Card / Promo Code
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Have a promotional voucher from an exhibition or your wedding photographer?
        </p>

        {msg && (
          <div style={{ padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', background: msg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: msg.type === 'success' ? '#34d399' : '#f87171', border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleRedeem} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="e.g. WEDDING1000"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 16px', color: '#fff', fontSize: '0.95rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', whiteSpace: 'nowrap' }}>
            Apply Code
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>Recent Wallet Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} color="#10b981" />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>Welcome Bonus Credit</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sign-up promotion</div>
              </div>
            </div>
            <span style={{ color: '#10b981', fontWeight: 700 }}>+₹500</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#D4AF37" />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>Referral Reward</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Friend joined & ordered</div>
              </div>
            </div>
            <span style={{ color: '#D4AF37', fontWeight: 700 }}>+₹1,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientWallet;
