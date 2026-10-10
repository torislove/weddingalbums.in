import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithGoogle as fbSignInWithGoogle } from '../firebase.js';

const API = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.origin.includes('web.app') ? '' : 'http://localhost:4000');

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate on mount or refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Allow b2c customers and admins
        if (parsedUser.role === 'b2c' || parsedUser.role === 'admin' || parsedUser.role === 'sysadmin') {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const saveAuthSession = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, portalRole: 'b2c' })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    if (data.user.role !== 'b2c' && data.user.role !== 'admin' && data.user.role !== 'sysadmin') {
      throw new Error('Access denied to customer portal');
    }

    saveAuthSession(data.token, data.user);
    return data.user;
  };

  const register = async (userData) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...userData, role: 'b2c' })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    saveAuthSession(data.token, data.user);
    return data.user;
  };

  // Send OTP (Email or Phone)
  const sendOtp = async (target, type = 'email', purpose = 'login') => {
    const res = await fetch(`${API}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, type, purpose })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    return data;
  };

  // Verify OTP
  const verifyOtp = async (target, code, purpose = 'login') => {
    const res = await fetch(`${API}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, code, purpose })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Verification failed');
    return data;
  };

  // Login with Email or Phone OTP
  const loginWithOtp = async (target, code) => {
    const res = await fetch(`${API}/api/auth/login-with-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ target, code, portalRole: 'b2c' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'OTP Login failed');

    saveAuthSession(data.token, data.user);
    return data.user;
  };

  // Login with Firebase ID token (Google or Phone)
  const loginWithFirebase = async (idToken) => {
    const res = await fetch(`${API}/api/auth/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ idToken, portalRole: 'b2c' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Firebase login failed');

    saveAuthSession(data.token, data.user);
    return data.user;
  };

  // One-click Google Login via Firebase
  const loginWithGoogle = async () => {
    const { idToken } = await fbSignInWithGoogle();
    return await loginWithFirebase(idToken);
  };

  // Forgot password - Send OTP to email
  const forgotPassword = async (email) => {
    const res = await fetch(`${API}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send reset code');
    return data;
  };

  // Reset password with OTP
  const resetPassword = async (email, otp, newPassword) => {
    const res = await fetch(`${API}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset password');
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const loginAsGuest = () => {
    const guestUser = {
      _id: 'guest',
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'b2c',
      coupleNames: 'Guest & Guest',
      wallet_balance: 0,
      isGuest: true
    };
    localStorage.setItem('token', 'guest-token');
    localStorage.setItem('user', JSON.stringify(guestUser));
    setUser(guestUser);
    return guestUser;
  };

  const refreshToken = async () => {
    try {
      const res = await fetch(`${API}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        return data.token;
      } else {
        logout();
        return null;
      }
    } catch (err) {
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      sendOtp, 
      verifyOtp, 
      loginWithOtp, 
      loginWithFirebase, 
      loginWithGoogle, 
      forgotPassword, 
      resetPassword, 
      logout, 
      loginAsGuest, 
      refreshToken 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
