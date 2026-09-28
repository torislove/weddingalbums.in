import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download } from 'lucide-react';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      // In real implementation, this would fetch specific user orders: /api/client/orders
      // For now we'll simulate fetching from generic orders API and filtering
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/orders`);
      const data = await res.json();
      
      // Filter orders where userEmail matches (assuming mock data structure)
      const userOrders = data.filter(order => order?.data?.userEmail === user?.email);
      setOrders(userOrders);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10">Loading orders...</div>;

  return (
    <div className="dashboard-page">
      <h2>Order History</h2>
      
      {orders.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-card)', borderRadius: '12px' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id || order._id} style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>Order #{String(order.id || order._id).substring(0, 8).toUpperCase()}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Placed on: {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {order.data?.status || 'Processing'}
                  </span>
                  <div style={{ marginTop: '5px', fontWeight: 'bold' }}>
                    ₹{(order.data?.total || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div>
                <h5 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)' }}>Items:</h5>
                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  {order.data?.items?.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>
                      {item.name} x {item.quantity} 
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                <a 
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/orders/${order._id || order.id}/invoice`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  <Download size={14} /> Download Invoice
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
