import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, CheckCircle2, Clock, ArrowRight, Eye, ExternalLink } from 'lucide-react';
import { API } from '../apiConfig';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast from '../components/ui/Toast';

const ORDER_STATES = ['DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'QC_REVIEW', 'DELIVERED', 'CLOSED'];

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [dialog, setDialog] = useState(null); // { orderId, nextStatus }
  const [toast, setToast] = useState(null);   // { msg, tone }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const runTransition = async () => {
    if (!dialog) return;
    const { orderId, nextStatus } = dialog;
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/orders/${orderId}/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newStatus: nextStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => (o.id || o._id) === orderId ? { ...o, status: nextStatus } : o));
        setToast({ msg: `Moved to ${nextStatus}`, tone: 'success' });
      } else {
        setToast({ msg: 'Failed to update status', tone: 'danger' });
      }
    } catch {
      setToast({ msg: 'Network error', tone: 'danger' });
    } finally {
      setUpdatingId(null);
      setDialog(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'CLOSED':
        return '#10b981';
      case 'IN_PRODUCTION':
      case 'QC_REVIEW':
        return '#0ea5e9';
      case 'CONFIRMED':
        return '#D4AF37';
      default:
        return '#f59e0b';
    }
  };

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1400px', margin: '0 auto', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Orders & Production Pipeline</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '13px' }}>Track wedding album manufacturing, print queues, and client delivery states.</p>
        </div>
        <button 
          onClick={fetchOrders}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', background: 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.25)', color: '#22d3ee',
            borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
            whiteSpace: 'nowrap'
          }}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh Pipeline
        </button>
      </div>

      <div style={{
        background: 'rgba(0,6,15,0.6)',
        border: '1px solid rgba(14,165,233,0.1)',
        borderRadius: '12px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
              <th style={{ padding: '14px 16px' }}>Order ID</th>
              <th style={{ padding: '14px 16px' }}>Client / Studio</th>
              <th style={{ padding: '14px 16px' }}>Album / Package</th>
              <th style={{ padding: '14px 16px' }}>Amount</th>
              <th style={{ padding: '14px 16px' }}>Current State</th>
              <th style={{ padding: '14px 16px' }}>Move Next State</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No active orders in database.</td></tr>
            ) : orders.map(order => {
              const currentStatus = order.status || 'CONFIRMED';
              const nextIdx = ORDER_STATES.indexOf(currentStatus) + 1;
              const nextStatus = nextIdx < ORDER_STATES.length ? ORDER_STATES[nextIdx] : null;

              return (
                <tr key={order.id || order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#22d3ee' }}>
                    #{(order.id || order._id || '').substring(0, 8)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{order.customer_name || order.client_name || 'Wedding Couple'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{order.user_email || order.email || 'customer@weddingalbums.in'}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)' }}>
                    {order.package_name || order.title || '12x18 Acrylic Royal Album'}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#D4AF37' }}>
                    ₹{Number(order.total_amount || order.amount || 25000).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                      background: `${getStatusColor(currentStatus)}20`,
                      color: getStatusColor(currentStatus),
                      border: `1px solid ${getStatusColor(currentStatus)}40`
                    }}>
                      {currentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {nextStatus ? (
                      <button
                        onClick={() => setDialog({ orderId: order.id || order._id, nextStatus })}
                        disabled={updatingId === (order.id || order._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '6px 12px', background: 'rgba(16,185,129,0.15)',
                          border: '1px solid rgba(16,185,129,0.3)', color: '#34d399',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                        }}
                      >
                        Advance to {nextStatus} <ArrowRight size={13} />
                      </button>
                    ) : (
                      <span style={{ color: '#10b981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!dialog}
        tone="success"
        title={`Advance to ${dialog?.nextStatus || ''}?`}
        message="This moves the order along the production pipeline and is visible to the client and studio."
        confirmLabel={`Advance to ${dialog?.nextStatus || ''}`}
        busy={updatingId === dialog?.orderId}
        onConfirm={runTransition}
        onCancel={() => setDialog(null)}
      />

      <Toast message={toast?.msg} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
};

export default OrderManager;
