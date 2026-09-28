import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const MainLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-wrapper">
      <TopBar />
      {children}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EditorLanding />} />
        <Route path="/login" element={<EditorLogin />} />
        <Route path="/signup" element={<EditorRegister />} />
        
        <Route path="/dashboard" element={<MainLayout><EditorDashboard /></MainLayout>} />
        <Route path="/photo" element={<MainLayout><TaskQueue title="Photo" description="Culling, retouching, and color grading jobs." icon={Scissors} color="#3b82f6" type="Photo" /></MainLayout>} />
        <Route path="/video" element={<MainLayout><TaskQueue title="Video" description="Teasers, highlight reels, and full wedding films." icon={Video} color="#ec4899" type="Video" /></MainLayout>} />
        <Route path="/album" element={<MainLayout><TaskQueue title="Album" description="Layout designs for 12x18 and standard albums." icon={BookOpen} color="#eab308" type="Album" /></MainLayout>} />
        <Route path="/earnings" element={<MainLayout><Earnings /></MainLayout>} />
        <Route path="/rating" element={<MainLayout><Rating /></MainLayout>} />
        <Route path="*" element={<MainLayout><div className="page-content"><h2>Coming Soon</h2></div></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
