import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, ShoppingBag, Clock } from 'lucide-react';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:4000'));

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API}/api/orders`, { headers });
      const data = await res.json();
      
      const list = Array.isArray(data) ? data : [];
      // Filter by email if user is logged in, else display recent session orders
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <Clock size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', margin: '0 0 6px 0' }}>Order History & Invoices</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>View your photobook orders, production status, and tax invoices.</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <ShoppingBag size={48} color="var(--gold-primary)" style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h3 style={{ margin: '0 0 8px 0' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0' }}>You haven't placed any photobook orders yet.</p>
          <a href="/order" className="btn btn-primary" style={{ padding: '10px 24px', textDecoration: 'none', display: 'inline-block' }}>
            Build Your Album
          </a>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => {
            const orderIdStr = String(order.orderId || order.id || order._id || 'ORD').substring(0, 12).toUpperCase();
            const totalVal = order.total || order.data?.total || 0;
            const statusVal = order.status || order.data?.status || 'Confirmed';
            const itemsList = order.items || order.data?.items || [];
            
            return (
              <div key={order.id || order._id} style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#fff' }}>Order #{orderIdStr}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Placed on: {new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      {statusVal}
                    </span>
                    <div style={{ marginTop: '6px', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--gold-primary)' }}>
                      ₹{Number(totalVal).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <h5 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Details:</h5>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {itemsList.length > 0 ? (
                      itemsList.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: '6px' }}>
                          <strong>{item.name || 'Photobook'}</strong> {item.quantity ? `(Qty: ${item.quantity})` : ''}
                        </li>
                      ))
                    ) : (
                      <li style={{ marginBottom: '6px' }}>
                        <strong>{order.size?.label || order.size || 'Couture Wedding Photobook'}</strong> {order.coverType?.label ? `— ${order.coverType.label} Cover` : ''}
                      </li>
                    )}
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                  <a 
                    href={`${API}/api/orders/${order._id || order.id}/invoice`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem', color: 'var(--gold-primary)', borderColor: 'var(--gold-primary)' }}
                  >
                    <Download size={14} /> Download Tax Invoice
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
