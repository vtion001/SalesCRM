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
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background Image - Full visibility */}
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dbviya1rj/image/upload/v1769524634/j4onrzilnfx79zjdemxx.png" 
            alt="Sales Team Collaboration" 
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay only at edges */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-indigo-900/30"></div>
        </div>
        
        {/* Minimal content overlay - bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-lg"
          >
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-2xl mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-900 tracking-wide">LIVE DASHBOARD</span>
            </div>
            
            {/* Main card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <TrendingUp className="text-white" size={28} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Drive Revenue Growth</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Streamline your sales process with intelligent automation and real-time insights
                  </p>
                </div>
              </div>
              
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div>
                  <div className="text-2xl font-black text-slate-900">24/7</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">2.5x</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Efficiency</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">98%</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Win Rate</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Top right minimal branding */}
        <div className="absolute top-8 right-8">
          <div className="bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={18} fill="currentColor" />
              </div>
              <span className="text-sm font-black text-slate-900 tracking-tight">SalesCRM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
