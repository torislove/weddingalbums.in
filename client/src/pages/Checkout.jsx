import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { API } from '../apiConfig';
import './Cart.css'; // Reuse cart layout
import { useT } from '../context/LanguageContext';

const Checkout = () => {
  const t = useT();
  const { cartItems, cartTotal, removeFromCart, clearCart, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  const finalTotal = cartTotal * 1.18; // 18% GST

  const handlePayment = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    
    try {
      
      // Create Razorpay Order
      const res = await fetch(`${API}/api/pay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('clientToken') || ''}`
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
        description: t('checkout.rzp_desc'),
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify Payment
            const verifyRes = await fetch(`${API}/api/pay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('clientToken') || ''}`
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
                  'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('clientToken') || ''}`
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
                if (clearCart) clearCart();
                setToastMessage(t('checkout.ok'));
                setTimeout(() => navigate('/client'), 2000);
              }
            } else {
              setToastMessage(t('checkout.verify_fail'));
            }
          } catch (err) {
            console.error('Payment Error:', err);
            setToastMessage(t('checkout.generic_err'));
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: 'var(--brand)'
        }
      };

      if (typeof window.Razorpay === 'function') {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setToastMessage(t('checkout.pay_fail') + ': ' + (response.error?.description || t('checkout.declined')));
        });
        rzp.open();
      } else {
        // Fallback for environments where Razorpay SDK script is blocked or offline
        await options.handler({
          razorpay_order_id: orderData.id,
          razorpay_payment_id: 'pay_demo_' + Date.now(),
          razorpay_signature: 'sig_demo_' + Date.now()
        });
      }
      
    } catch (err) {
      setToastMessage(t('checkout.fail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-container" style={{ gridTemplateColumns: '1fr', maxWidth: '600px' }}>
        <div className="cart-summary-section" style={{ position: 'static' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>{t('checkout.title')}</h2>
          
          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>{t('checkout.billing')}</h4>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>{t('checkout.name')}:</strong> {user?.name}</p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>{t('checkout.email')}:</strong> {user?.email}</p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>{t('checkout.phone')}:</strong> {user?.phone || t('checkout.not_provided')}</p>
          </div>

          <div className="summary-row">
            <span>{t('checkout.subtotal')} ({cartItems.length} {t('cart.items')})</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>{t('checkout.gst')}</span>
            <span>₹{(cartTotal * 0.18).toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>{t('checkout.total_payable')}</span>
            <span className="liquid-gold-text">₹{finalTotal.toLocaleString()}</span>
          </div>
          <button 
            className="btn btn-gold-3d w-100" 
            onClick={handlePayment}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? t('checkout.processing') : t('checkout.pay')}
          </button>
        </div>
      </div>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default Checkout;
