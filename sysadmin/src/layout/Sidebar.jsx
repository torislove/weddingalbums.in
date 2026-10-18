import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, ClipboardList,
  Briefcase, Scissors, ShieldCheck, IndianRupee,
  LogOut, Activity, Settings,
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

/* ── Sidebar ───────────────────────────────────────────────────────── */
export const MENU = [
  { group: 'Operations',
    items: [
      { name: 'Dashboard',        path: '/',         icon: LayoutDashboard },
      { name: 'Orders & Payments',path: '/orders',   icon: CreditCard },
      { name: 'Production Tasks', path: '/tasks',    icon: ClipboardList },
      { name: 'Quality Control',  path: '/qc',       icon: ShieldCheck },
    ]
  },
  { group: 'People',
    items: [
      { name: 'Customers & Users',path: '/users',    icon: Users },
      { name: 'Editor Network',   path: '/editors',  icon: Scissors },
      { name: 'Editor Payouts',   path: '/payouts',  icon: IndianRupee },
    ]
  },
  { group: 'System',
    items: [
      { name: 'Pricing & Packages', path: '/pricing', icon: Briefcase },
      { name: 'Audit Logs',         path: '/audit',   icon: Activity },
      { name: 'Settings',           path: '/settings',icon: Settings },
    ]
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 49,
          }}
        />
      )}
    <aside style={{
      width: 250,
      background: 'rgba(0,6,15,0.95)',
      borderRight: '1px solid rgba(14,165,233,0.08)',
      height: '100vh',
      position: 'fixed',
      top: 0, left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      fontFamily: 'Inter, sans-serif',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* Brand */}
      <div style={{ height: 72, padding: '0 16px', boxSizing: 'border-box', borderBottom: '1px solid rgba(14,165,233,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={32} portalTag="Ops Center" to="/" onClick={onClose} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 20, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 6px #22d3ee', animation: 'blink 1.5s infinite' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700, color: '#22d3ee', letterSpacing: 1 }}>ONLINE</span>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--paper)', flexShrink: 0 }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--paper)' }}>{user?.name || 'Admin'}</div>
          <div style={{ fontSize: 10, color: 'rgba(14,165,233,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>SYSADMIN</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {MENU.map(group => (
          <div key={group.group}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', padding: '10px 10px 6px', marginTop: 6 }}>{group.group}</div>
            {group.items.map(item => {
              const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                  color: active ? '#22d3ee' : 'rgba(255,255,255,0.4)',
                  background: active ? 'rgba(14,165,233,0.08)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(14,165,233,0.15)' : 'transparent'}`,
                  textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(239,68,68,0.6)', fontFamily: 'inherit', fontSize: 13,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(239,68,68,0.6)'; }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </aside>
    </>
  );
};

export default Sidebar;
