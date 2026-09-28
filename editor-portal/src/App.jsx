import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import EditorDashboard from './pages/EditorDashboard';
import EditorLogin from './pages/EditorLogin';
import TaskQueue from './pages/TaskQueue';
import Earnings from './pages/Earnings';
import Rating from './pages/Rating';
import { Scissors, Video, BookOpen } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-wrapper">
          <TopBar />
          <Routes>
            <Route path="/login" element={<EditorLogin />} />
            <Route path="/" element={<EditorDashboard />} />
            <Route path="/photo" element={<TaskQueue title="Photo" description="Culling, retouching, and color grading jobs." icon={Scissors} color="#3b82f6" type="Photo" />} />
            <Route path="/video" element={<TaskQueue title="Video" description="Teasers, highlight reels, and full wedding films." icon={Video} color="#ec4899" type="Video" />} />
            <Route path="/album" element={<TaskQueue title="Album" description="Layout designs for 12x18 and standard albums." icon={BookOpen} color="#eab308" type="Album" />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/rating" element={<Rating />} />
            <Route path="*" element={<div className="page-content"><h2>Coming Soon</h2></div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
