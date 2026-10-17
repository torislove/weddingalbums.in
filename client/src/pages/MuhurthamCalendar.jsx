import React, { useState, useEffect } from 'react';
import { Calendar, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useT, useLanguage } from '../context/LanguageContext';
import { API } from '../apiConfig';

const MuhurthamCalendar = () => {
  const t = useT();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch(`${API}/api/muhurtham`);
        const data = await response.json();
        setDates(data.dates || []);
      } catch (err) {
        console.error('Failed to fetch muhurtham dates', err);
        setDates(["2026-10-18", "2026-10-26", "2026-11-04", "2026-11-18", "2026-12-06", "2027-01-22"]);
      } finally {
        setLoading(false);
      }
    };
    fetchDates();
  }, []);

  return (
    <div style={{ padding: '0 1.25rem 4rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh', color: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="text-gradient font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.75rem' }}>{t('muhurtham.title')}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', lineHeight: 1.6 }}>{t('muhurtham.sub')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>{t('muhurtham.loading')}</p>
        ) : (
          dates.map((dateStr, i) => {
            const date = new Date(dateStr);
            const formatted = date.toLocaleDateString(lang === 'TE' ? 'te-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return (
              <div key={i} className="glass-3d" style={{ padding: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--color-secondary), var(--color-primary))' }}></div>
                <Calendar size={32} color="#D4AF37" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--paper)' }}>{formatted}</h3>
                <p style={{ color: 'var(--ok)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Info size={14} /> {t('muhurtham.high_demand')}
                </p>
                <button 
                  className="btn btn-gold-3d" 
                  style={{ marginTop: '1.25rem', width: '100%', padding: '0 1rem', fontSize: '0.85rem', cursor: 'pointer' }}
                  onClick={() => navigate(`/booking?date=${dateStr}`)}
                >
                  {t('muhurtham.book')}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MuhurthamCalendar;
