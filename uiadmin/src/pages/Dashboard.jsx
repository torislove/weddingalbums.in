import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ImageIcon, ShoppingCart, Users, Briefcase, Activity } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';


const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
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
    <div className="p-10 animate-slide-up h-full flex flex-col max-w-5xl mx-auto overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-white mb-2">Welcome to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37]">Premium Admin</span></h1>
        <p className="text-gray-400 text-lg">Manage your business operations, edit site content, and fulfill orders.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin"></div>
          Loading statistics...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-[60px] opacity-10 group-hover:opacity-20 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Total Orders</h3>
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><ShoppingCart size={20} /></div>
            </div>
            <p className="text-4xl font-bold text-white">{stats?.orders || 0}</p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full mix-blend-screen filter blur-[60px] opacity-10 group-hover:opacity-20 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Pending Tasks</h3>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Activity size={20} /></div>
            </div>
            <p className="text-4xl font-bold text-white">{stats?.pendingTasks || 0} <span className="text-sm font-normal text-gray-500">/ {stats?.tasks || 0} total</span></p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-[60px] opacity-10 group-hover:opacity-20 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">B2B Studios</h3>
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Briefcase size={20} /></div>
            </div>
            <p className="text-4xl font-bold text-white">{stats?.b2bUsers || 0} <span className="text-sm font-normal text-gray-500">/ {stats?.users || 0} users</span></p>
          </div>
        </div>
      )}

      <div className="glass-panel p-8 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden mt-auto">
        <h3 className="text-xl font-serif text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <a href="/pages/home" className="flex items-center gap-3 p-4 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
            <LayoutDashboard size={20} className="text-[#D4AF37]" /> Edit Home Page
          </a>
          <a href="/images" className="flex items-center gap-3 p-4 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
            <ImageIcon size={20} className="text-[#D4AF37]" /> Media Library
          </a>
          <a href="/tasks" className="flex items-center gap-3 p-4 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
            <Activity size={20} className="text-[#D4AF37]" /> Manage Tasks
          </a>
          <a href="/pricing" className="flex items-center gap-3 p-4 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
            <ShoppingCart size={20} className="text-[#D4AF37]" /> Manage Pricing
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
