import React from 'react';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';

const Rating = () => {
  return (
    <div className="page-content fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Rating & Growth</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Maintain a high rating to unlock Premium Pay jobs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel stat-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)' }}>
          <div className="stat-icon" style={{ background: 'transparent' }}>
            <Star size={40} color="#f59e0b" fill="#f59e0b" />
          </div>
          <div className="stat-info">
            <p>Overall Rating</p>
            <h3 style={{ color: '#fff' }}>4.9 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</span></h3>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <ShieldCheck size={28} color="#10b981" />
          </div>
          <div className="stat-info">
            <p>Jobs Completed</p>
            <h3 style={{ color: '#fff' }}>142</h3>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <ThumbsUp size={28} color="#8b5cf6" />
          </div>
          <div className="stat-info">
            <p>Status Tier</p>
            <h3 style={{ color: '#8b5cf6' }}>Top Rated</h3>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Client Feedback</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Oct 10, 2026</span>
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Teaser Video Edit</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>"Absolutely nailed the pacing and color grade. Exceeded expectations."</p>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Star size={16} color="#f59e0b" />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Oct 05, 2026</span>
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Batch Photo Culling</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>"Good work, but missed a few duplicates in the family portraits section."</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Rating;
