import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Image as ImageIcon, Save, ExternalLink, Sparkles, Bell } from 'lucide-react';
import PageEditor from './pages/PageEditor';
import GlobalEditor from './pages/GlobalEditor';
import PushNotificationEditor from './pages/PushNotificationEditor';
import CalendarEditor from './pages/CalendarEditor';
import MediaLibrary from './pages/MediaLibrary';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Toast from './components/Toast';
import Logo from './components/Logo';
import { useAdminContent } from './hooks/useAdminContent';

const Sidebar = ({ isDirty, saveContent, saving }) => {
  const location = useLocation();
  const menu = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Home Page', path: '/pages/home', icon: FileText },
    { name: 'About Page', path: '/pages/about', icon: FileText },
    { name: 'Services Page', path: '/pages/services', icon: FileText },
    { name: 'Portfolio Page', path: '/pages/portfolio', icon: FileText },
    { name: 'Testimonials', path: '/pages/testimonials', icon: FileText },
    { name: 'Contact Page', path: '/pages/contact', icon: FileText },
    { name: 'Booking Calendar', path: '/calendar', icon: LayoutDashboard },
    { name: 'Push Notifications', path: '/push', icon: Bell },
    { name: 'Global Elements', path: '/global', icon: Settings },
    { name: 'Image Library', path: '/images', icon: ImageIcon },
  ];

  return (
    <div className="hidden md:flex w-[260px] bg-[#050505] border-r border-white/10 h-screen fixed flex-col z-50 shadow-2xl transition-all">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md">
        <Logo size={35} showText={true} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 ml-2 mt-2">Pages</div>
        {menu.map((item, i) => {
          const isActive = location.pathname === item.path;
          
          if (item.name === 'Global Elements') {
            return (
              <React.Fragment key={item.path}>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 ml-2 mt-6 pt-4 border-t border-white/5">Settings</div>
                <Link to={item.path} className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'active bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  <item.icon size={18} className={isActive ? 'text-[#D4AF37]' : ''} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </React.Fragment>
            );
          }

          return (
            <Link key={item.path} to={item.path} 
              className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'active bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <item.icon size={18} className={isActive ? 'text-[#D4AF37]' : ''} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Action Footer */}
      <div className="p-5 border-t border-white/10 bg-black/40 backdrop-blur-md space-y-3">
        <button 
          onClick={saveContent}
          disabled={!isDirty || saving}
          className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${isDirty ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'}`}
        >
          <Save size={18} /> {saving ? 'Publishing...' : (isDirty ? 'Publish Changes' : 'Everything Published')}
        </button>
        <a href="http://localhost:5173" target="_blank" rel="noreferrer" 
           className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-transparent text-gray-400 rounded-xl hover:bg-white/5 hover:text-white border border-white/10 transition-all duration-300">
          <ExternalLink size={16} /> Open Live Site
        </a>
        <button 
          onClick={() => {
            localStorage.removeItem('adminToken');
            window.location.reload();
          }}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-transparent text-red-400/80 rounded-xl hover:bg-red-500/10 hover:text-red-400 border border-white/5 transition-all duration-300 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// Dashboard component moved to pages/Dashboard.jsx

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('adminToken'));
  const adminState = useAdminContent(token); // Update hook to use token if needed, or just let App handle it
  const { content, saveContent } = adminState;
  const [toastMessage, setToastMessage] = React.useState(null);

  if (!token) {
    return <AdminLogin setToken={setToken} />;
  }

  const handleSave = async () => {
    await saveContent();
    setToastMessage('Changes successfully published to the live site!');
  };

  if (!content) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#050505]">
      <div className="w-12 h-12 border-4 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-4"></div>
      <div className="text-gray-400 font-medium tracking-wide animate-pulse">Initializing Premium Environment...</div>
    </div>
  );

  return (
    <BrowserRouter>
      <div className="flex min-h-screen text-gray-200 overflow-hidden bg-[#050505]">
        <Sidebar isDirty={adminState.isDirty} saveContent={handleSave} saving={adminState.saving} setToken={setToken} />
        <main className="flex-1 md:ml-[260px] w-full relative h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pages/:pageId" element={<PageEditor adminState={adminState} />} />
            <Route path="/calendar" element={<CalendarEditor adminState={adminState} />} />
            <Route path="/push" element={<PushNotificationEditor adminState={adminState} />} />
            <Route path="/global" element={<GlobalEditor adminState={adminState} />} />
            <Route path="/images" element={<MediaLibrary />} />
            <Route path="*" element={<div className="p-10 text-center text-gray-500 mt-20">This section is currently under construction.</div>} />
          </Routes>
        </main>
        
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    </BrowserRouter>
  );
}

export default App;
