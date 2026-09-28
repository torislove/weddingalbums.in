import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, ClipboardList, Briefcase, Scissors, ShieldCheck, IndianRupee } from 'lucide-react';

import UserManager from './pages/UserManager';
import TaskBoard from './pages/TaskBoard';
import PricingEngine from './pages/PricingEngine';
import OrderManager from './pages/OrderManager';
import Editors from './pages/Editors';
import JobQC from './pages/JobQC';
import Payouts from './pages/Payouts';
import Logo from './components/Logo';

const Sidebar = () => {
  const location = useLocation();
  const menu = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers & Users', path: '/users', icon: Users },
    { name: 'Orders & Payments', path: '/orders', icon: CreditCard },
    { name: 'Production Tasks', path: '/tasks', icon: ClipboardList },
    { name: 'Pricing & Packages', path: '/pricing', icon: Briefcase },
    { name: 'Editor Network', path: '/editors', icon: Scissors },
    { name: 'Quality Control (QC)', path: '/qc', icon: ShieldCheck },
    { name: 'Editor Payouts', path: '/payouts', icon: IndianRupee },
  ];

  return (
    <div className="hidden md:flex w-[260px] bg-[#111] border-r border-white/10 h-screen fixed flex-col z-50">
      <div className="p-6 border-b border-white/10 flex items-center justify-center">
        <Logo size={35} showText={true} />
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {menu.map(item => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${active ? 'text-blue-400 bg-blue-500/10 border-r-4 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const Dashboard = () => (
  <div className="p-10">
    <h1 className="text-3xl font-bold text-white mb-6">Business Dashboard</h1>
    <p className="text-gray-400">Welcome to the core operations portal. Select an item from the sidebar to manage users, orders, and pricing.</p>
  </div>
);

import AdminLogin from './pages/AdminLogin';

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AdminLogin setToken={setToken} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen text-gray-200 bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 md:ml-[260px] w-full relative h-screen overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManager />} />
            <Route path="/orders" element={<OrderManager />} />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/pricing" element={<PricingEngine />} />
            <Route path="/editors" element={<Editors />} />
            <Route path="/qc" element={<JobQC />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="*" element={<div className="p-10 text-center text-gray-500 mt-20">Page not found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
