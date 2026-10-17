import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ErrorBoundary from './components/ErrorBoundary';

// Code-split pages dynamically via React.lazy
const B2BDashboard = lazy(() => import('./pages/B2BDashboard'));
const B2BLanding = lazy(() => import('./pages/B2BLanding'));
const B2BLogin = lazy(() => import('./pages/B2BLogin'));
const SubmitJob = lazy(() => import('./pages/SubmitJob'));
const JobHistory = lazy(() => import('./pages/JobHistory'));
const Invoices = lazy(() => import('./pages/Invoices'));
const AlbumOrders = lazy(() => import('./pages/AlbumOrders'));
const SLA = lazy(() => import('./pages/SLA'));
const Wallet = lazy(() => import('./pages/Wallet'));
const B2BRegister = lazy(() => import('./pages/B2BRegister'));
const BusinessAnalytics = lazy(() => import('./pages/BusinessAnalytics'));

const LoadingFallback = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '12px'
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: '3px solid rgba(212,175,55,0.2)',
      borderTopColor: 'var(--gold-primary, var(--brand))',
      animation: 'spin 0.8s linear infinite'
    }} />
    <span style={{ fontSize: '12px', color: 'var(--text-muted, var(--n-500))', letterSpacing: '1px' }}>
      LOADING...
    </span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* Layout wrapping sidebar + topbar — only shown inside protected routes */
const MainLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <TopBar title={title} onToggleSidebar={() => setSidebarOpen(v => !v)} />
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};

/* Wraps MainLayout with auth protection */
const ProtectedPage = ({ children, title, roles = ['b2b', 'admin'] }) => (
  <ProtectedRoute roles={roles}>
    <MainLayout title={title}>{children}</MainLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <ErrorBoundary label="Studio Portal" accent="var(--brand)">
      <AuthProvider requiredRole="b2b">
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<B2BLanding />} />
              <Route path="/login" element={<B2BLogin />} />
              <Route path="/signup" element={<B2BRegister />} />

              {/* Protected routes */}
              <Route path="/dashboard"  element={<ProtectedPage title="Dashboard"><B2BDashboard /></ProtectedPage>} />
              <Route path="/submit"     element={<ProtectedPage title="Submit Job"><SubmitJob /></ProtectedPage>} />
              <Route path="/jobs"       element={<ProtectedPage title="Job History"><JobHistory /></ProtectedPage>} />
              <Route path="/invoices"   element={<ProtectedPage title="Invoices"><Invoices /></ProtectedPage>} />
              <Route path="/albums"     element={<ProtectedPage title="Album Orders"><AlbumOrders /></ProtectedPage>} />
              <Route path="/sla"        element={<ProtectedPage title="SLA Guarantees"><SLA /></ProtectedPage>} />
              <Route path="/wallet"     element={<ProtectedPage title="Wallet & Payouts"><Wallet /></ProtectedPage>} />
              <Route path="/analytics"  element={<ProtectedPage title="Analytics"><BusinessAnalytics /></ProtectedPage>} />

              {/* Fallback */}
              <Route path="*" element={<ProtectedPage title=""><div className="page-content"><h2>Page Not Found</h2></div></ProtectedPage>} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
