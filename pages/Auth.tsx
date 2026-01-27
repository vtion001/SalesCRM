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

      {/* Right Side: Banana Pro Visual Side */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0px)', backgroundSize: '48px 48px' }}></div>
        </div>
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-[128px] opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-fuchsia-600 rounded-full blur-[128px] opacity-20"></div>

        <div className="relative h-full flex flex-col items-center justify-center p-16 text-white">
          <div className="max-w-xl w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative mb-12"
            >
              {/* Main Visual Image Container */}
              <div className="bg-white/10 backdrop-blur-3xl rounded-[48px] p-3 border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
                <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden group">
                  {/* High Quality "Banana Pro" Style Sales Visual */}
                  <img 
                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1600" 
                    alt="Sales Pipeline" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Floating Metric Card */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Revenue Growth</p>
                        <p className="text-2xl font-black mt-1">+$428,500.00</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <TrendingUp size={24} strokeWidth={3} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-6 -right-6 bg-yellow-400 text-slate-900 px-6 py-3 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest rotate-6 group-hover:rotate-0 transition-transform"
              >
                PRO EDITION v2.0
              </motion.div>
            </motion.div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-[24px] p-5 border border-white/10 hover:bg-white/10 transition-colors cursor-default"
              >
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-yellow-400" size={24} />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight text-white">Automated</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lead Capture</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-[24px] p-5 border border-white/10 hover:bg-white/10 transition-colors cursor-default"
              >
                <div className="w-12 h-12 bg-indigo-400/20 rounded-xl flex items-center justify-center">
                  <Users className="text-indigo-400" size={24} />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight text-white">Unified</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact Feed</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};