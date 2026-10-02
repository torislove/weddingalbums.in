import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import B2BDashboard from './pages/B2BDashboard';
import B2BLanding from './pages/B2BLanding';
import B2BLogin from './pages/B2BLogin';
import SubmitJob from './pages/SubmitJob';
import JobHistory from './pages/JobHistory';
import Invoices from './pages/Invoices';
import Wallet from './pages/Wallet';
import B2BRegister from './pages/B2BRegister';
import BusinessAnalytics from './pages/BusinessAnalytics';

/* Layout wrapping sidebar + topbar — only shown inside protected routes */
const MainLayout = ({ children, title }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-wrapper">
      <TopBar title={title} />
      {children}
    </div>
  </div>
);

/* Wraps MainLayout with auth protection */
const ProtectedPage = ({ children, title, roles = ['b2b', 'admin'] }) => (
  <ProtectedRoute roles={roles}>
    <MainLayout title={title}>{children}</MainLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider requiredRole="b2b">
      <Router>
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
          <Route path="/wallet"     element={<ProtectedPage title="Wallet & Payouts"><Wallet /></ProtectedPage>} />
          <Route path="/analytics"  element={<ProtectedPage title="Analytics"><BusinessAnalytics /></ProtectedPage>} />

          {/* Fallback */}
          <Route path="*" element={<ProtectedPage title=""><div className="page-content"><h2>Coming Soon</h2></div></ProtectedPage>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
