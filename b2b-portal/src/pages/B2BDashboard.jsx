import React, { useState, useEffect } from 'react';
import { Upload, Clock, CheckCircle, TrendingUp, Star, FileText, Wallet, MessageSquare, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API } from '../apiConfig';

const B2BDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('b2bToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [jobsRes, walletRes] = await Promise.all([
        fetch(`${API}/api/b2b/jobs`, { headers }),
        fetch(`${API}/api/b2b/wallet`, { headers })
      ]);

      if (!jobsRes.ok || !walletRes.ok) throw new Error('Request failed');

      const data = await jobsRes.json();
      setJobs(Array.isArray(data) ? data : []);
      const wData = await walletRes.json();
      setWalletBalance(wData.wallet_balance ?? user.wallet_balance ?? 0);
    } catch (err) {
      console.error('Failed to fetch studio data', err);
      setError('Could not load your studio data');
    } finally {
      setLoading(false);
    }
  }, [user.wallet_balance]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Studio Live Margin Calculator State
  const [calcSize, setCalcSize] = useState('12x36');
  const [calcSheet, setCalcSheet] = useState('karizma');
  const [calcSheetsCount, setCalcSheetsCount] = useState(30);
  const [calcVideo, setCalcVideo] = useState('none');
  const [clientQuote, setClientQuote] = useState(18500);

  // Studio Pricing Catalog Data
  const ALBUM_SIZES = [
    { id: '14x40', name: '14×40 Magnum Royal Mandap', wholesaleBase: 10500, retailRef: 16500 },
    { id: '12x36', name: '12×36 Grand Imperial (AP Standard)', wholesaleBase: 7800, retailRef: 12500 },
    { id: '12x30', name: '12×30 Panoramic Cinema', wholesaleBase: 6800, retailRef: 10500 },
    { id: '10x30', name: '10×30 Slim Cinema', wholesaleBase: 5900, retailRef: 9200 },
    { id: '12x24', name: '12×24 Square Celebration', wholesaleBase: 5400, retailRef: 8500 },
    { id: '10x20', name: '10×20 Compact Square', wholesaleBase: 4600, retailRef: 7200 },
    { id: '12x18-vert', name: '12×18 Royal Vertical Portrait', wholesaleBase: 6200, retailRef: 9800 },
    { id: '10x15-vert', name: '10×15 Editorial Vertical', wholesaleBase: 4900, retailRef: 7600 },
    { id: '8x12-vert', name: '8×12 Traditional Vertical', wholesaleBase: 3800, retailRef: 5800 },
    { id: '6x9-pocket', name: '6×9 Companion Pocket Parent Book', wholesaleBase: 2100, retailRef: 3200 },
  ];

  const SHEET_TYPES = [
    { id: 'karizma', name: 'Karizma Royal Luster', rate: 42, retailRate: 65, gsm: '280 GSM' },
    { id: 'gloss', name: 'Crystal Ultra High-Gloss', rate: 55, retailRate: 85, gsm: '300 GSM' },
    { id: 'velvet', name: 'Velvet Feather Touch', rate: 62, retailRate: 95, gsm: '320 GSM Scuff-Free' },
    { id: 'metallic', name: 'Metallic Pearl Luxury Shimmer', rate: 72, retailRate: 110, gsm: '310 GSM Pearl' },
    { id: 'nt', name: 'Non-Tearable Waterproof NT', rate: 58, retailRate: 90, gsm: '350 Micron Poly' }
  ];

  const VIDEO_OPTIONS = [
    { id: 'none', name: 'No Video Edit', wholesaleRate: 0, retailRef: 0 },
    { id: 'reels', name: '5-Pack Viral 4K Reels', wholesaleRate: 2100, retailRef: 3500 },
    { id: 'teaser', name: '3-5 Min 4K Teaser Trailer', wholesaleRate: 3600, retailRef: 6000 },
    { id: 'feature', name: '4K Feature Film (15-20 min)', wholesaleRate: 6200, retailRef: 10000 },
    { id: 'doc', name: 'Traditional 2-3h Documentary', wholesaleRate: 7500, retailRef: 12000 }
  ];

  // Derived calculation
  const selSizeObj = ALBUM_SIZES.find(s => s.id === calcSize) || ALBUM_SIZES[1];
  const selSheetObj = SHEET_TYPES.find(s => s.id === calcSheet) || SHEET_TYPES[0];
  const selVideoObj = VIDEO_OPTIONS.find(v => v.id === calcVideo) || VIDEO_OPTIONS[0];

  const wholesaleLabCost = selSizeObj.wholesaleBase + (selSheetObj.rate * calcSheetsCount) + selVideoObj.wholesaleRate;
  const suggestedRetail = selSizeObj.retailRef + (selSheetObj.retailRate * calcSheetsCount) + selVideoObj.retailRef;
  const studioProfit = Math.max(0, Number(clientQuote) - wholesaleLabCost);
  const studioMarginPercent = clientQuote > 0 ? Math.round((studioProfit / Number(clientQuote)) * 100) : 0;

  const activeJobsCount = jobs.filter(j => j.status !== 'Completed' && j.status !== 'approved').length;
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

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.9rem' }}>
          <span>⚠ {error}. Your figures below may be stale.</span>
          <button onClick={fetchData} className="btn-outline" style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderColor: 'rgba(239,68,68,0.4)', color: '#f87171' }}>
            Retry
          </button>
        </div>
      )}

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
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
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

      {/* Live Studio Trade Margin Calculator & Slab Estimator */}
      <div className="glass-panel" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)', marginBottom: '2.5rem', border: '1px solid rgba(212,175,55,0.3)', background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(0,0,0,0.7) 100%)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '99px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              ⚡ Protected Wholesale Rate Engine
            </div>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', margin: 0, color: 'var(--paper)' }}>Studio Profit Margin Calculator</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>Configure album specs, sheets, and video edits to view your retained profit margin.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--ok)', background: 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <ShieldCheck size={16} /> 100% White-Label Drop-Shipping Included
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Size Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>1. Album Dimension</label>
            <select 
              value={calcSize} 
              onChange={e => setCalcSize(e.target.value)}
              className="form-control"
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--paper)', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
            >
              {ALBUM_SIZES.map(s => (
                <option key={s.id} value={s.id} style={{ background: 'var(--n-900)', color: 'var(--paper)' }}>
                  {s.name} (Lab: ₹{s.wholesaleBase.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Sheet Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>2. Luxury Sheet Finish</label>
            <select 
              value={calcSheet} 
              onChange={e => setCalcSheet(e.target.value)}
              className="form-control"
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--paper)', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
            >
              {SHEET_TYPES.map(s => (
                <option key={s.id} value={s.id} style={{ background: 'var(--n-900)', color: 'var(--paper)' }}>
                  {s.name} (Trade: ₹{s.rate}/sheet)
                </option>
              ))}
            </select>
          </div>

          {/* Sheets Count */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
              <span>3. Sheet Count</span>
              <span style={{ color: 'var(--gold-primary)' }}>{calcSheetsCount} Sheets ({calcSheetsCount * 2} Pages)</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="60" 
              value={calcSheetsCount} 
              onChange={e => setCalcSheetsCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Video Addon */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>4. Cinema Video Add-on</label>
            <select 
              value={calcVideo} 
              onChange={e => setCalcVideo(e.target.value)}
              className="form-control"
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--paper)', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
            >
              {VIDEO_OPTIONS.map(v => (
                <option key={v.id} value={v.id} style={{ background: 'var(--n-900)', color: 'var(--paper)' }}>
                  {v.name} {v.wholesaleRate > 0 ? `(+₹${v.wholesaleRate.toLocaleString('en-IN')})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Calculation Bar */}
        <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Wholesale Lab Cost (Your Cost)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--paper)', fontFamily: 'monospace' }}>
              ₹{wholesaleLabCost.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>All Taxes + Courier Included</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>You Bill Couple (Retail Quote)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>₹</span>
              <input 
                type="number" 
                value={clientQuote} 
                onChange={e => setClientQuote(Math.max(0, Number(e.target.value)))}
                style={{ width: '140px', padding: '6px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,175,55,0.4)', color: 'var(--gold-primary)', borderRadius: '6px', fontWeight: 700, fontSize: '1.2rem', fontFamily: 'monospace', outline: 'none' }}
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Suggested Retail: ₹{suggestedRetail.toLocaleString('en-IN')}</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ok)', letterSpacing: '0.5px', fontWeight: 'bold' }}>Your Retained Studio Margin</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ok)', fontFamily: 'monospace' }}>
              +₹{studioProfit.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 600 }}>
              {studioMarginPercent}% Profit Margin
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link 
              to={`/submit?size=${calcSize}&sheet=${calcSheet}&sheets=${calcSheetsCount}&video=${calcVideo}`}
              className="liquid-btn"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
            >
              <span>Submit with This Spec</span>
              <ArrowRight size={16} />
            </Link>
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
                ) : error && jobs.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#f87171' }}>
                    {error}. <button onClick={fetchData} style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
                  </td></tr>
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
