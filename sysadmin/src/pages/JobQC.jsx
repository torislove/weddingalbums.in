import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const JobQC = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
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
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/jobs/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Job Approved & Escrow Released!');
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
      alert('Network Error');
    }
  };

  const qcJobs = jobs.filter(j => j.status === 'QC Review');

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1e293b' }}>Quality Control (QC) Gate</h1>
      
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '1rem' }}>Job ID</th>
              <th style={{ padding: '1rem' }}>Studio Client</th>
              <th style={{ padding: '1rem' }}>Editor</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : qcJobs.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No jobs pending QC.</td></tr>
            ) : qcJobs.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#3b82f6' }}>#{job.id.substring(0,8)}</td>
                <td style={{ padding: '1rem' }}>{job.studio_name || job.client_name}</td>
                <td style={{ padding: '1rem' }}>{job.editor_name || 'Unknown Editor'}</td>
                <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: '#fef3c7', color: '#d97706', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Needs Review</span></td>
                <td style={{ padding: '1rem', display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14}/> View Demo</button>
                  <button onClick={() => handleApprove(job.id)} style={{ padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14}/> Approve</button>
                  <button style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={14}/> Reject</button>
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
