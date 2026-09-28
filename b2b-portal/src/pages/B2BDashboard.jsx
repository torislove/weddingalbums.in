import React from 'react';
import { Upload, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BDashboard = () => {
  return (
    <div className="page-content fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, <span className="liquid-gold-text">AP Photography</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here is what's happening with your studio's post-production.</p>
        </div>
        <Link to="/submit" className="btn-gold" style={{ textDecoration: 'none' }}>
          <Upload size={20} />
          Submit New Job
        </Link>
      </div>

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <Clock size={24} color="var(--accent-blue)" />
          </div>
          <div className="stat-info">
            <p>In Progress</p>
            <h3>4</h3>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle size={24} color="var(--accent-green)" />
          </div>
          <div className="stat-info">
            <p>Completed (This Month)</p>
            <h3>12</h3>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
            <TrendingUp size={24} color="var(--gold-primary)" />
          </div>
          <div className="stat-info">
            <p>Wallet Balance</p>
            <h3 className="liquid-gold-text">₹2,500</h3>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Active Jobs</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Client / Event</th>
              <th>Type</th>
              <th>SLA Deadline</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>#JOB-8832</td>
              <td>
                <p style={{ margin: 0, fontWeight: 500 }}>Karthik & Sneha</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wedding (Vizag)</p>
              </td>
              <td>Photo Culling & Grade</td>
              <td>Tomorrow, 5:00 PM</td>
              <td><span className="badge badge-inprogress">Editing</span></td>
              <td>
                <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Track</button>
              </td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>#JOB-8819</td>
              <td>
                <p style={{ margin: 0, fontWeight: 500 }}>Ramesh Family</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pre-Wedding</p>
              </td>
              <td>Cinematic Teaser</td>
              <td>Oct 15, 2026</td>
              <td><span className="badge badge-pending">QC Review</span></td>
              <td>
                <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Track</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default B2BDashboard;
