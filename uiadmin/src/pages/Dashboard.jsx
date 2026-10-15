import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ImageIcon, ShoppingCart, Users, Briefcase, Activity, Calendar, Bell, Globe } from 'lucide-react';

const API = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:4000'));

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('uiadminToken') || localStorage.getItem('adminToken');
        const res = await fetch(`${API}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10 animate-slide-up h-full flex flex-col max-w-5xl mx-auto overflow-y-auto">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-2">Welcome to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37]">Premium Admin</span></h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg">Manage your business operations, edit site content, and customize pages.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 py-8">
          <div className="w-5 h-5 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin"></div>
          Loading statistics...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="glass-panel p-5 sm:p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-[60px] opacity-10 group-hover:opacity-20 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Total Orders</h3>
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><ShoppingCart size={18} /></div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white">{stats?.orders || 0}</p>
          </div>

          <div className="glass-panel p-5 sm:p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full mix-blend-screen filter blur-[60px] opacity-10 group-hover:opacity-20 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Pending Tasks</h3>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Activity size={18} /></div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white">{stats?.pendingTasks || 0} <span className="text-xs sm:text-sm font-normal text-gray-500">/ {stats?.tasks || 0} total</span></p>
          </div>

          <div className="glass-panel p-5 sm:p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all sm:col-span-2 md:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-[60px] opacity-10 group-hover:opacity-20 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">B2B Studios</h3>
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Briefcase size={18} /></div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white">{stats?.b2bUsers || 0} <span className="text-xs sm:text-sm font-normal text-gray-500">/ {stats?.users || 0} users</span></p>
          </div>
        </div>
      )}

      <div className="glass-panel p-5 sm:p-8 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden mt-auto">
        <h3 className="text-lg sm:text-xl font-serif text-white mb-4 sm:mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Link to="/pages/home" className="flex items-center gap-3 p-3.5 sm:p-4 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
            <LayoutDashboard size={18} className="text-[#D4AF37] shrink-0" /> Edit Home Page
          </Link>
          <Link to="/images" className="flex items-center gap-3 p-3.5 sm:p-4 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
            <ImageIcon size={18} className="text-[#D4AF37] shrink-0" /> Media Library
          </Link>
          <Link to="/calendar" className="flex items-center gap-3 p-3.5 sm:p-4 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
            <Calendar size={18} className="text-[#D4AF37] shrink-0" /> Booking Calendar
          </Link>
          <Link to="/global" className="flex items-center gap-3 p-3.5 sm:p-4 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
            <Globe size={18} className="text-[#D4AF37] shrink-0" /> Global Elements
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
