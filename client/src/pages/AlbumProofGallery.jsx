import React from 'react';
import { Image as ImageIcon, BookOpen, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useT } from '../context/LanguageContext';

const AlbumProofGallery = () => {
  const t = useT();
  const spreads = [
    { key: 'apg.spread1', img: '/images/weddingalbums-layflat-album.png' },
    { key: 'apg.spread2', img: '/images/saptapadi.png' },
    { key: 'apg.spread3', img: '/images/bride-polished.jpg' }
  ];

  return (
    <div className="dashboard-page" style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(12px, 3vw, 24px)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', margin: '0 0 6px 0' }}>{t('apg.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>{t('apg.sub')}</p>
      </div>

      {/* Active Proof Card */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: 'clamp(14px, 3vw, 24px)', border: '1px solid rgba(212,175,55,0.25)', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', background: 'rgba(212,175,55,0.15)', color: 'var(--brand)', padding: '3px 10px', borderRadius: '999px', fontWeight: 600, border: '1px solid rgba(212,175,55,0.3)' }}>
                {t('apg.badge')}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('apg.updated')}</span>
            </div>
            <h3 style={{ margin: '4px 0 6px 0', fontSize: '1.2rem', color: 'var(--paper)' }}>{t('apg.proof_title')}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('apg.specs')}</p>
          </div>
          <Link 
            to="/proofing/sample" 
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 18px', textDecoration: 'none', fontSize: '0.85rem' }}
          >
            <BookOpen size={16} /> {t('apg.open')} <ExternalLink size={14} />
          </Link>
        </div>

        {/* Spread Previews */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '12px', marginTop: '16px' }}>
          {spreads.map((spread, i) => (
            <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)' }}>
              <img src={spread.img} alt={t(spread.key)} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
              <div style={{ padding: '8px 10px', fontSize: '0.8rem', color: 'var(--n-300)', fontWeight: 500 }}>
                {t(spread.key)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Guidelines */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: 'clamp(14px, 3vw, 24px)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--paper)' }}>{t('apg.instructions_title')}</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <li>{t('apg.li1')}</li>
          <li>{t('apg.li2')}</li>
          <li>{t('apg.li3')}</li>
        </ul>
      </div>
    </div>
  );
};

export default AlbumProofGallery;
