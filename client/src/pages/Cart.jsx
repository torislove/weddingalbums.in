import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/services')}>Browse Services</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items-section">
          <h2>Shopping Cart ({cartItems.length} items)</h2>
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-page-item">
                <div className="item-image-wrapper">
                  {item.image ? <img src={item.image} alt={item.name} /> : <div className="placeholder-image">No Image</div>}
                </div>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-price">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary-section">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Taxes (Estimated 18% GST)</span>
            <span>₹{(cartTotal * 0.18).toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span className="liquid-gold-text">₹{(cartTotal * 1.18).toLocaleString()}</span>
          </div>
          <button className="btn btn-gold-3d w-100" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          <div className="secure-checkout">
            <span className="secure-badge">🔒 Secure Razorpay Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
