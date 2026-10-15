import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Scissors, Video, BookOpen, IndianRupee, Star, HelpCircle, X } from 'lucide-react';
import Logo from './Logo';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Photo Queue', path: '/photo', icon: Scissors },
    { name: 'Video Queue', path: '/video', icon: Video },
    { name: 'Album Queue', path: '/album', icon: BookOpen },
    { name: 'Earnings', path: '/earnings', icon: IndianRupee },
    { name: 'My Rating', path: '/rating', icon: Star },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' }}>
          <Logo size={34} portalTag="Creator Suite" />
          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              display: 'none',
              borderRadius: '8px'
            }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink 
              key={item.name} 
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              4.9
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>Editor Rating</p>
              <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 600, color: 'var(--accent-success)' }}>Top Rated</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
