import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Scissors, Video, BookOpen, IndianRupee, Star, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Photo Queue', path: '/photo', icon: Scissors },
    { name: 'Video Queue', path: '/video', icon: Video },
    { name: 'Album Queue', path: '/album', icon: BookOpen },
    { name: 'Earnings', path: '/earnings', icon: IndianRupee },
    { name: 'My Rating', path: '/rating', icon: Star },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scissors color="var(--accent-primary)" />
          Creators Hub
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>WeddingAlbums.in</p>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink 
            key={item.name} 
            to={item.path}
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
  );
};

export default Sidebar;
