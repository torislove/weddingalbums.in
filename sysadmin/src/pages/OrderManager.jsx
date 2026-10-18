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
  const [selectedOrder, setSelectedOrder] = useState(null);

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
                  <td style={{ padding: '14px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 10px', background: 'rgba(56,189,248,0.1)',
                        border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                      }}
                      title="Inspect full order & media specs"
                    >
                      <Eye size={13} /> Specs
                    </button>

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

      {/* ── Order Specs Inspection Modal ─────────────────────────────── */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }} onClick={() => setSelectedOrder(null)}>
          <div style={{
            background: '#0d1117', border: '1px solid rgba(14,165,233,0.3)',
            borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh',
            overflowY: 'auto', padding: '24px', color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#22d3ee' }}>
                  Order Job Specifications #{selectedOrder.id || selectedOrder._id}
                </h3>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Placed by {selectedOrder.customer_name || selectedOrder.client_name || 'Wedding Couple'} ({selectedOrder.user_email || selectedOrder.email})
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Status & Pricing Strip */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'block' }}>Production State</span>
                <strong style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status || 'CONFIRMED'}</strong>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'block' }}>Order Value</span>
                <strong style={{ color: '#D4AF37', fontSize: '16px' }}>₹{Number(selectedOrder.total_amount || selectedOrder.amount || 0).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Dual Asset Handover Data */}
            <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📦 Asset Handover & Media Tracking
              </h4>
              {selectedOrder.assetMethod === 'courier' || selectedOrder.courierTracking ? (
                <div>
                  <div style={{ color: '#4ade80', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    📦 Physical Courier Pen Drive / HDD En Route
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                    Courier: <strong>{selectedOrder.courierCompany || 'DTDC Express'}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                    Consignment Tracking #: <strong style={{ color: '#fbbf24' }}>{selectedOrder.courierTracking || 'Pending Receipt'}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#34d399', marginTop: '6px' }}>
                    🛡️ 100% Safe Return Guarantee: Return original media inside finished album gift box.
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    ☁️ Cloud Storage Download Link
                  </div>
                  <div style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                    {selectedOrder.driveLink ? (
                      <a href={selectedOrder.driveLink} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>
                        {selectedOrder.driveLink}
                      </a>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>No external link provided</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            {selectedOrder.instructions && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Couple / Studio Instructions:</span>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                  "{selectedOrder.instructions}"
                </p>
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: '8px 18px', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
