import React from 'react';
import { PlayCircle, Image, IndianRupee, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const EditorDashboard = () => {
  return (
    <div className="page-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Ready to create magic, <span style={{ color: 'var(--accent-primary)' }}>Rahul</span>?</h1>
        <p style={{ color: 'var(--text-secondary)' }}>You have 2 active jobs pending delivery.</p>
      </div>

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
            <Layers size={24} color="var(--accent-primary)" />
          </div>
          <div className="stat-info">
            <p>Active Tasks</p>
            <h3>2</h3>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <Image size={24} color="var(--accent-success)" />
          </div>
          <div className="stat-info">
            <p>Completed This Week</p>
            <h3>8</h3>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <IndianRupee size={24} color="var(--accent-secondary)" />
          </div>
          <div className="stat-info">
            <p>Unpaid Earnings</p>
            <h3 style={{ color: '#fff' }}>₹4,500</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>My Active Queue</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>Teaser Video Edit (3 mins)</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required: DaVinci Resolve, Teal & Orange LUT</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: 'var(--accent-primary)' }}>₹1,500</p>
                <span className="badge badge-working">Due in 24h</span>
              </div>
            </div>
            
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>Batch Photo Culling (500 pics)</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required: Lightroom Classic, Warm Tones</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: 'var(--accent-primary)' }}>₹800</p>
                <span className="badge badge-working">Due in 12h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
