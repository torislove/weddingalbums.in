import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Image as ImageIcon,
  Settings, LogOut, Heart, CheckCircle2, Truck,
  Package, Camera, Download, Phone, CreditCard,
  ChevronDown, ChevronUp, Wallet, ExternalLink,
} from 'lucide-react';
import './ClientDashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/* ── Timeline step definitions ─────────────────────────────────────── */
const TIMELINE_STEPS = [
  { label: 'Order Confirmed',       icon: CheckCircle2, key: 'confirmed' },
  { label: 'Photos Received',       icon: Camera,       key: 'received'  },
  { label: 'Editing in Progress',   icon: ImageIcon,    key: 'editing'   },
  { label: 'Proof Ready for Review',icon: Heart,        key: 'proofing'  },
  { label: 'Approved & Printing',   icon: Package,      key: 'printing'  },
  { label: 'Shipped to You',        icon: Truck,        key: 'shipped'   },
  { label: 'Delivered',             icon: CheckCircle2, key: 'delivered' },
];

const MOCK_ORDERS = [
  {
    id: 'WA-2026-0048',
    name: 'Wedding Album — 12×18 Premium',
    status: 'editing',
    statusColor: '#3b82f6',
    statusLabel: 'In Editing',
    badgeBg: 'rgba(59,130,246,0.1)',
    badgeColor: '#3b82f6',
    date: 'Oct 10, 2026',
    amount: '₹8,500',
    currentStep: 2, // index in TIMELINE_STEPS
  },
  {
    id: 'WA-2026-0031',
    name: 'Pre-Wedding Photo Album',
    status: 'delivered',
    statusColor: '#22c55e',
    statusLabel: 'Delivered',
    badgeBg: 'rgba(34,197,94,0.1)',
    badgeColor: '#22c55e',
    date: 'Sep 28, 2026',
    amount: '₹4,200',
    currentStep: 6,
  },
];

/* ── Order card with expandable timeline ───────────────────────────── */
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(order.status !== 'delivered');

  return (
    <div className="cdash-order-card">
      <div className="cdash-order-head" onClick={() => setExpanded(v => !v)}>
        <div className="cdash-order-status-dot" style={{ background: order.statusColor, boxShadow: `0 0 8px ${order.statusColor}` }} />
        <div className="cdash-order-name">{order.name}</div>
        <div className="cdash-order-id">{order.id}</div>
        <div className="cdash-order-badge" style={{ background: order.badgeBg, color: order.badgeColor }}>
          {order.statusLabel}
        </div>
        {expanded ? <ChevronUp size={16} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                  : <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />}
      </div>

      {expanded && (
        <div className="cdash-timeline">
          {TIMELINE_STEPS.map((step, i) => {
            const isDone   = i < order.currentStep;
            const isActive = i === order.currentStep;
            const Icon = step.icon;
            return (
              <div key={step.key} className={`cdash-tl-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                <div className="cdash-tl-icon">
                  {isDone
                    ? <CheckCircle2 size={12} />
                    : isActive
                      ? <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }} />
                      : <Icon size={11} style={{ opacity: 0.3 }} />
                  }
                </div>
                <div className="cdash-tl-body">
                  <div className="cdash-tl-label">{step.label}</div>
                  <div className="cdash-tl-time">
                    {isDone ? '✓ Completed' : isActive ? 'In progress — ETA 2 days' : 'Upcoming'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Main dashboard component ─────────────────────────────────────── */
const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [wallet, setWallet] = useState(user?.wallet_balance ?? 0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API}/api/wallet`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.wallet_balance !== undefined) setWallet(d.wallet_balance); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard',    path: '/client',          icon: LayoutDashboard },
    { name: 'My Orders',    path: '/client/orders',   icon: ShoppingBag,  badge: '2' },
    { name: 'Album Proofs', path: '/client/proofs',   icon: ImageIcon,    badge: '1' },
    { name: 'Wallet',       path: '/client/wallet',   icon: Wallet },
    { name: 'Settings',     path: '/client/settings', icon: Settings },
  ];

  const isHome = location.pathname === '/client';

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="cdash-root">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="cdash-sidebar">
        {/* Brand */}
        <div className="cdash-sb-brand">
          <div className="cdash-sb-brand-dot">💍</div>
          <span className="cdash-sb-brand-name">WeddingAlbums.in</span>
        </div>

        {/* User */}
        <div className="cdash-sb-user">
          <div className="cdash-sb-avatar">{initials}</div>
          <div>
            <div className="cdash-sb-name">{user?.coupleNames || user?.name || 'Client'}</div>
            <div className="cdash-sb-role">💑 Client</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="cdash-sb-nav">
          <div className="cdash-nav-label">Navigation</div>
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`cdash-nav-item ${(location.pathname === item.path || (item.path !== '/client' && location.pathname.startsWith(item.path))) ? 'active' : ''}`}
            >
              <item.icon size={17} />
              {item.name}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </Link>
          ))}

          <div className="cdash-nav-label" style={{ marginTop: '16px' }}>Quick Links</div>
          <a href="/services" className="cdash-nav-item">
            <Camera size={17} /> Browse Services
          </a>
          <a href="/track" className="cdash-nav-item">
            <Truck size={17} /> Track Delivery
          </a>
        </nav>

        {/* Wallet balance */}
        <div className="cdash-sb-wallet">
          <div className="cdash-sb-wallet-label">Wallet Balance</div>
          <div className="cdash-sb-wallet-amount">₹{wallet.toLocaleString('en-IN')}</div>
        </div>

        {/* Logout */}
        <button className="cdash-sb-logout" onClick={handleLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="cdash-main">
        {isHome ? (
          <>
            {/* Page Header */}
            <div className="cdash-page-header">
              <div className="overline">Client Portal</div>
              <h1>Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
              <p>Here's the latest on your album journey. Your memories are in safe hands.</p>
            </div>

            {/* Stats */}
            <div className="cdash-stats">
              {[
                { color: 'gold',   icon: ShoppingBag, label: 'Total Orders',    value: '2',          sub: 'Lifetime' },
                { color: 'blue',   icon: ImageIcon,   label: 'Pending Proofs',  value: '1',          sub: 'Awaiting approval' },
                { color: 'green',  icon: CheckCircle2,label: 'Delivered Albums', value: '1',          sub: 'Successfully shipped' },
                { color: 'purple', icon: Wallet,      label: 'Wallet Balance',  value: `₹${wallet.toLocaleString('en-IN')}`, sub: 'Credits & refunds' },
              ].map((s, i) => (
                <div key={i} className={`cdash-stat ${s.color}`}>
                  <div className="cdash-stat-icon">
                    <s.icon size={20} color={s.color === 'gold' ? '#d4af37' : s.color === 'blue' ? '#3b82f6' : s.color === 'green' ? '#22c55e' : '#a855f7'} />
                  </div>
                  <div className="cdash-stat-label">{s.label}</div>
                  <div className="cdash-stat-value">{s.value}</div>
                  <div className="cdash-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Active Orders with Timeline */}
            <div className="cdash-section">
              <div className="cdash-section-title">Your Orders</div>
              {MOCK_ORDERS.map(order => <OrderCard key={order.id} order={order} />)}
            </div>

            {/* Quick Actions */}
            <div className="cdash-section">
              <div className="cdash-section-title">Quick Actions</div>
              <div className="cdash-actions">
                {[
                  { label: 'New Order',      icon: ShoppingBag, to: '/order' },
                  { label: 'View Proofs',    icon: ImageIcon,   to: '/client/proofs' },
                  { label: 'Download Invoice', icon: Download,  to: '/client/orders' },
                  { label: 'Call Support',   icon: Phone,       href: 'tel:+919999000001' },
                  { label: 'Payment History',icon: CreditCard,  to: '/client/wallet' },
                  { label: 'Refer & Earn',   icon: Heart,       to: '/client/referral' },
                ].map((a, i) => (
                  a.href
                    ? <a key={i} href={a.href} className="cdash-action-btn">
                        <div className="cdash-action-icon"><a.icon size={20} color="#d4af37" /></div>
                        {a.label}
                      </a>
                    : <Link key={i} to={a.to} className="cdash-action-btn">
                        <div className="cdash-action-icon"><a.icon size={20} color="#d4af37" /></div>
                        {a.label}
                      </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
