import React from 'react';
import { PlayCircle, DownloadCloud, UploadCloud, CheckCircle } from 'lucide-react';

const TaskQueue = ({ title, description, icon: Icon, color, type }) => {
  return (
    <div className="page-content fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Icon color={color} size={32} />
          {title} Queue
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Column 1: Available Jobs */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-secondary)' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Available to Claim</h3>
          
          <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-available">New</span>
              <span style={{ fontWeight: 'bold', color: color }}>₹1,200</span>
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{type === 'Photo' ? 'Premium Retouching' : type === 'Video' ? 'Highlight Reel (5m)' : '12x18 Layout Design'}</h4>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due in 48 hours. Requires high-end finishing.</p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: color, padding: '0.5rem' }}>Claim Job</button>
          </div>
        </div>

        {/* Column 2: My Active Jobs */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-secondary)', borderTop: `4px solid ${color}` }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>My Active Jobs</h3>
          
          <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-working">Due in 12h</span>
              <span style={{ fontWeight: 'bold', color: color }}>₹800</span>
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{type === 'Photo' ? 'Batch Culling (500)' : type === 'Video' ? 'Teaser (1m)' : 'Standard Album'}</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0' }}>
              <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><DownloadCloud size={14}/> Download Raw Assets</button>
              <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><UploadCloud size={14}/> Upload Final</button>
            </div>
            
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#10b981', padding: '0.5rem' }}><CheckCircle size={16}/> Submit for QC</button>
          </div>
        </div>

        {/* Column 3: In QA / Review */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-secondary)' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>In QC Review</h3>
          
          <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px dashed var(--glass-border)', opacity: 0.7 }}>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: '2rem 0' }}>No jobs currently in Quality Control review.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskQueue;
