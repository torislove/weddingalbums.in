import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, CheckCircle, Clock3, Package2 } from 'lucide-react';
import { API } from '../apiConfig';

const STATUS_BADGE = (status) => {
  const s = String(status || '').toLowerCase();
  if (['delivered', 'closed', 'approved', 'completed'].includes(s))
    return { cls: 'badge badge-completed', icon: CheckCircle, label: 'Delivered' };
  if (['qc_review', 'in_production', 'designing', 'assigned'].includes(s))
    return { cls: 'badge badge-active', icon: Clock3, label: 'In Production' };
  return { cls: 'badge badge-pending', icon: Clock3, label: s ? status : 'Pending' };
};

const AlbumOrders = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlbums = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('b2bToken');
      const res = await fetch(`${API}/api/b2b/albums`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setAlbums(Array.isArray(data) ? data : []);
      } else {
        setError('Could not load album orders right now.');
      }
    } catch (err) {
      console.error('Failed to fetch album orders', err);
      setError('Network error — showing cached state when available.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlbums(); }, []);

  return (
    <div className="page-content fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Album Orders</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Track every printed album order you placed with the network — spreads, cover finishes and delivery status.</p>
        </div>
        <button onClick={fetchAlbums} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', cursor: 'pointer' }} title="Refresh List">
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading album orders…</div>
        ) : albums.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <Package2 size={40} color="var(--gold-primary, var(--brand))" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No album orders yet</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 1rem', fontSize: '0.9rem' }}>
              When you submit an album job, its print order and production status will appear here.
            </p>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={14} /> Tip: album uploads usually move to production the same day.
            </span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <table className="data-table" style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Order</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Event</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Amount</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Placed</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {albums.map((order, idx) => {
                  const badge = STATUS_BADGE(order.status);
                  const d = order.data || {};
                  const eventName = order.title || d.eventName || d.client_name || d.clientName || `Album #${order.id?.slice?.(0, 6) || idx}`;
                  return (
                    <tr key={order.id || idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <BookOpen size={16} color="var(--text-muted)" />
                          <strong>{String(order.id || idx).substring(0, 10).toUpperCase()}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>{eventName}</td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--paper)' }}>
                        ₹{Number(order.amount || order.total || d.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={badge.cls} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <badge.icon size={12} /> {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {error && albums.length > 0 && (
          <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{error} Showing last known list.</p>
        )}
      </div>
    </div>
  );
};

export default AlbumOrders;
