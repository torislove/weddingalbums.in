import React, { useState } from 'react';
import { Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';


const AdminLogin = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else if (data.user?.role !== 'admin') {
        setError('Unauthorized: Admin access required');
      } else {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#050505] p-5 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse"></div>
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl w-full max-w-md shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#996515] shadow-lg shadow-yellow-900/30 flex items-center justify-center mb-4">
            <Sparkles size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-serif text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Sign in to manage weddingalbums.in</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="admin@weddingalbums.in"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#996515] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-black font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-900/20"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
