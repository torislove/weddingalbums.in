import React, { useState, useEffect } from 'react';
import { Download, Eye, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { API } from '../apiConfig';

const JobHistory = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'in_progress' | 'completed'

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('b2bToken');
      const res = await fetch(`${API}/api/b2b/jobs`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
      setError('Could not load your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(j => {
    if (filter === 'completed') return j.status === 'Completed' || j.status === 'approved';
    if (filter === 'in_progress') return j.status !== 'Completed' && j.status !== 'approved';
    return true;
  });

  return (
    <div className="page-content fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Active & Past Jobs</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Track all your studio's post-production tasks in real-time.</p>
        </div>
        <button 
          onClick={fetchJobs} 
          className="btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', cursor: 'pointer' }}
          title="Refresh List"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.9rem' }}>
          <span>⚠ {error}.</span>
          <button onClick={fetchJobs} className="btn-outline" style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderColor: 'rgba(239,68,68,0.4)', color: '#f87171' }}>
            Retry
          </button>
        </div>
      )}

      <div className="glass-panel" style={{ padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0.25rem' }}>
          <button 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? "btn-gold" : "btn-outline"} 
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            All Jobs ({jobs.length})
          </button>
          <button 
            onClick={() => setFilter('in_progress')} 
            className={filter === 'in_progress' ? "btn-gold" : "btn-outline"} 
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            In Production ({jobs.filter(j => j.status !== 'Completed' && j.status !== 'approved').length})
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            className={filter === 'completed' ? "btn-gold" : "btn-outline"} 
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Completed ({jobs.filter(j => j.status === 'Completed' || j.status === 'approved').length})
          </button>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
          <table className="data-table" style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Job ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Project / Client</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Service</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>RAW Files</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Deliverable</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading projects from server...</td></tr>
            ) : error && jobs.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#f87171' }}>
                {error}. <button onClick={fetchJobs} style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
              </td></tr>
            ) : filteredJobs.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No jobs found in this category.</td></tr>
            ) : filteredJobs.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--gold-primary)' }}>
                  #{String(job.id).substring(0, 8)}
                </td>
                <td style={{ padding: '1rem' }}>
                  <strong style={{ color: 'var(--paper)' }}>{job.title || job.client_name || 'Wedding Shoot'}</strong>
                  {job.notes && <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.notes}</p>}
                </td>
                <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                  {job.type || job.job_type || 'Photo Retouch'}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                  {new Date(job.created_at || job.event_date || Date.now()).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${job.status === 'approved' || job.status === 'Completed' ? 'badge-completed' : 'badge-inprogress'}`} style={{ textTransform: 'capitalize' }}>
                    {job.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {job.drive_link || job.raw_files_link ? (
                    <a 
                      href={job.drive_link || job.raw_files_link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-outline" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      <ExternalLink size={13} /> View RAW
                    </a>
                  ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>}
                </td>
                <td style={{ padding: '1rem' }}>
                  {job.work_link ? (
                    <a 
                      href={job.work_link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-gold" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      <Download size={13} /> Download Final
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>In Editing</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default JobHistory;
