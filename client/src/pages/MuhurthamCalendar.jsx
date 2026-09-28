import React, { useState, useEffect } from 'react';
import { Calendar, Info } from 'lucide-react';

const MuhurthamCalendar = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/muhurtham');
        const data = await response.json();
        setDates(data.dates || []);
      } catch (err) {
        console.error('Failed to fetch muhurtham dates', err);
        setDates(["2026-10-12", "2026-10-18", "2026-10-26", "2026-11-04"]); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchDates();
  }, []);

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh', background: 'var(--bg-dark)', color: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Subha Muhurtham Calendar</h1>
        <p style={{ color: 'var(--text-gray)', fontSize: '1.1rem' }}>Book your wedding photography on highly auspicious dates (Andhra/Telangana standard).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', width: '100%' }}>Loading auspicious dates...</p>
        ) : (
          dates.map((dateStr, i) => {
            const date = new Date(dateStr);
            const formatted = date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.3)', background: 'rgba(0,0,0,0.5)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--gold-light), var(--gold-dark))' }}></div>
                <Calendar size={32} color="var(--gold-primary)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{formatted}</h3>
                <p style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Info size={14} /> High Demand
                </p>
                <button className="btn-gold" style={{ marginTop: '1.5rem', width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}>Check Availability</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MuhurthamCalendar;
