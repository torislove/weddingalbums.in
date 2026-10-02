import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps any route element with auth + optional role check.
 * Redirects unauthenticated users to /login preserving their intended path.
 *
 * @param {React.ReactNode} children  - The protected route content
 * @param {string[]}        roles     - Allowed role(s). Skipped if empty.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary, #08070d)',
        gap: '14px',
        flexDirection: 'column',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid rgba(212,175,55,0.15)',
          borderTopColor: '#d4af37',
          animation: 'prSpin 0.8s linear infinite',
        }} />
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
          Verifying credentials…
        </span>
        <style>{`@keyframes prSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/login" state={{ unauthorized: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;
