import React from 'react';
import { Layers, Image, IndianRupee, Star, PlayCircle, CheckCircle, UploadCloud, Search, DownloadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

const EditorDashboard = () => {
  return (
    <div className="page-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', padding: '1.5rem 2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Ready to create magic, <span style={{ color: 'var(--accent-primary)' }}>Rahul K.</span>?</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={16} fill="var(--gold-primary)" color="var(--gold-primary)" /> Premium Creator (Rating: 4.9/5) • 2 Active Jobs
          </p>
        </div>
        <Link to="/tasks" className="liquid-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '8px' }}>
          <Search size={20} />
          Browse Open Jobs
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem', borderTop: '4px solid var(--accent-primary)' }}>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
            <Layers size={24} color="var(--accent-primary)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Active Jobs</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>2</h3>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <CheckCircle size={24} color="#f59e0b" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Submitted for QC</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>1</h3>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <IndianRupee size={24} color="var(--accent-success)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Weekly Earnings</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--accent-success)' }}>₹8,500</h3>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
            <Star size={24} color="var(--gold-primary)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Quality Score</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>4.9/5</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        
        {/* Active Queue Table */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>My Active Queue</h3>
            <Link to="/tasks" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}>Go to Workspace</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Job Card 1 */}
            <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>#JOB-8832</span>
                  <span className="badge badge-working" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Due in 18h</span>
                </div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Suresh & Ramya (Pellikuturu) - Cinematic Teaser</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required: DaVinci Resolve, Cinematic Teal & Orange, Max 3 Mins</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><DownloadCloud size={14} /> RAW (45GB)</button>
                  <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'rgba(37,211,102,0.3)', color: '#25D366' }}>Share Demo to Studio</button>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--accent-success)', fontSize: '1.2rem' }}>₹1,500</p>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><UploadCloud size={16} /> Submit Final</button>
              </div>
            </div>

            {/* Job Card 2 */}
            <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>#JOB-8840</span>
                  <span className="badge badge-working" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>Due in 2 days</span>
                </div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Ramesh Family - Pre-Wedding Culling & Grade</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required: Lightroom Classic, Warm Gold Tones, 500 Photos</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><DownloadCloud size={14} /> SmartLink (3GB)</button>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--accent-success)', fontSize: '1.2rem' }}>₹1,000</p>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><UploadCloud size={16} /> Submit Final</button>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <Link to="/tasks" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '1rem', textDecoration: 'none' }}>
                <Search size={18} color="var(--accent-primary)" /> Browse Open Jobs
              </Link>
              <Link to="/earnings" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '1rem', textDecoration: 'none' }}>
                <IndianRupee size={18} color="var(--accent-success)" /> Withdraw Earnings
              </Link>
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '1rem', width: '100%', borderColor: 'rgba(212,175,55,0.3)', color: 'var(--gold-primary)' }}>
                <Star size={18} /> Rate the Studio
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Asset Library Access</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your 4.9 rating grants you free access to our premium LUTs & Presets.</p>
            <button className="btn-primary" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}>Open Library</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditorDashboard;
