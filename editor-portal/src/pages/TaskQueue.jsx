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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', flex: 1, alignItems: 'start' }}>
        
        {/* COLUMN 1: Available Jobs */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} /> Available
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{availableJobs.length} Jobs</span>
          </div>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>Loading jobs...</p>
          ) : availableJobs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>No jobs available.</p>
          ) : availableJobs.map(job => (
            <div key={job.id} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent-primary)'} onMouseLeave={e => e.currentTarget.style.borderColor='var(--glass-border)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', fontSize: '0.7rem' }}>{job.job_type}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-success)', fontSize: '1rem' }}>₹{job.price_charged || '1,500'}</span>
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{job.client_name}</h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location: {job.region}</p>
              <button className="btn-primary" onClick={() => handleClaim(job.id)} style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.85rem' }}>Claim Job</button>
            </div>
          ))}
        </div>

        {/* COLUMN 2: Awaiting Selection */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.2)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(234, 179, 8, 0.2)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308' }}>
              <Filter size={18} /> Awaiting Selection
            </h3>
            <span style={{ color: '#eab308', fontSize: '0.85rem', fontWeight: 600 }}>{jobs.filter(j => j.status === 'Selection').length} Jobs</span>
          </div>
          
          {jobs.filter(j => j.status === 'Selection').length === 0 && (
             <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>No jobs in selection.</p>
          )}

          {jobs.filter(j => j.status === 'Selection').map(job => (
            <div key={job.id} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid #eab308' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{job.client_name}</h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{job.job_type} Edit</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0' }}>
                <a href={job.raw_files_link || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderColor: 'var(--glass-border)' }}>
                    <DownloadCloud size={14} /> Download Media (Link/NAS)
                  </button>
                </a>
                
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Schedule Selection Session</p>
                  <input type="datetime-local" className="form-control" style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.5)' }} id={`appt-${job.id}`} />
                  <button 
                    className="btn-outline" 
                    style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderColor: 'rgba(37,211,102,0.5)', color: '#25D366' }}
                    onClick={() => {
                      const time = document.getElementById(`appt-${job.id}`).value;
                      if (!time) { alert('Please select a time'); return; }
                      const formattedTime = new Date(time).toLocaleString();
                      const msg = `Hi! I'm your dedicated editor from WeddingAlbums.in. Let's schedule a session to select your photos and videos. How does ${formattedTime} sound to you?`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                  >
                    <Smartphone size={14} /> Send Appointment on WA
                  </button>
                </div>
              </div>
              
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.6rem', background: 'rgba(234, 179, 8, 0.2)', color: '#eab308', border: '1px solid #eab308', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Mark Selection Done
              </button>
            </div>
          ))}
        </div>

        {/* COLUMN 3: Editing In Progress */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(99,102,241,0.2)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--accent-primary)" /> Editing
            </h3>
            <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{myActiveJobs.length} Jobs</span>
          </div>
          
          {myActiveJobs.length === 0 && (
             <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>No active edits.</p>
          )}

          {myActiveJobs.map(job => (
            <div key={job.id} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-working" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.7rem' }}>Due in 18h</span>
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{job.client_name}</h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Style: {job.design_style || 'Warm Gold'}</p>
              
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.6rem', background: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '1rem' }}>
                <UploadCloud size={16} style={{marginRight: '0.5rem'}}/> Submit Draft for QC
              </button>
            </div>
          ))}
        </div>

        {/* COLUMN 4: In QC / Done */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="var(--accent-secondary)" /> QC Review
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{qcJobs.length} Job(s)</span>
          </div>
          
          {qcJobs.length === 0 && (
             <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>No jobs in QC.</p>
          )}

          {qcJobs.map(job => (
            <div key={job.id} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)', opacity: 0.8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' }} /> In Review
                </span>
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{job.client_name}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quality Control is reviewing. Payment will be released upon approval.</p>
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
