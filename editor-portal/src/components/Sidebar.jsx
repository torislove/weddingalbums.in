import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Scissors, Video, BookOpen, IndianRupee, Star, HelpCircle } from 'lucide-react';
import Logo from './Logo';

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
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <Logo size={35} />
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
