import React, { useState, useEffect } from 'react';
import { Upload, Clock, CheckCircle, TrendingUp, Star, FileText, Wallet, MessageSquare, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API } from '../apiConfig';

const B2BDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('b2bToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [jobsRes, walletRes] = await Promise.all([
          fetch(`${API}/api/b2b/jobs`, { headers }),
          fetch(`${API}/api/b2b/wallet`, { headers })
        ]);

        if (jobsRes.ok) {
          const data = await jobsRes.json();
          setJobs(Array.isArray(data) ? data : []);
        }
        if (walletRes.ok) {
          const wData = await walletRes.json();
          setWalletBalance(wData.wallet_balance ?? user.wallet_balance ?? 0);
        }
      } catch (err) {
        console.error('Failed to fetch studio data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeJobsCount = jobs.filter(j => j.status !== 'Completed' && j.status !== 'approved' && j.status !== 'Rejected').length;
  const completedJobsCount = jobs.filter(j => j.status === 'Completed' || j.status === 'approved').length;

  return (
    <div className="page-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3vw, 2rem)', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.2)' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: '0 0 0.5rem 0' }}>Welcome back, <span className="liquid-gold-text">{user.studioName || user.name || 'Studio'}</span></h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
            <MapPin size={16} /> {user.city || 'Studio'} • You have {activeJobsCount} active jobs in post-production.
          </p>
        </div>
        <Link to="/submit" className="liquid-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '8px', whiteSpace: 'nowrap' }}>
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
            <h3 className="liquid-gold-text" style={{ margin: 0, fontSize: '1.8rem' }}>₹{Number(walletBalance).toLocaleString('en-IN')}</h3>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '2rem' }}>
        
        {/* Active Jobs Table */}
        <div className="glass-panel" style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Active Jobs Pipeline</h3>
            <Link to="/jobs" style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', textDecoration: 'none' }}>View All</Link>
          </div>
          
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <table className="data-table" style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Job ID</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Event / Project</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Type</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Assigned Editor</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>Loading jobs...</td></tr>
                ) : jobs.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>No jobs submitted yet. Click "Submit New Job" to begin.</td></tr>
                ) : jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>#{(job.id || '').substring(0,8)}</td>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ margin: 0, fontWeight: 500 }}>{job.title || job.client_name || 'Project'}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.event_type || 'Wedding'} ({job.region || 'AP/TS'})</p>
                    </td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{job.type || job.job_type || 'Photo'}</td>
                    <td style={{ padding: '1rem' }}>{job.assigned_editor_id || job.editor_id ? 'Assigned' : 'Queued'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge" style={{ 
                        background: (job.status === 'Completed' || job.status === 'approved') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                        color: (job.status === 'Completed' || job.status === 'approved') ? 'var(--accent-green)' : '#60a5fa', 
                        padding: '4px 8px', borderRadius: '4px', textTransform: 'capitalize'
                      }}>{job.status}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>{new Date(job.deadline || job.created_at || job.event_date || Date.now()).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      {job.drive_link || job.raw_files_link ? (
                        <a href={job.drive_link || job.raw_files_link} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', textDecoration: 'none' }}>Files</a>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Queued</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '1rem', width: '100%', background: 'rgba(37,211,102,0.05)', borderColor: 'rgba(37,211,102,0.3)', cursor: 'pointer' }}>
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
