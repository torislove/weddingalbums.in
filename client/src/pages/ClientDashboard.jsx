import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Image as ImageIcon,
  Settings, LogOut, Heart, CheckCircle2, Truck,
  Package, Camera, Download, Phone, CreditCard,
  ChevronDown, ChevronUp, Wallet, ExternalLink,
  Home, ArrowLeft
} from 'lucide-react';
import Logo from '../components/Logo';
import './ClientDashboard.css';
import { API } from '../apiConfig';
import { useT } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

/* ── Timeline step definitions ─────────────────────────────────────── */
const TIMELINE_STEPS = [
  { labelKey: 'cdash.tl_confirmed', icon: CheckCircle2, key: 'confirmed' },
  { labelKey: 'cdash.tl_received',  icon: Camera,       key: 'received'  },
  { labelKey: 'cdash.tl_editing',   icon: ImageIcon,    key: 'editing'   },
  { labelKey: 'cdash.tl_proofing',  icon: Heart,        key: 'proofing'  },
  { labelKey: 'cdash.tl_printing',  icon: Package,      key: 'printing'  },
  { labelKey: 'cdash.tl_shipped',   icon: Truck,        key: 'shipped'   },
  { labelKey: 'cdash.tl_delivered', icon: CheckCircle2, key: 'delivered' },
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

/* ── Order card with expandable timeline & full booked specifications ─── */
const OrderCard = ({ order }) => {
  const t = useT();
  const { content } = useContent();
  const rawWa = content?.siteSettings?.whatsapp || content?.global?.siteSettings?.whatsapp || content?.global?.navbar?.whatsapp || '919494845111';
  const cleanWa = String(rawWa).replace(/[^0-9]/g, '') || '919494845111';
  const [expanded, setExpanded] = useState(order.status !== 'delivered');
  const items = order.items && order.items.length > 0 ? order.items : [];

  const openWhatsAppTrack = (e) => {
    e.stopPropagation();
    const msg = `నమస్కారం WeddingAlbums.in టీమ్! నా ఆర్డర్ Reference: ${order.id} గురించి లేటెస్ట్ స్టేటస్ మరియు ప్రూఫ్ అప్‌డేట్స్ తెలుసుకోవాలనుకుంటున్నాను.`;
    window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="cdash-order-card">
      <div className="cdash-order-head" onClick={() => setExpanded(v => !v)}>
        <div className="cdash-order-status-dot" style={{ background: order.statusColor, boxShadow: `0 0 8px ${order.statusColor}` }} />
        <div className="cdash-order-name">
          <div className="font-bold text-white text-sm sm:text-base flex items-center gap-2 flex-wrap">
            <span>{order.name}</span>
            {order.packageType === 'bundles' ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold uppercase">
                {t('cdash.bundle')}
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold uppercase">
                {t('cdash.custom')}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-2 flex-wrap">
            <span>{order.date}</span>
            <span>•</span>
            <span className="text-[#D4AF37] font-mono font-bold">{order.amount}</span>
            <span>•</span>
            <span>{order.city ? t('cdash.event_in', { type: order.eventType || t('cdash.event'), city: order.city }) : t('cdash.andhra')}</span>
          </div>
        </div>
        <div className="cdash-order-right-meta">
          <span className="cdash-order-id">{order.id}</span>
          <span className="cdash-order-badge" style={{ background: order.badgeBg, color: order.badgeColor }}>
            {order.statusLabel}
          </span>
        </div>
        <div className="cdash-order-chevron">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <>
          {/* Timeline */}
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
                    <div className="cdash-tl-label">{t(step.labelKey)}</div>
                    <div className="cdash-tl-time">
                      {isDone ? t('cdash.tl_done') : isActive ? t('cdash.tl_active') : t('cdash.tl_upcoming')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booked Services & Specifications Breakdown */}
          <div className="cdash-order-details">
            <div className="cdash-details-header">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                {t('cdash.booked_items')} ({items.length || 1} {t('cart.items')})
              </span>
              <span className="text-xs font-mono font-bold text-[#D4AF37]">
                {t('cart.total')}: {order.amount}
              </span>
            </div>

            {/* Meta Strip: Speed, Location & Media Inward */}
            <div className="cdash-meta-strip">
              <span>
                <Truck size={14} className="text-[#D4AF37]" />
                {order.deliverySpeed === 'express' ? t('cdash.express') : t('cdash.standard')}
              </span>
              {order.city && (
                <span>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  {t('oh.destination')} {order.city}
                </span>
              )}
              {order.cloudLink && (
                <a
                  href={order.cloudLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Download size={14} /> {t('cdash.open_drive_photos')}
                </a>
              )}
            </div>

            {/* Items Grid */}
            {items.length > 0 ? (
              <div className="cdash-items-grid">
                {items.map((it, idx) => (
                  <div key={idx} className="cdash-item-chip">
                    <div className="cdash-item-head">
                      <div className="cdash-item-title">{it.name}</div>
                      {it.price && <div className="cdash-item-price">₹{Number(it.price).toLocaleString('en-IN')}</div>}
                    </div>
                    {it.details && <div className="cdash-item-desc">{it.details}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300 mb-4">
                <strong>{t('cdash.std_package_label')}</strong> {t('cdash.std_package_desc')}
              </div>
            )}

            {/* Quick Actions */}
            <div className="cdash-order-actions-bar">
              <button
                type="button"
                onClick={openWhatsAppTrack}
                className="cdash-btn-action cdash-btn-whatsapp"
              >
                <Phone size={14} /> {t('oh.track_wa')}
              </button>
              <Link
                to="/client/proofs"
                className="cdash-btn-action cdash-btn-proofs"
              >
                <ImageIcon size={14} /> {t('oh.view_proofs')}
              </Link>
              <a
                href={`${API}/api/orders/${order.id}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="cdash-btn-action cdash-btn-invoice"
              >
                <Download size={14} /> {t('oh.download_invoice')}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Main dashboard component ─────────────────────────────────────── */
const ClientDashboard = () => {
  const t = useT();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [wallet, setWallet] = useState(user?.wallet_balance ?? 0);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API}/api/client/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.wallet_balance !== undefined) setWallet(d.wallet_balance); })
        .catch(() => {});
    }

    // Fetch user's orders with full itemization and metadata
    const fetchOrders = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API}/api/orders`, { headers });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            // Filter by user email if available
            const userOrders = list.filter(ord => {
              if (!user?.email) return true;
              const ordEmail = ord.email || ord.userEmail || ord.data?.userEmail;
              return ordEmail ? ordEmail.toLowerCase() === user.email.toLowerCase() : true;
            });

            const mapped = (userOrders.length > 0 ? userOrders : list.slice(0, 5)).map(ord => {
              const statusStr = (ord.status || 'Confirmed').toLowerCase();
              let stepIdx = 0;
              let color = '#3b82f6';
              if (statusStr.includes('deliver')) { stepIdx = 6; color = '#22c55e'; }
              else if (statusStr.includes('ship')) { stepIdx = 5; color = '#10b981'; }
              else if (statusStr.includes('print')) { stepIdx = 4; color = '#a855f7'; }
              else if (statusStr.includes('proof')) { stepIdx = 3; color = '#ec4899'; }
              else if (statusStr.includes('edit')) { stepIdx = 2; color = '#3b82f6'; }
              else if (statusStr.includes('receiv')) { stepIdx = 1; color = '#eab308'; }

              const orderItems = ord.items && Array.isArray(ord.items) && ord.items.length > 0
                ? ord.items
                : ord.data?.items && Array.isArray(ord.data?.items) && ord.data?.items.length > 0
                ? ord.data.items
                : [];

              const pkgType = ord.data?.packageType || (ord.data?.appliedBundle ? 'bundles' : 'custom');

              return {
                id: ord.id || ord.orderId || 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
                name: ord.name || (pkgType === 'bundles' ? 'Royal Wedding Master Suite' : 'Custom Wedding Multi-Service Package'),
                status: statusStr,
                statusColor: color,
                statusLabel: ord.status || 'Confirmed',
                badgeBg: `${color}15`,
                badgeColor: color,
                date: new Date(ord.createdAt || ord.created_at || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
                amount: `₹${(ord.total || ord.data?.total || 7500).toLocaleString('en-IN')}`,
                currentStep: stepIdx,
                items: orderItems,
                packageType: pkgType,
                city: ord.data?.event?.city || ord.data?.city,
                eventType: ord.data?.event?.type || ord.data?.eventType,
                deliverySpeed: ord.data?.event?.speed || ord.data?.deliverySpeed,
                cloudLink: ord.cloudLink || ord.data?.cloudLink,
                uploadPreference: ord.uploadPreference || ord.data?.uploadPreference,
                phone: ord.phone || ord.data?.phone
              };
            });
            setOrders(mapped);
          }
        }
      } catch (e) {
        console.warn('Orders fetch error:', e);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: t('cdash.nav_dashboard'), path: '/client',          icon: LayoutDashboard },
    { name: t('cdash.nav_orders'),    path: '/client/orders',   icon: ShoppingBag,  badge: '2' },
    { name: t('cdash.nav_proofs'),    path: '/client/proofs',   icon: ImageIcon,    badge: '1' },
    { name: t('cdash.nav_wallet'),    path: '/client/wallet',   icon: Wallet },
    { name: t('cdash.nav_settings'),  path: '/client/settings', icon: Settings },
  ];

  const isHome = location.pathname === '/client';

  const { content } = useContent();
  const rawWa = content?.siteSettings?.whatsapp || content?.global?.siteSettings?.whatsapp || content?.global?.navbar?.whatsapp || '919494845111';
  const cleanWa = String(rawWa).replace(/[^0-9]/g, '') || '919494845111';

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="cdash-root">
      {/* ── Mobile Top Header Bar ───────────────────────────────── */}
      <header className="cdash-mobile-header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size={32} portalTag={t('cdash.couples_portal')} />
        </Link>
        <div className="cdash-mobile-actions">
          <Link to="/" className="cdash-mobile-btn cdash-mobile-home-btn" title={t('cdash.back_main')}>
            <Home size={16} />
          </Link>
          <a
            href={`https://wa.me/${cleanWa}?text=${encodeURIComponent('నమస్కారం WeddingAlbums.in టీమ్! నా కపుల్స్ వెడ్డింగ్ ఆల్బమ్ ఆర్డర్ల గురించి సహాయం కావాలి.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cdash-mobile-btn cdash-mobile-wa-btn"
            title={t('cdash.wa_support')}
          >
            <Phone size={15} />
          </a>
          <button 
            type="button"
            onClick={handleLogout} 
            aria-label={t('cdash.sign_out')}
            className="cdash-mobile-btn cdash-mobile-logout-btn" 
            title={t('cdash.sign_out')}
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '7px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <LogOut size={15} />
          </button>
          <Link to="/order" className="cdash-mobile-book-btn">
            {t('cdash.book_btn')}
          </Link>
        </div>
      </header>

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="cdash-sidebar">
        {/* Brand */}
        <Link to="/" className="cdash-sb-brand" style={{ textDecoration: 'none' }}>
          <Logo size={36} portalTag={t('cdash.couples_portal')} />
        </Link>

        {/* User */}
        <div className="cdash-sb-user">
          <div className="cdash-sb-avatar">{initials}</div>
          <div>
            <div className="cdash-sb-name">{user?.coupleNames || user?.name || t('cdash.couple')}</div>
            <div className="cdash-sb-role">{t('cdash.couple')}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="cdash-sb-nav">
          <div className="cdash-nav-label">{t('cdash.navigation')}</div>
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

          <div className="cdash-nav-label" style={{ marginTop: '16px' }}>{t('cdash.quick_links')}</div>
          <Link to="/" className="cdash-nav-item">
            <Home size={17} /> {t('cdash.back_main')}
          </Link>
          <a href="/services" className="cdash-nav-item">
            <Camera size={17} /> {t('cart.browse')}
          </a>
          <a href="/track" className="cdash-nav-item">
            <Truck size={17} /> {t('cdash.track_delivery')}
          </a>
        </nav>

        {/* Wallet balance */}
        <div className="cdash-sb-wallet">
          <div className="cdash-sb-wallet-label">{t('cdash.wallet_balance')}</div>
          <div className="cdash-sb-wallet-amount">₹{wallet.toLocaleString('en-IN')}</div>
        </div>

        {/* Logout */}
        <button className="cdash-sb-logout" onClick={handleLogout}>
          <LogOut size={16} /> {t('cdash.sign_out')}
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="cdash-main">
        {isHome ? (
          <>
            {user?.isGuest && (
              <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#d4af37' }}>
                  <strong>{t('cdash.guest_title')}</strong> {t('cdash.guest_desc')}
                </span>
                <Link to="/login" style={{ fontSize: '0.8rem', color: '#fff', background: '#d4af37', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>{t('cdash.sign_in')}</Link>
              </div>
            )}
            
            {/* Page Header */}
            <div className="cdash-page-header">
              <div className="overline">{t('cdash.overline')}</div>
              <h1>{t('cdash.welcome_back')} {user?.name?.split(' ')[0] || t('cdash.welcome_there')} 👋</h1>
              <p>{t('cdash.hero_sub')}</p>
            </div>

            {/* Stats */}
            <div className="cdash-stats">
              {[
                { color: 'gold',   icon: ShoppingBag, label: t('cdash.stat_total_orders'),   value: '2',          sub: t('cdash.stat_lifetime') },
                { color: 'blue',   icon: ImageIcon,   label: t('cdash.stat_pending_proofs'), value: '1',          sub: t('cdash.stat_awaiting') },
                { color: 'green',  icon: CheckCircle2,label: t('cdash.stat_delivered'),      value: '1',          sub: t('cdash.stat_shipped') },
                { color: 'purple', icon: Wallet,      label: t('cdash.wallet_balance'),       value: `₹${wallet.toLocaleString('en-IN')}`, sub: t('cdash.stat_credits') },
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
              <div className="cdash-section-title flex justify-between items-center">
                <span>{t('cdash.your_orders')} ({orders.length > 0 ? orders.length : 2})</span>
                <Link to="/order" className="text-xs text-[#D4AF37] font-semibold hover:underline">
                  {t('cdash.new_custom_order')}
                </Link>
              </div>
              {(orders.length > 0 ? orders : MOCK_ORDERS).map(order => <OrderCard key={order.id} order={order} />)}
            </div>

            {/* Quick Actions */}
            <div className="cdash-section">
              <div className="cdash-section-title">{t('cdash.quick_actions')}</div>
              <div className="cdash-actions">
                {[
                  { label: t('cdash.new_order'),        icon: ShoppingBag, to: '/order' },
                  { label: t('cdash.view_proofs'),      icon: ImageIcon,   to: '/client/proofs' },
                  { label: t('cdash.download_invoice'), icon: Download,    to: '/client/orders' },
                  { label: t('cdash.wa_support'),       icon: Phone,       href: `https://wa.me/${cleanWa}?text=${encodeURIComponent(`నమస్కారం! నేను Client Portal (${user?.name || 'Customer'}) నుండి మాట్లాడుతున్నాను. నా ఆర్డర్ గురించి సహాయం కావాలి.`)}` },
                  { label: t('cdash.wallet_credits'),   icon: CreditCard,  to: '/client/wallet' },
                  { label: t('cdash.refer_earn'),       icon: Heart,       to: '/client/referral' },
                ].map((a, i) => (
                  a.href
                    ? <a key={i} href={a.href} target="_blank" rel="noopener noreferrer" className="cdash-action-btn">
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

      {/* ── Mobile Persistent Bottom Navigation ─────────────────── */}
      <nav className="cdash-mobile-nav">
        {[
          { label: t('cdash.mnav_overview'), path: '/client', icon: LayoutDashboard },
          { label: t('cdash.mnav_orders'), path: '/client/orders', icon: ShoppingBag, badge: orders.length > 0 ? String(orders.length) : undefined },
          { label: t('cdash.mnav_proofs'), path: '/client/proofs', icon: ImageIcon, badge: '1' },
          { label: t('cdash.nav_wallet'), path: '/client/wallet', icon: Wallet },
          { label: t('cdash.nav_settings'), path: '/client/settings', icon: Settings },
        ].map(item => {
          const isActive = item.path === '/client'
            ? location.pathname === '/client'
            : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`cdash-mnav-item ${isActive ? 'active' : ''}`}
            >
              <div className="cdash-mnav-icon-wrap">
                <Icon size={19} />
                {item.badge && <span className="cdash-mnav-badge">{item.badge}</span>}
              </div>
              <span className="cdash-mnav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ClientDashboard;
