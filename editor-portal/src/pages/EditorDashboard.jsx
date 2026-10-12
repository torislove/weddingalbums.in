import React, { useState, useEffect } from 'react';
import { Layers, Image, IndianRupee, Star, PlayCircle, CheckCircle, UploadCloud, Search, DownloadCloud, Scissors, Video, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API } from '../apiConfig';

const EditorDashboard = () => {
  const [stats, setStats] = useState({
    walletBalance: 0,
    totalEarnings: 0,
    completedJobs: 0,
    activeJobs: 0,
    rating: 5.0
  });
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [statsRes, jobsRes] = await Promise.all([
          fetch(`${API}/api/editor/stats`, { headers }),
          fetch(`${API}/api/editor/my-jobs`, { headers })
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
        if (jobsRes.ok) {
          const jData = await jobsRes.json();
          setMyJobs(Array.isArray(jData) ? jData : []);
        }
      } catch (err) {
        console.error('Failed to load editor dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', padding: '1.5rem 2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
            Ready to create magic, <span style={{ color: 'var(--accent-primary)' }}>{user.name || 'Editor'}</span>?
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={16} fill="var(--gold-primary)" color="var(--gold-primary)" /> Premium Creator (Rating: {stats.rating || 5.0}/5) • {stats.activeJobs || myJobs.length} Active Pipeline Jobs
          </p>
        </div>
        <Link to="/photo" className="liquid-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '8px' }}>
          <Search size={20} />
          Browse Open Jobs
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem', borderTop: '4px solid var(--accent-primary)' }}>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
            <Layers size={24} color="var(--accent-primary)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Active Jobs</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{stats.activeJobs || myJobs.length}</h3>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <CheckCircle size={24} color="#f59e0b" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Completed Jobs</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{stats.completedJobs || 0}</h3>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <IndianRupee size={24} color="var(--accent-success)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Available Balance</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--accent-success)' }}>
              ₹{Number(stats.walletBalance || 0).toLocaleString('en-IN')}
            </h3>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
            <Star size={24} color="var(--gold-primary)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Quality Score</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{stats.rating || 5.0}/5</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        
        {/* Active Queue Table */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>My Claimed Work Queue</h3>
            <Link to="/photo" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}>View Workspace</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading active tasks...</p>
            ) : myJobs.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No active claimed jobs right now.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <Link to="/photo" className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Browse Photo Jobs</Link>
                  <Link to="/video" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Browse Video Jobs</Link>
                </div>
              </div>
            ) : myJobs.map(job => (
              <div key={job.id} style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>#{String(job.id).substring(0,8)}</span>
                    <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                      {job.type || 'Photo'}
                    </span>
                    <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                      {job.status}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: '#fff' }}>{job.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.description || 'Wedding post-production edit'}</p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--accent-success)', fontSize: '1.1rem' }}>
                    +₹{job.payout_amount || 1500}
                  </p>
                  <Link to={`/${job.type === 'video' ? 'video' : job.type === 'album' ? 'album' : 'photo'}`} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                    Open Task
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Job Categories</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <Link to="/photo" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '0.9rem', textDecoration: 'none' }}>
                <Scissors size={18} color="#3b82f6" /> Photo Retouching & Culling
              </Link>
              <Link to="/video" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '0.9rem', textDecoration: 'none' }}>
                <Video size={18} color="#ec4899" /> Cinematic Video & Teasers
              </Link>
              <Link to="/album" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '0.9rem', textDecoration: 'none' }}>
                <BookOpen size={18} color="#eab308" /> 12x18 Album Spreads
              </Link>
              <Link to="/earnings" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', padding: '0.9rem', textDecoration: 'none' }}>
                <IndianRupee size={18} color="var(--accent-success)" /> Withdraw via UPI
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditorDashboard;
