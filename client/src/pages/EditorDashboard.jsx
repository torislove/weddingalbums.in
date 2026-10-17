import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { API } from '../apiConfig';
import { useT } from '../context/LanguageContext';
import './PhotographerDashboard.css'; // Reusing layout CSS

const EditorDashboard = () => {
  const t = useT();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'editor')) {
      navigate('/login?role=editor');
    } else if (user) {
      fetchTasks();
      fetchWallet();
    }
  }, [user, loading, navigate]);

  const [activeTab, setActiveTab] = useState('active'); // active, earnings

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${API}/api/editor/stats`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.walletBalance ?? 0);
      }
    } catch (err) {
      console.error('Failed to fetch wallet', err);
    }
  };

  const requestPayout = async () => {
    try {
      const res = await fetch(`${API}/api/editor/payout-request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: walletBalance })
      });
      const data = await res.json();
      if (res.ok) {
        setToastMessage(data.message);
        fetchWallet();
      } else {
        setToastMessage(data.error);
      }
    } catch (err) {
      setToastMessage(t('edash.payout_failed'));
    }
  };

  const claimTask = async (id) => {
    try {
      await fetch(`${API}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'Designing', editorAssigned: user.name })
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to claim task', err);
    }
  };

  if (loading) return <div className="text-center p-10 text-gray-500">{t('edash.loading')}</div>;
  if (!user) return <div className="text-center p-10 text-gray-500">{t('edash.redirecting')}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{t('edash.workspace')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('edash.welcome', { name: user.name })}</p>
        </div>
        <div style={{ backgroundColor: '#1a1a1a', padding: '15px 25px', borderRadius: '12px', border: '1px solid #333', textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('cdash.wallet_balance')}</p>
          <h2 style={{ color: 'var(--primary)', margin: '5px 0' }}>₹{walletBalance.toLocaleString()}</h2>
          <button 
            className="btn btn-primary" 
            style={{ padding: '5px 15px', fontSize: '0.8rem' }}
            onClick={requestPayout}
            disabled={walletBalance === 0}
          >
            {t('edash.request_payout')}
          </button>
        </div>
      </div>

      <div className="tab-menu" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('active')}>{t('edash.tab_active')}</button>
        <button className={`btn ${activeTab === 'earnings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('earnings')}>{t('edash.tab_earnings')}</button>
      </div>

      {activeTab === 'active' ? (
        <>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>{t('edash.available')}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{t('edash.available_sub')}</p>
          </div>

      <div className="projects-grid">
        {tasks.filter(task => task.status === 'Pending').length === 0 && (
          <p className="empty-state">{t('edash.no_jobs')}</p>
        )}
        
        {tasks.filter(task => task.status === 'Pending').reverse().map(task => (
          <div className="project-card" key={task.id}>
            <h3>{task.type}</h3>
            <p className="meta">{task.clientName} {t('edash.wedding')} (Studio: {task.studioName})</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p><strong>{t('edash.instructions')}</strong> {task.details}</p>
            </div>
            <div className="project-actions" style={{ marginTop: '20px' }}>
              <button className="btn btn-primary" style={{ width: '100%', padding: '10px' }} onClick={() => claimTask(task.id)}>
                {t('edash.claim')}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ margin: '40px 0 20px 0' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>{t('edash.your_active')}</h2>
      </div>

      <div className="projects-grid">
        {tasks.filter(task => task.editorAssigned === user.name && task.status !== 'Completed').length === 0 && (
          <p className="empty-state">{t('edash.no_active')}</p>
        )}
        
        {tasks.filter(task => task.editorAssigned === user.name && task.status !== 'Completed').map(task => (
          <div className="project-card" key={task.id} style={{ border: '1px solid var(--primary)' }}>
            <h3>{task.type}</h3>
            <p className="meta">{task.clientName} {t('edash.wedding')}</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p><strong>{t('edash.status')}</strong> <span style={{ color: 'var(--primary)' }}>{task.status}</span></p>
            </div>
            <div className="project-actions" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-secondary link-btn" onClick={() => setToastMessage(t('edash.opening_repo'))}>
                {t('edash.download_raw')}
              </button>
              <button className="btn btn-primary" onClick={() => setToastMessage(t('edash.uploading_edits'))}>
                {t('edash.submit_edits')}
              </button>
            </div>
          </div>
        ))}
      </div>
      </>
      ) : (
        <div className="earnings-history-tab">
          <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>{t('edash.earnings_title')}</h2>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ margin: 0 }}>{t('edash.total_earned')} <strong style={{ color: 'var(--ok)', fontSize: '1.2rem' }}>₹{walletBalance.toLocaleString()}</strong></p>
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '15px 10px', color: '#ccc' }}>{t('edash.th_date')}</th>
                <th style={{ padding: '15px 10px', color: '#ccc' }}>{t('edash.th_project')}</th>
                <th style={{ padding: '15px 10px', color: '#ccc' }}>{t('edash.th_amount')}</th>
                <th style={{ padding: '15px 10px', color: '#ccc' }}>{t('edash.th_status')}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>Oct 1, 2026</td>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>PRJ-102 (Sneha & Arjun)</td>
                <td style={{ padding: '15px 10px', color: 'var(--ok)' }}>+ ₹1,500</td>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>Paid</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>Sep 28, 2026</td>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>PRJ-098 (Meera Weds Rahul)</td>
                <td style={{ padding: '15px 10px', color: 'var(--ok)' }}>+ ₹2,000</td>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>Paid</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default EditorDashboard;
