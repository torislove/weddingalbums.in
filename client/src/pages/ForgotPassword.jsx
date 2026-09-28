import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="pt-[120px] pb-[60px] min-h-screen flex items-center justify-center bg-[#050505] p-5">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl w-full max-w-md shadow-2xl relative">
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif text-white mb-2">Reset Password</h1>
              <p className="text-gray-400">Enter your email address and we'll send you a link to reset your password.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#996515] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-black font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-900/20"
              >
                Send Reset Link <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center animate-slide-up">
            <CheckCircle2 size={64} className="text-[#10b981] mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-white mb-4">Check your email</h2>
            <p className="text-gray-400 mb-8">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Link to="/login" className="btn btn-outline w-full">Return to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
