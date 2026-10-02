import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ title = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="topbar" style={{ position: 'relative' }}>
      <div style={{ flex: 1 }}>
        {title && <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h1>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotifOpen(v => !v); setMenuOpen(false); }}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s', position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
          >
            <Bell size={17} />
            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', background: '#ef4444', borderRadius: '50%', border: '1.5px solid var(--bg-secondary, #0f0f0f)' }} />
          </button>

          {notifOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '300px', background: 'rgba(15,15,25,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', padding: '6px', zIndex: 100 }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Notifications</span>
              </div>
              {[
                { text: 'New job available: Wedding Album Design', time: '2 min ago', dot: '#d4af37' },
                { text: 'Payout of ₹2,400 processed', time: '1 hr ago', dot: '#22c55e' },
              ].map((n, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.dot, marginTop: '5px', flexShrink: 0, boxShadow: `0 0 8px ${n.dot}` }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.5' }}>{n.text}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setMenuOpen(v => !v); setNotifOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px 6px 6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
          >
            {/* Avatar */}
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37, #8a6f00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#1a0e00', letterSpacing: '0.5px' }}>
              {initials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '500', color: 'rgba(255,255,255,0.85)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.studioName || user?.name || 'User'}
              </p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', textTransform: 'capitalize' }}>
                {user?.role || 'member'}
              </p>
            </div>
            <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.3)', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {menuOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '200px', background: 'rgba(15,15,25,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', padding: '6px', zIndex: 100 }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>{user?.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)' }}>{user?.email}</p>
              </div>
              {[
                { icon: User, label: 'Profile', action: () => navigate('/profile') },
                { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'none', border: 'none', borderRadius: '10px', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: '0.86rem', fontFamily: 'inherit', transition: 'all 0.2s', textAlign: 'left' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  <item.icon size={15} />
                  {item.label}
                </button>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
              <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'none', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#ef4444', fontSize: '0.86rem', fontFamily: 'inherit', transition: 'all 0.2s', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(menuOpen || notifOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => { setMenuOpen(false); setNotifOpen(false); }} />
      )}
    </header>
  );
};

export default TopBar;
