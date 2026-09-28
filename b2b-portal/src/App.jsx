import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="/" element={<B2BLanding />} />
        <Route path="/login" element={<B2BLogin />} />
        <Route path="/signup" element={<B2BRegister />} />
        
        <Route path="/dashboard" element={<MainLayout><B2BDashboard /></MainLayout>} />
        <Route path="/submit" element={<MainLayout><SubmitJob /></MainLayout>} />
        <Route path="/jobs" element={<MainLayout><JobHistory /></MainLayout>} />
        <Route path="/invoices" element={<MainLayout><Invoices /></MainLayout>} />
        <Route path="/wallet" element={<MainLayout><Wallet /></MainLayout>} />
        {/* Fallback */}
        <Route path="*" element={<MainLayout><div className="page-content"><h2>Coming Soon</h2></div></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
