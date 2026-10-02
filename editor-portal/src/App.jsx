import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import EditorDashboard from './pages/EditorDashboard';
import EditorLanding from './pages/EditorLanding';
import EditorLogin from './pages/EditorLogin';
import TaskQueue from './pages/TaskQueue';
import Earnings from './pages/Earnings';
import Rating from './pages/Rating';
import EditorRegister from './pages/EditorRegister';
import { Scissors, Video, BookOpen } from 'lucide-react';

const MainLayout = ({ children, title }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-wrapper">
      <TopBar title={title} />
      {children}
    </div>
  </div>
);

const ProtectedPage = ({ children, title, roles = ['editor', 'admin'] }) => (
  <ProtectedRoute roles={roles}>
    <MainLayout title={title}>{children}</MainLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider requiredRole="editor">
      <Router>
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
          <Route path="*" element={<ProtectedPage title=""><div className="page-content"><h2>Coming Soon</h2></div></ProtectedPage>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
