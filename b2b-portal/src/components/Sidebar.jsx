import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Briefcase, 
  FileText, 
  Users, 
  Wallet, 
  ShoppingBag,
  Clock,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import Logo from './Logo';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Submit Job', path: '/submit', icon: UploadCloud },
    { name: 'Active Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Album Orders', path: '/albums', icon: ShoppingBag },
    { name: 'Invoices', path: '/invoices', icon: FileText },
    { name: 'My Team', path: '/team', icon: Users },
    { name: 'Wallet & Payouts', path: '/wallet', icon: Wallet },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'SLA Guarantees', path: '/sla', icon: Clock },
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
          <ShieldCheck size={24} color="var(--gold-primary)" />
          <div>
            <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>Status</p>
            <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>Platinum Studio</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
