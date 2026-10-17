import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { API } from '../apiConfig';

/* ── Auth Context ──────────────────────────────────────────────────── */
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('sysadminUser') || localStorage.getItem('adminUser');
    if (saved && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin' || parsed.role === 'sysadmin') {
          setToken(saved);
          setUser(parsed);
        } else {
          localStorage.removeItem('sysadminToken');
          localStorage.removeItem('sysadminUser');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch { /* bad JSON */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback((tok, userData) => {
    localStorage.setItem('sysadminToken', tok);
    localStorage.setItem('sysadminUser', JSON.stringify(userData));
    setToken(tok);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }
    localStorage.removeItem('sysadminToken');
    localStorage.removeItem('sysadminUser');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('sysadminToken', data.token);
        setToken(data.token);
        return data.token;
      }
      logout();
      return null;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, logout, refreshToken, api: API }}>
      {children}
    </AuthCtx.Provider>
  );
};

export default AuthCtx;
