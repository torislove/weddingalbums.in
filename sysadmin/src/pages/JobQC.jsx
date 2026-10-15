import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { API } from '../apiConfig';

const JobQC = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setJobs(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Pass QC for this job and release editor escrow?')) return;
    setActionId(id);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/jobs/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchJobs();
      } else {
        alert('Failed to approve job');
      }
    } catch {
      alert('Network Error');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    const feedback = window.prompt('Enter QC revision feedback for editor:');
    if (!feedback) return;
    setActionId(id);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/jobs/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ feedback })
      });
      if (res.ok) {
        fetchJobs();
      } else {
        alert('Failed to reject job');
      }
    } catch {
      alert('Network Error');
    } finally {
      setActionId(null);
    }
  };

  const qcJobs = jobs.filter(j => 
    j.status === 'submitted' || 
    j.status === 'QC Review' || 
    j.status === 'qc_review' || 
    j.status === 'in_progress'
  );

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1400px', margin: '0 auto', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Quality Control (QC) Gate</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '13px' }}>Review deliverables submitted by editors before final client release.</p>
        </div>
        <button 
          onClick={fetchJobs}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', background: 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.25)', color: '#22d3ee',
            borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
            whiteSpace: 'nowrap'
          }}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh QC
        </button>
      </div>

      <div style={{
        background: 'rgba(0,6,15,0.6)',
        border: '1px solid rgba(14,165,233,0.1)',
        borderRadius: '12px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
              <th style={{ padding: '14px 16px' }}>Job ID</th>
              <th style={{ padding: '14px 16px' }}>Studio / Event</th>
              <th style={{ padding: '14px 16px' }}>Editor Deliverable</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>QC Decision</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Checking QC submissions...</td></tr>
            ) : qcJobs.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>All jobs reviewed! Queue is clear.</td></tr>
            ) : qcJobs.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#22d3ee' }}>
                  #{String(job.id).substring(0, 8)}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{job.title || job.client_name || 'Project'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{job.type || 'Photo Retouch'}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {job.work_link ? (
                    <a 
                      href={job.work_link} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        color: '#D4AF37', textDecoration: 'none', fontWeight: 600
                      }}
                    >
                      <ExternalLink size={14} /> Inspect Files
                    </a>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Awaiting Submission</span>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                    background: job.status === 'submitted' ? 'rgba(245,158,11,0.15)' : 'rgba(14,165,233,0.15)',
                    color: job.status === 'submitted' ? '#fbbf24' : '#38bdf8',
                    textTransform: 'uppercase'
                  }}>
                    {job.status === 'submitted' ? 'Needs QC Review' : job.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleApprove(job.id)} 
                      disabled={actionId === job.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 12px', background: 'rgba(16,185,129,0.2)',
                        border: '1px solid rgba(16,185,129,0.4)', color: '#34d399',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                      }}
                    >
                      <CheckCircle size={13} /> Pass QC
                    </button>
                    <button 
                      onClick={() => handleReject(job.id)} 
                      disabled={actionId === job.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 12px', background: 'rgba(239,68,68,0.2)',
                        border: '1px solid rgba(239,68,68,0.4)', color: '#f87171',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                      }}
                    >
                      <XCircle size={13} /> Request Rework
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobQC;
