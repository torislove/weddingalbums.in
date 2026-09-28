import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import './Cart.css'; // Reuse cart layout

const Checkout = () => {
  const { cartItems, cartTotal, removeFromCart, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  const finalTotal = cartTotal * 1.18; // 18% GST

  const handlePayment = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      
      // Create Razorpay Order
      const res = await fetch(`${API}/api/pay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: finalTotal })
      });
      
      const orderData = await res.json();
      
      if (!res.ok) {
        throw new Error('Failed to create payment order');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'WeddingAlbums.in',
        description: 'Complete Your Order',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify Payment
            const verifyRes = await fetch(`${API}/api/pay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Create Actual Order in DB
              const orderRes = await fetch(`${API}/api/orders`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  data: {
                    items: cartItems,
                    total: finalTotal,
                    paymentId: response.razorpay_payment_id,
                    status: 'Paid',
                    userEmail: user?.email,
                    phone: user?.phone
                  }
                })
              });
              
              if (orderRes.ok) {
                // Clear cart locally (in real app, call clearCart context method)
                cartItems.forEach(item => removeFromCart(item.id));
                setToastMessage('Payment successful! Order placed.');
                setTimeout(() => navigate('/client'), 2000);
              }
            } else {
              setToastMessage('Payment verification failed.');
            }
          } catch (err) {
            console.error('Payment Error:', err);
            setToastMessage('Something went wrong. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#D4AF37'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setToastMessage('Payment Failed: ' + response.error.description);
      });
      rzp.open();
      
    } catch (err) {
      setToastMessage('Checkout failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-container" style={{ gridTemplateColumns: '1fr', maxWidth: '600px' }}>
        <div className="cart-summary-section" style={{ position: 'static' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Checkout</h2>
          
          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Billing Information</h4>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Name:</strong> {user?.name}</p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Email:</strong> {user?.email}</p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
          </div>

          <div className="summary-row">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>GST (18%)</span>
            <span>₹{(cartTotal * 0.18).toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Total Payable</span>
            <span className="liquid-gold-text">₹{finalTotal.toLocaleString()}</span>
          </div>
          <button 
            className="btn btn-gold-3d w-100" 
            onClick={handlePayment}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? 'Processing...' : 'Pay Now with Razorpay'}
          </button>
        </div>
      </div>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default Checkout;
