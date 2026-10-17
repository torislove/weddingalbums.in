import React, { useState, useEffect } from 'react';
import { Heart, Share2, Copy, Check, Users, Gift, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API } from '../apiConfig';
import { useT } from '../context/LanguageContext';

const ClientReferral = () => {
  const t = useT();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState({
    referralCode: 'WEDDING-LOVE',
    referralCount: 0,
    referralEarnings: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('clientToken');
    if (!token) return;
    fetch(`${API}/api/client/referral`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(res => { if (res) setData(prev => ({ ...prev, ...res })); })
      .catch(() => {});
  }, []);

  const referralLink = `${window.location.origin}/order?ref=${data.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard-page" style={{ maxWidth: '850px', margin: '0 auto', padding: 'clamp(12px, 3vw, 24px)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', margin: '0 0 6px 0' }}>{t('ref.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          {t('ref.sub')}
        </p>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(244,63,94,0.1))', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', padding: 'clamp(18px, 4vw, 32px)', marginBottom: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
        <Sparkles size={36} color="#D4AF37" style={{ marginBottom: '12px' }} />
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: '0 0 10px 0', color: 'var(--paper)', fontWeight: 800 }}>
          {t('ref.give_get')}
        </h1>
        <p style={{ maxWidth: '520px', margin: '0 auto 24px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          {t('ref.share_sub')}
        </p>

        {/* Copy Box */}
        <div style={{ maxWidth: '540px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <input 
            type="text" 
            readOnly 
            value={referralLink} 
            style={{ flex: '1 1 180px', minWidth: 0, background: 'transparent', border: 'none', color: 'var(--paper)', padding: '8px 12px', fontSize: '0.85rem', outline: 'none' }}
          />
          <button 
            onClick={handleCopy}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 18px', fontSize: '0.85rem', whiteSpace: 'nowrap', flex: '0 0 auto' }}
          >
            {copied ? <><Check size={16} /> {t('ref.copied')}</> : <><Copy size={16} /> {t('ref.copy')}</>}
          </button>
        </div>
      </div>

      {/* Stats Counter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <Users size={28} color="#38bdf8" style={{ marginBottom: '8px' }} />
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 4px', color: 'var(--paper)' }}>{data.referralCount}</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('ref.referred')}</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <Gift size={28} color="#D4AF37" style={{ marginBottom: '8px' }} />
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 4px', color: 'var(--brand)' }}>₹{Number(data.referralEarnings).toLocaleString('en-IN')}</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('ref.earned')}</p>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: 'clamp(16px, 3vw, 24px)' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>{t('ref.how')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand)' }}>01</span>
            <h4 style={{ margin: '8px 0 4px', color: 'var(--paper)' }}>{t('ref.s1_t')}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('ref.s1_d')}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand)' }}>02</span>
            <h4 style={{ margin: '8px 0 4px', color: 'var(--paper)' }}>{t('ref.s2_t')}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('ref.s2_d')}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand)' }}>03</span>
            <h4 style={{ margin: '8px 0 4px', color: 'var(--paper)' }}>{t('ref.s3_t')}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('ref.s3_d')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientReferral;
