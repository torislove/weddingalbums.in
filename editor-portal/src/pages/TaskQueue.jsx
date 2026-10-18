import React, { useState, useEffect } from 'react';
import { DownloadCloud, UploadCloud, CheckCircle, Clock, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { API } from '../apiConfig';

import { useToast } from '../context/ToastContext';

const TaskQueue = ({ title, description, icon: HeaderIcon, color, type }) => {
  const toast = useToast();

  // Workspace hero visual per specialisation (staged mockup library)
  const HERO_IMAGES = {
    photo: '/images/bride-polished.jpg',
    video: '/images/cinematic-video-suite.jpg',
    album: '/images/mockup-layflat-spread.svg',
  };
  const heroImage = HERO_IMAGES[String(type || '').toLowerCase()];
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitJobId, setSubmitJobId] = useState(null);
  const [workLink, setWorkLink] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('editorToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [availRes, myRes] = await Promise.all([
        fetch(`${API}/api/editor/available-jobs${type ? `?type=${type.toLowerCase()}` : ''}`, { headers }),
        fetch(`${API}/api/editor/my-jobs`, { headers })
      ]);

      if (availRes.ok) {
        const data = await availRes.json();
        setAvailableJobs(Array.isArray(data) ? data : []);
      }
      if (myRes.ok) {
        const data = await myRes.json();
        setMyJobs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch editor jobs', err);
      toast.error('Could not connect to task engine. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [type]);

  const handleClaim = async (id) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('editorToken');
      const res = await fetch(`${API}/api/editor/claim-job/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        toast.success('Job claimed successfully! Moved to your In-Progress workspace.', 'Job Claimed');
        fetchJobs();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Failed to claim job', 'Claim Error');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while claiming job', 'Connection Error');
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!workLink) return toast.error('Please enter your deliverable Drive / Cloud link', 'Link Required');
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('editorToken');
      const res = await fetch(`${API}/api/editor/submit-job/${submitJobId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ workLink, notes })
      });
      if (res.ok) {
        toast.success('Work submitted for Quality Control (QC)!', 'Work Submitted');
        setSubmitJobId(null);
        setWorkLink('');
        setNotes('');
        fetchJobs();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Failed to submit work', 'Submission Error');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error submitting work', 'Connection Error');
    } finally {
      setSubmitting(false);
    }
  };

  const inProgressJobs = myJobs.filter(j => j.status === 'in_progress');
  const qcJobs = myJobs.filter(j => j.status === 'submitted' || j.status === 'qc_review');
  const completedJobs = myJobs.filter(j => j.status === 'approved' || j.status === 'completed');

  return (
    <div className="page-content fade-in" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {HeaderIcon && <HeaderIcon size={28} color={color || 'var(--accent-primary)'} />}
            {title ? `${title} Workspace` : 'Job Workspace'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            {description || 'Fulfill assigned lab production orders, download RAW camera clicks, and submit deliverables for pre-press QC.'}
          </p>
        </div>
        
        {heroImage && (
          <img
            src={heroImage}
            alt={`${String(title || type || 'Job')} workspace preview`}
            style={{
              width: 'clamp(150px, 20vw, 240px)', aspectRatio: '16/10', objectFit: 'cover',
              borderRadius: '14px', border: '1px solid rgba(212,175,55,0.35)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.45)', flexShrink: 0,
            }}
          />
        )}

        <button 
          onClick={fetchJobs} 
          className="btn-outline" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', cursor: 'pointer' }}
          title="Refresh Workspace"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {/* KANBAN BOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', flex: 1, alignItems: 'start' }}>
        
        {/* COLUMN 1: Available Jobs */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '550px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} /> Production Order Queue
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{availableJobs.length} Orders</span>
          </div>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>Loading orders...</p>
          ) : availableJobs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>No pending orders in queue right now.</p>
          ) : availableJobs.map(job => (
            <div key={job.id} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                  {job.type || 'Retouch'}
                </span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-success)', fontSize: '0.95rem' }}>
                  ₹{job.payout_amount || 1500}
                </span>
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--paper)' }}>{job.title}</h4>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {job.description || 'Wedding post-production edit'}
              </p>
              <button 
                className="btn-primary" 
                onClick={() => handleClaim(job.id)} 
                style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Accept Production Order
              </button>
            </div>
          ))}
        </div>

        {/* COLUMN 2: My Claimed - In Progress */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '550px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(99,102,241,0.2)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
              <Clock size={16} /> My In-Progress
            </h3>
            <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{inProgressJobs.length} Jobs</span>
          </div>
          
          {inProgressJobs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>No claimed jobs in progress.</p>
          ) : inProgressJobs.map(job => (
            <div key={job.id} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--accent-primary)' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--paper)' }}>{job.title}</h4>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Payout: <strong style={{ color: 'var(--accent-success)' }}>₹{job.payout_amount || 1500}</strong>
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {job.drive_link && (
                  <a href={job.drive_link} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none' }}>
                    <DownloadCloud size={14} /> Download RAW Footage
                  </a>
                )}
              </div>
              
              <button 
                onClick={() => { setSubmitJobId(job.id); setWorkLink(''); setNotes(''); }}
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.6rem', background: 'var(--accent-success)', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <UploadCloud size={16} style={{ marginRight: '0.4rem' }} /> Submit for QC
              </button>
            </div>
          ))}
        </div>

        {/* COLUMN 3: In QC Review */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.2)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '550px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(234, 179, 8, 0.2)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308' }}>
              <AlertCircle size={16} /> QC Gate Review
            </h3>
            <span style={{ color: '#eab308', fontSize: '0.85rem', fontWeight: 600 }}>{qcJobs.length} Jobs</span>
          </div>
          
          {qcJobs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>No jobs under review.</p>
          ) : qcJobs.map(job => (
            <div key={job.id} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--paper)' }}>{job.title}</h4>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Under review by Quality Lead</p>
              {job.work_link && (
                <a href={job.work_link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ExternalLink size={12} /> View Submission
                </a>
              )}
            </div>
          ))}
        </div>

        {/* COLUMN 4: Completed / Paid */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '550px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ok)' }}>
              <CheckCircle size={16} /> Approved & Paid
            </h3>
            <span style={{ color: 'var(--ok)', fontSize: '0.85rem', fontWeight: 600 }}>{completedJobs.length} Jobs</span>
          </div>
          
          {completedJobs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>No completed jobs yet.</p>
          ) : completedJobs.map(job => (
            <div key={job.id} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--paper)' }}>{job.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ok)', fontWeight: 600 }}>
                Earned: +₹{job.payout_amount || 1500}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Submit Work Modal */}
      {submitJobId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--n-900)', border: '1px solid var(--accent-primary)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Submit Deliverable for QC</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Upload your exported JPEG/MP4/PDF spreads to Google Drive, Dropbox, or Frame.io and paste the public link below.
            </p>

            <form onSubmit={handleSubmitWork} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Deliverable Cloud Link *</label>
                <input 
                  type="url" 
                  value={workLink} 
                  onChange={e => setWorkLink(e.target.value)} 
                  placeholder="https://drive.google.com/drive/folders/..."
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--paper)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Editor Notes / Color LUTs Used</label>
                <textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                  placeholder="e.g. Skin tones softened, wedding album layout 12x18 spreads included."
                  rows={3}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--paper)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setSubmitJobId(null)}
                  className="btn-outline" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {submitting ? 'Submitting...' : 'Send for QC'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskQueue;
