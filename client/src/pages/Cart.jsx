import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import './Cart.css';
import { useT } from '../context/LanguageContext';

const Cart = () => {
  const t = useT();
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty">
        <h2>{t('cart.empty_title')}</h2>
        <p>{t('cart.empty_desc')}</p>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>{t('cart.browse')}</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items-section">
          <h2>{t('cart.title')} ({cartItems.length} {t('cart.items')})</h2>
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-page-item">
                <div className="item-image-wrapper">
                  {item.image ? <img src={item.image} alt={item.name} /> : <div className="placeholder-image">{t('cart.no_image')}</div>}
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
          <h3>{t('cart.summary')}</h3>
          <div className="summary-row">
            <span>{t('cart.subtotal')}</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>{t('cart.taxes')}</span>
            <span>₹{(cartTotal * 0.18).toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>{t('cart.total')}</span>
            <span className="liquid-gold-text">₹{(cartTotal * 1.18).toLocaleString()}</span>
          </div>
          <button className="btn btn-gold-3d w-100" onClick={() => navigate('/checkout')}>{t('cart.checkout')}</button>
          <div className="secure-checkout">
            <span className="secure-badge">{t('cart.secure')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
