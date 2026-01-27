import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, Users, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('admin@salescrm.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(`Login failed: ${signInError.message}`);
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        window.location.href = '/';
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-white z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center mb-6 shadow-2xl shadow-indigo-200 rotate-3">
              <Zap className="text-white" size={28} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Access your sales intelligence</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-3 text-rose-600 text-xs font-bold bg-rose-50 p-4 rounded-2xl border border-rose-100"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl text-sm font-bold outline-none transition-all text-slate-900 placeholder:text-slate-300 disabled:opacity-50"
                placeholder="admin@salescrm.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl text-sm font-bold outline-none transition-all text-slate-900 placeholder:text-slate-300 disabled:opacity-50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-200 active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                'Launch Dashboard'
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" />
              Secure Enterprise Environment
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Visual Side */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2600" 
            alt="Sales Analytics" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/80"></div>
        </div>
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-[128px] opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-fuchsia-600 rounded-full blur-[128px] opacity-20"></div>

        <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-xl">
            <div className="relative mb-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto mb-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <h3 className="text-2xl font-black tracking-tight">Welcome to SalesCRM</h3>
                    <p className="text-sm text-slate-300 mt-2 font-medium">Manage your sales pipeline efficiently</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-yellow-400 text-slate-900 px-4 py-2 rounded-xl shadow-2xl font-bold text-sm">🎉 Welcome back!</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm">Lead Management</p>
                  <p className="text-xs text-slate-400">Track and convert prospects</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm">Analytics Dashboard</p>
                  <p className="text-xs text-slate-400">Real-time insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
