import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, ShoppingBag, Clock, Truck, MessageCircle, Eye, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API } from '../apiConfig';
import { useT } from '../context/LanguageContext';

const OrderHistory = () => {
  const t = useT();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('clientToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API}/api/orders`, { headers });
      const data = await res.json();
      
      const list = Array.isArray(data) ? data : [];
      // Filter by email if user is logged in
      const userOrders = list.filter(order => {
        if (!user?.email) return true;
        const ordEmail = order.email || order.userEmail || order.data?.userEmail;
        return ordEmail ? ordEmail.toLowerCase() === user.email.toLowerCase() : true;
      });
      setOrders(userOrders);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsAppTrack = (order) => {
    const orderId = order.orderId || order.id || order._id || 'ORD-VERIFIED';
    const msg = `నమస్కారం WeddingAlbums.in టీమ్! నా ఆర్డర్ Reference: ${orderId} గురించి స్టేటస్ మరియు ప్రూఫ్ అప్‌డేట్స్ తెలుసుకోవాలనుకుంటున్నాను.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <Clock size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
        <p>{t('oh.loading')}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page" style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(12px, 3vw, 24px)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', margin: '0 0 6px 0', color: 'var(--paper)', fontFamily: 'serif' }}>
          {t('oh.title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>
          {t('oh.sub')}
        </p>
      </div>
      
      {orders.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <ShoppingBag size={48} color="var(--gold-primary)" style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--paper)' }}>{t('oh.empty_title')}</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0', fontSize: '0.9rem' }}>{t('oh.empty_desc')}</p>
          <Link to="/order" className="btn btn-primary" style={{ padding: '10px 24px', textDecoration: 'none', display: 'inline-block' }}>
            {t('oh.book')}
          </Link>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => {
            const orderIdStr = String(order.orderId || order.id || order._id || 'ORD').substring(0, 14).toUpperCase();
            const totalVal = order.total || order.data?.total || 0;
            const statusVal = order.status || order.data?.status || 'Confirmed';
            const itemsList = order.items && Array.isArray(order.items) && order.items.length > 0
              ? order.items
              : order.data?.items && Array.isArray(order.data?.items) && order.data?.items.length > 0
              ? order.data.items
              : [];
            
            const pkgType = order.data?.packageType || (order.data?.appliedBundle ? 'bundles' : 'custom');
            const city = order.data?.event?.city || order.data?.city;
            const speed = order.data?.event?.speed || order.data?.deliverySpeed;
            const cloudLink = order.cloudLink || order.data?.cloudLink;
            
            return (
              <div
                key={order.id || order._id}
                style={{
                  background: 'rgba(18, 16, 12, 0.75)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '18px',
                  padding: 'clamp(14px, 3vw, 24px)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--paper)', fontWeight: 'bold' }}>
                        {t('oh.order_hash')}{orderIdStr}
                      </h4>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: pkgType === 'bundles' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: pkgType === 'bundles' ? 'var(--brand)' : '#93c5fd',
                        border: `1px solid ${pkgType === 'bundles' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                        textTransform: 'uppercase'
                      }}>
                        {pkgType === 'bundles' ? t('oh.bundle') : t('oh.custom')}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {t('oh.placed_on')} {new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-block', padding: '3px 10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--ok)', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      {statusVal}
                    </span>
                    <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--gold-primary)', fontFamily: 'monospace' }}>
                      ₹{Number(totalVal).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Metadata Strip */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '16px',
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.75)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={14} color="#D4AF37" />
                    {speed === 'express' ? t('oh.express') : t('oh.standard')}
                  </span>
                  {city && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} color="#10b981" />
                      {t('oh.destination')} {city}
                    </span>
                  )}
                  {cloudLink && (
                    <a
                      href={cloudLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--brand)', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                    >
                      <Download size={14} /> {t('oh.open_drive')}
                    </a>
                  )}
                </div>
                
                {/* Booked Services Itemized Grid */}
                <div style={{ marginBottom: '20px' }}>
                  <h5 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {t('oh.booked')}
                  </h5>

                  {itemsList.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: '10px' }}>
                      {itemsList.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '12px',
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                            <strong style={{ color: 'var(--paper)', fontSize: '0.88rem' }}>{item.name || t('oh.service_item')}</strong>
                            {item.price && (
                              <span style={{ color: 'var(--brand)', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.82rem' }}>
                                ₹{Number(item.price).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          {item.details && (
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.35 }}>
                              {item.details}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)', color: 'var(--n-300)', fontSize: '0.88rem' }}>
                      <strong>{order.size?.label || order.size || t('oh.default_album')}</strong> {order.coverType?.label ? `— ${order.coverType.label} ${t('oh.cover')}` : ''}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => openWhatsAppTrack(order)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '10px',
                      background: 'rgba(37, 211, 102, 0.15)',
                      border: '1px solid rgba(37, 211, 102, 0.35)',
                      color: '#25D366',
                      cursor: 'pointer',
                      flex: '1 1 140px'
                    }}
                  >
                    <MessageCircle size={15} /> {t('oh.track_wa')}
                  </button>
                  <Link
                    to="/client/proofs"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '10px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      color: 'var(--brand)',
                      textDecoration: 'none',
                      flex: '1 1 140px'
                    }}
                  >
                    <Eye size={15} /> {t('oh.view_proofs')}
                  </Link>
                  <a 
                    href={`${API}/api/orders/${order._id || order.id}/invoice`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      flex: '1 1 140px'
                    }}
                  >
                    <Download size={14} /> {t('oh.download_invoice')}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
