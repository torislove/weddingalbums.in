import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Client-portal ProtectedRoute — supports both outlet-style (nested) usage
 * and children-style usage.
 * Props:
 *   allowedRoles  - legacy prop (kept for backward compat with existing App.jsx)
 *   roles         - new prop (same semantics)
 *   children      - optional; if omitted, renders <Outlet /> for nested routes
 */
const ProtectedRoute = ({ allowedRoles = [], roles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '14px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '3px solid rgba(212,175,55,0.15)',
          borderTopColor: '#d4af37',
          animation: 'prSpin 0.8s linear infinite',
        }} />
        <span style={{ color: '#888', fontSize: '0.85rem' }}>Loading…</span>
        <style>{`@keyframes prSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const combined = [...new Set([...allowedRoles, ...roles])];
  if (combined.length > 0 && !combined.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
