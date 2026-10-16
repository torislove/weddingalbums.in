import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, ThumbsUp, Award, CheckCircle, Zap } from 'lucide-react';
import { API } from '../apiConfig';

const Rating = () => {
  const [stats, setStats] = useState({
    rating: 4.9,
    completedJobs: 0,
    activeJobs: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('editorToken');
      const res = await fetch(`${API}/api/editor/stats`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setStats(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to load rating stats', err);
    } finally {
      setLoading(false);
    }
  };

  const getTier = (count) => {
    if (count >= 15) return { name: 'Top Rated Artisan', color: '#D4AF37' };
    if (count >= 5)  return { name: 'Senior Creator',   color: '#38bdf8' };
    return { name: 'Pro Rising Talent', color: '#a855f7' };
  };

  const tier = getTier(stats.completedJobs);

  return (
    <div className="page-content fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Rating & Growth</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Maintain an exceptional rating to unlock High-Yield Premium Jobs and instant Escrow payouts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel stat-card" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent)' }}>
          <div className="stat-icon" style={{ background: 'transparent' }}>
            <Star size={36} color="#f59e0b" fill="#f59e0b" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 4px', color: 'var(--text-secondary)' }}>Overall QC Rating</p>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>
              {(stats.rating || 4.9).toFixed(1)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 5.0</span>
            </h3>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <ShieldCheck size={28} color="#10b981" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 4px', color: 'var(--text-secondary)' }}>Jobs Completed</p>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>{stats.completedJobs}</h3>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <ThumbsUp size={28} color={tier.color} />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 4px', color: 'var(--text-secondary)' }}>Status Tier</p>
            <h3 style={{ margin: 0, color: tier.color, fontSize: '1.5rem' }}>{tier.name}</h3>
          </div>
        </div>
      </div>

      {/* QC Metrics Scorecard */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} color="var(--gold-primary)" /> Quality Performance Benchmarks
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>On-Time Delivery</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>98%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '98%', height: '100%', background: '#10b981' }}></div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Color & Grade Accuracy</span>
              <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>99%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '99%', height: '100%', background: 'var(--gold-primary)' }}></div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>First-Pass QC Approval</span>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>95%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '95%', height: '100%', background: '#38bdf8' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Client Feedback */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0' }}>Recent Studio Client Reviews</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} color="#f59e0b" fill="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Studio Partner</span>
            </div>
            <h4 style={{ margin: '0 0 0.35rem 0' }}>Teaser Video Edit — 4K 60fps</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              "Absolutely nailed the emotional pacing and color curve. Delivered ahead of deadline."
            </p>
          </div>

          <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} color="#f59e0b" fill={i < 5 ? '#f59e0b' : 'transparent'} />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wedding Photobook Lab</span>
            </div>
            <h4 style={{ margin: '0 0 0.35rem 0' }}>Flush Mount Album Layout — 40 Spreads</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              "Great narrative flow and margin alignment. The client approved the draft without any revisions."
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Rating;
