import React, { useState, useEffect } from 'react';
import { DownloadCloud, UploadCloud, CheckCircle, Smartphone, Filter, Clock, AlertCircle } from 'lucide-react';

const TaskQueue = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch available jobs
      const resAvail = await fetch('http://localhost:4000/api/editor/available-jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Fetch my jobs (for simplicity here we can fetch all jobs and filter on frontend if admin API exists, 
      // but ideally we need an endpoint for editor's claimed jobs. Let's assume we can fetch them or we just use available jobs for now)
      // I will simulate the structure based on a combined state or separate calls if needed.
      // Let's just create a dummy "My Active" state until the backend is fully fleshed out for editors.
      
      if (resAvail.ok) {
        const data = await resAvail.json();
        setJobs(data);
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

  const handleClaim = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/editor/claim-job/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Job Claimed!');
        fetchJobs(); // Refresh
      } else {
        alert('Failed to claim job');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const availableJobs = jobs.filter(j => j.status === 'Pending' || j.status === 'Pending Assignment');
  const myActiveJobs = jobs.filter(j => j.status === 'InProgress' && j.editor_id === JSON.parse(localStorage.getItem('user')||'{}').id);
  const qcJobs = jobs.filter(j => j.status === 'QC Review' && j.editor_id === JSON.parse(localStorage.getItem('user')||'{}').id);

  return (
    <div className="page-content fade-in" style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Job Workspace</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Claim new jobs and manage your active pipeline.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="form-control" style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
            <option>All Services</option>
            <option>Photo Culling & Grading</option>
            <option>Cinematic Video</option>
            <option>Album Design</option>
          </select>
          <select className="form-control" style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
            <option>My Region (Andhra/TS)</option>
            <option>Any Region</option>
          </select>
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', flex: 1, alignItems: 'start' }}>
        
        {/* COLUMN 1: Available Jobs */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} /> Available Queue
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{availableJobs.length} Jobs</span>
          </div>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>Loading jobs...</p>
          ) : availableJobs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No jobs available right now.</p>
          ) : availableJobs.map(job => (
            <div key={job.id} style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent-primary)'} onMouseLeave={e => e.currentTarget.style.borderColor='var(--glass-border)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>{job.job_type}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-success)', fontSize: '1.2rem' }}>₹{job.price_charged || '1,500'}</span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{job.client_name} - {job.event_type}</h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location: {job.region} • 48h SLA</p>
              <button className="btn-primary" onClick={() => handleClaim(job.id)} style={{ width: '100%', justifyContent: 'center', padding: '0.6rem' }}>Claim Job</button>
            </div>
          ))}
        </div>

        {/* COLUMN 2: My Active Jobs */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(99,102,241,0.2)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--accent-primary)" /> My Active
            </h3>
            <span style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600 }}>{myActiveJobs.length} Jobs</span>
          </div>
          
          {myActiveJobs.length === 0 && (
             <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>You have no active jobs.</p>
          )}

          {myActiveJobs.map(job => (
            <div key={job.id} style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-working" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Due in 18h</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-success)', fontSize: '1.2rem' }}>₹{job.price_charged || '1,500'}</span>
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{job.client_name}</h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{job.job_type} Edit</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1.5rem 0' }}>
                <a href={job.raw_files_link || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderColor: 'var(--glass-border)' }}>
                    <DownloadCloud size={16} /> Download RAW (Link)
                  </button>
                </a>
                
                <a href={`https://wa.me/?text=Hi!%20I%27m%20your%20editor%20for%20${job.id}.%20Here%20is%20the%20first%20demo%20preview%3A%20%5BLINK%5D`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderColor: 'rgba(37,211,102,0.5)', color: '#25D366' }}>
                    <Smartphone size={16} /> Share Demo via WhatsApp
                  </button>
                </a>
              </div>
              
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', background: 'var(--accent-success)', fontSize: '0.95rem' }}>
                <UploadCloud size={18} /> Upload Final Delivery
              </button>
            </div>
          ))}

        </div>

        {/* COLUMN 3: In QC / Done */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} color="var(--accent-secondary)" /> QC Review
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{qcJobs.length} Job(s)</span>
          </div>
          
          {qcJobs.length === 0 && (
             <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No jobs in QC.</p>
          )}

          {qcJobs.map(job => (
            <div key={job.id} style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)', opacity: 0.8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' }} /> Waiting for QC
                </span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '1.2rem' }}>₹{job.price_charged || '1,500'}</span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{job.client_name} ({job.job_type})</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Submitted 2 hours ago. Quality Control team is reviewing your upload. Payment will be released upon approval.</p>
            </div>
          ))}

        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TaskQueue;
