import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import './PhotographerDashboard.css'; // Reusing layout CSS

const EditorDashboard = () => {
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
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const fetchWallet = async () => {
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/wallet`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.balance);
      }
    } catch (err) {
      console.error('Failed to fetch wallet', err);
    }
  };

  const requestPayout = async () => {
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/payout`, {
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
        setWalletBalance(data.newBalance);
      } else {
        setToastMessage(data.error);
      }
    } catch (err) {
      setToastMessage('Payout request failed');
    }
  };

  const claimTask = async (id) => {
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      await fetch(`${API}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Designing', editorAssigned: user.name })
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to claim task', err);
    }
  };

  if (loading) return <div className="text-center p-10 text-gray-500">Loading...</div>;
  if (!user) return <div className="text-center p-10 text-gray-500">Redirecting to login...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Editor Workspace</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.name} | Freelance Editor</p>
        </div>
        <div style={{ backgroundColor: '#1a1a1a', padding: '15px 25px', borderRadius: '12px', border: '1px solid #333', textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Wallet Balance</p>
          <h2 style={{ color: 'var(--primary)', margin: '5px 0' }}>₹{walletBalance.toLocaleString()}</h2>
          <button 
            className="btn btn-primary" 
            style={{ padding: '5px 15px', fontSize: '0.8rem' }}
            onClick={requestPayout}
            disabled={walletBalance === 0}
          >
            Request Payout
          </button>
        </div>
      </div>

      <div className="tab-menu" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('active')}>Active Jobs</button>
        <button className={`btn ${activeTab === 'earnings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('earnings')}>Earnings History</button>
      </div>

      {activeTab === 'active' ? (
        <>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Available Jobs</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Claim tasks from the queue below to start working.</p>
          </div>

      <div className="projects-grid">
        {tasks.filter(t => t.status === 'Pending').length === 0 && (
          <p className="empty-state">No jobs available right now. Check back later.</p>
        )}
        
        {tasks.filter(t => t.status === 'Pending').reverse().map(task => (
          <div className="project-card" key={task.id}>
            <h3>{task.type}</h3>
            <p className="meta">{task.clientName} Wedding (Studio: {task.studioName})</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p><strong>Instructions:</strong> {task.details}</p>
            </div>
            <div className="project-actions" style={{ marginTop: '20px' }}>
              <button className="btn btn-primary" style={{ width: '100%', padding: '10px' }} onClick={() => claimTask(task.id)}>
                Claim Job
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ margin: '40px 0 20px 0' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Your Active Jobs</h2>
      </div>

      <div className="projects-grid">
        {tasks.filter(t => t.editorAssigned === user.name && t.status !== 'Completed').length === 0 && (
          <p className="empty-state">You have no active jobs.</p>
        )}
        
        {tasks.filter(t => t.editorAssigned === user.name && t.status !== 'Completed').map(task => (
          <div className="project-card" key={task.id} style={{ border: '1px solid var(--primary)' }}>
            <h3>{task.type}</h3>
            <p className="meta">{task.clientName} Wedding</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p><strong>Status:</strong> <span style={{ color: 'var(--primary)' }}>{task.status}</span></p>
            </div>
            <div className="project-actions" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-secondary link-btn" onClick={() => setToastMessage('Opening file repository...')}>
                Download Raw Files
              </button>
              <button className="btn btn-primary" onClick={() => setToastMessage('Uploading final edits and notifying photographer... (Mock)')}>
                Submit Edits & Get Paid
              </button>
            </div>
          </div>
        ))}
      </div>
      </>
      ) : (
        <div className="earnings-history-tab">
          <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Your Earnings History</h2>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ margin: 0 }}>Total Earned: <strong style={{ color: '#10b981', fontSize: '1.2rem' }}>₹{walletBalance.toLocaleString()}</strong></p>
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '15px 10px', color: '#ccc' }}>Date</th>
                <th style={{ padding: '15px 10px', color: '#ccc' }}>Project</th>
                <th style={{ padding: '15px 10px', color: '#ccc' }}>Amount</th>
                <th style={{ padding: '15px 10px', color: '#ccc' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>Oct 1, 2026</td>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>PRJ-102 (Sneha & Arjun)</td>
                <td style={{ padding: '15px 10px', color: '#10b981' }}>+ ₹1,500</td>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>Paid</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>Sep 28, 2026</td>
                <td style={{ padding: '15px 10px', color: '#aaa' }}>PRJ-098 (Meera Weds Rahul)</td>
                <td style={{ padding: '15px 10px', color: '#10b981' }}>+ ₹2,000</td>
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
