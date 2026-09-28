import React from 'react';
import { Download, Eye } from 'lucide-react';

const JobHistory = () => {
  return (
    <div className="page-content fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Active & Past Jobs</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track all your studio's post-production tasks.</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>All Jobs</button>
          <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>In Progress</button>
          <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Completed</button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Client Name</th>
              <th>Service</th>
              <th>Submitted Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: 'monospace', color: 'var(--gold-primary)' }}>#JOB-8832</td>
              <td>Karthik & Sneha</td>
              <td>Photo Culling</td>
              <td>Oct 10, 2026</td>
              <td><span className="badge badge-inprogress">Editing</span></td>
              <td><button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '4px' }}><Eye size={16} /></button></td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'monospace', color: 'var(--gold-primary)' }}>#JOB-8819</td>
              <td>Ramesh Family</td>
              <td>Cinematic Teaser</td>
              <td>Oct 08, 2026</td>
              <td><span className="badge badge-pending">QC Review</span></td>
              <td><button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '4px' }}><Eye size={16} /></button></td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'monospace', color: 'var(--gold-primary)' }}>#JOB-8705</td>
              <td>Priya & Rahul</td>
              <td>12x18 Album Design</td>
              <td>Sep 25, 2026</td>
              <td><span className="badge badge-completed">Completed</span></td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '4px' }}><Eye size={16} /></button>
                  <button className="btn-gold" style={{ padding: '0.4rem', borderRadius: '4px' }} title="Download Final"><Download size={16} /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobHistory;
