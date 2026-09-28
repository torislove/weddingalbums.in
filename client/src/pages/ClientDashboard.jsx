import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Image as ImageIcon, Settings, LogOut } from 'lucide-react';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/client', icon: LayoutDashboard },
    { name: 'Order History', path: '/client/orders', icon: ShoppingBag },
    { name: 'Album Proofs', path: '/client/proofs', icon: ImageIcon },
    { name: 'Settings', path: '/client/settings', icon: Settings },
  ];

  return (
    <div className="client-dashboard-layout">
      <div className="client-sidebar">
        <div className="sidebar-header">
          <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div>
            <h3>{user?.name || 'Client'}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`sidebar-link ${(location.pathname === item.path || (item.path !== '/client' && location.pathname.startsWith(item.path))) ? 'active' : ''}`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>
      
      <div className="client-main-content">
        {location.pathname === '/client' ? (
          <div className="dashboard-overview fade-in">
            <h2>Welcome back, {user?.name?.split(' ')[0] || 'Client'}!</h2>
            <p className="subtitle">Here's what's happening with your memories.</p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon bg-gold-glow"><ShoppingBag size={24} color="#D4AF37" /></div>
                <div className="stat-info">
                  <h4>Total Orders</h4>
                  <span>2</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon bg-blue-glow"><ImageIcon size={24} color="#3b82f6" /></div>
                <div className="stat-info">
                  <h4>Pending Proofs</h4>
                  <span>1</span>
                </div>
              </div>
              <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/services')}>
                <div className="stat-icon bg-purple-glow"><ShoppingBag size={24} color="#a855f7" /></div>
                <div className="stat-info">
                  <h4>New Order</h4>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Browse Services</span>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-indicator status-progress"></div>
                  <div className="activity-details">
                    <h4>Wedding Cinematic Film</h4>
                    <p>Editing in progress. ETA: 2 days.</p>
                  </div>
                  <span className="activity-date">Oct 12, 2026</span>
                </div>
                <div className="activity-item">
                  <div className="activity-indicator status-completed"></div>
                  <div className="activity-details">
                    <h4>Pre-Wedding Photoshoot Album</h4>
                    <p>Delivered to your address.</p>
                  </div>
                  <span className="activity-date">Sep 28, 2026</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
