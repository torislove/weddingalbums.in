import React, { useState, useEffect } from 'react';
import { Upload, Clock, CheckCircle, TrendingUp, Star, FileText, Wallet, MessageSquare, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/b2b/jobs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const activeJobsCount = jobs.filter(j => j.status !== 'Completed' && j.status !== 'Rejected').length;
  const completedJobsCount = jobs.filter(j => j.status === 'Completed').length;

  return (
    <div className="page-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.5rem 2rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.2)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Welcome back, <span className="liquid-gold-text">{user.studioName || user.name || 'Studio'}</span></h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> {user.city || 'Studio'} • You have {activeJobsCount} active jobs in post-production.
          </p>
        </div>
        <Link to="/submit" className="liquid-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '8px' }}>
          <Upload size={20} />
          Submit New Job
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <Clock size={24} color="var(--accent-blue)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Active Jobs</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{activeJobsCount}</h3>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle size={24} color="var(--accent-green)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Completed This Month</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{completedJobsCount}</h3>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
            <TrendingUp size={24} color="var(--gold-primary)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Money in Wallet</p>
            <h3 className="liquid-gold-text" style={{ margin: 0, fontSize: '1.8rem' }}>₹2,500</h3>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
            <Star size={24} color="#a855f7" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Avg SLA Score</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>4.9/5</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        
        {/* Active Jobs Table */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Active Jobs Pipeline</h3>
            <Link to="/history" style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', textDecoration: 'none' }}>View All</Link>
          </div>
          
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Job ID</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Event</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Type</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Assigned Editor</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>ETA</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>Loading jobs...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>No jobs submitted yet.</td></tr>
              ) : jobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>#{job.id.substring(0,8)}</td>
                  <td style={{ padding: '1rem' }}>
                    <p style={{ margin: 0, fontWeight: 500 }}>{job.client_name}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.event_type} ({job.region})</p>
                  </td>
                  <td style={{ padding: '1rem' }}>{job.job_type}</td>
                  <td style={{ padding: '1rem' }}>{job.editor_id ? 'Assigned' : 'Pending'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge" style={{ 
                      background: job.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                      color: job.status === 'Completed' ? 'var(--accent-green)' : '#60a5fa', 
                      padding: '4px 8px', borderRadius: '4px' 
                    }}>{job.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(job.event_date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Track</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <Link to="/submit" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '1rem', textDecoration: 'none' }}>
                <Upload size={18} color="var(--gold-primary)" /> Submit Manual Job
              </Link>
              <Link to="/invoices" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '1rem', textDecoration: 'none' }}>
                <FileText size={18} color="var(--text-secondary)" /> View Invoices
              </Link>
              <Link to="/wallet" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '1rem', textDecoration: 'none' }}>
                <Wallet size={18} color="var(--text-secondary)" /> Withdraw Wallet
              </Link>
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '1rem', width: '100%', background: 'rgba(37,211,102,0.05)', borderColor: 'rgba(37,211,102,0.3)' }}>
                <MessageSquare size={18} color="#25D366" /> WhatsApp Support
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default B2BDashboard;
