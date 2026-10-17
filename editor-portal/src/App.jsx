import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { Scissors, Video, BookOpen } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

const EditorDashboard = lazy(() => import('./pages/EditorDashboard'));
const EditorLanding = lazy(() => import('./pages/EditorLanding'));
const EditorLogin = lazy(() => import('./pages/EditorLogin'));
const TaskQueue = lazy(() => import('./pages/TaskQueue'));
const Earnings = lazy(() => import('./pages/Earnings'));
const Rating = lazy(() => import('./pages/Rating'));
const EditorRegister = lazy(() => import('./pages/EditorRegister'));

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
      border: '3px solid rgba(99, 102, 241, 0.2)',
      borderTopColor: 'var(--accent-primary, var(--brand))',
      animation: 'spin 0.8s linear infinite'
    }} />
    <span style={{ fontSize: '12px', color: 'var(--text-muted, var(--n-500))', letterSpacing: '1px' }}>
      LOADING WORKSPACE...
    </span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const MainLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <TopBar title={title} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};

const ProtectedPage = ({ children, title, roles = ['editor', 'admin'] }) => (
  <ProtectedRoute roles={roles}>
    <MainLayout title={title}>{children}</MainLayout>
  </ProtectedRoute>
);

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ErrorBoundary label="Creator Suite" accent="var(--brand)">
      <AuthProvider requiredRole="editor">
        <ToastProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<EditorLanding />} />
                <Route path="/login" element={<EditorLogin />} />
                <Route path="/signup" element={<EditorRegister />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedPage title="Dashboard"><EditorDashboard /></ProtectedPage>} />
                <Route path="/photo"     element={<ProtectedPage title="Photo Jobs"><TaskQueue title="Photo" description="Culling, retouching, and color grading jobs." icon={Scissors} color="#3b82f6" type="Photo" /></ProtectedPage>} />
                <Route path="/video"     element={<ProtectedPage title="Video Jobs"><TaskQueue title="Video" description="Teasers, highlight reels, and full wedding films." icon={Video} color="#ec4899" type="Video" /></ProtectedPage>} />
                <Route path="/album"     element={<ProtectedPage title="Album Jobs"><TaskQueue title="Album" description="Layout designs for 12x18 and standard albums." icon={BookOpen} color="#eab308" type="Album" /></ProtectedPage>} />
                <Route path="/earnings"  element={<ProtectedPage title="Earnings"><Earnings /></ProtectedPage>} />
                <Route path="/rating"    element={<ProtectedPage title="My Ratings"><Rating /></ProtectedPage>} />

                {/* Fallback */}
                <Route path="*" element={<ProtectedPage title=""><div className="page-content"><h2>Page Not Found</h2></div></ProtectedPage>} />
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
