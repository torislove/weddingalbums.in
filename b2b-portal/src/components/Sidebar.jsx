import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Briefcase, 
  FileText, 
  Wallet, 
  ShoppingBag,
  Clock,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import Logo from './Logo';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Wholesale Rates', path: '/catalog', icon: ShoppingBag },
    { name: 'Submit Job', path: '/submit', icon: UploadCloud },
    { name: 'Active Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Album Orders', path: '/albums', icon: FileText },
    { name: 'Invoices', path: '/invoices', icon: Wallet },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'SLA Guarantees', path: '/sla', icon: Clock },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 998,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}>
          <Logo size={34} portalTag="Studio Partner" to="/dashboard" onClick={onClose} />
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', padding: '4px', borderRadius: '6px'
            }}
            aria-label="Close menu"
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
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
          <div className="glass-panel" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={22} color="var(--gold-primary)" />
            <div>
              <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-secondary)' }}>Status</p>
              <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>Platinum Studio</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
