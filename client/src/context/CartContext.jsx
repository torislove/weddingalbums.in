import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/cart`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        setCartTotal(data.totalAmount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  const syncCart = async (items) => {
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setCartItems(items);
    setCartTotal(total);

    if (user) {
      try {
        await fetch(`${API}/api/cart`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ items, totalAmount: total, estimatedDeliveryEta: new Date().toISOString() })
        });
      } catch (err) {
        console.error('Failed to sync cart to server', err);
      }
    }
  };

  const addToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    let newItems;
    if (existing) {
      newItems = cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...cartItems, { ...product, quantity: 1 }];
    }
    syncCart(newItems);
    setIsCartOpen(true); // Open drawer on add
  };

  const removeFromCart = (id) => {
    const newItems = cartItems.filter(item => item.id !== id);
    syncCart(newItems);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    const newItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    syncCart(newItems);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider value={{
      cartItems, cartTotal, loading, isCartOpen,
      addToCart, removeFromCart, updateQuantity, toggleCart, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
