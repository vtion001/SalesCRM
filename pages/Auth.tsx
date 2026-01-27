import React, { useState } from 'react';
import { AlertCircle, Shield } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('admin@salescrm.com');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
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
        // Check if MFA is enabled
        const mfaEnabled = data.user.user_metadata?.mfa_enabled;
        if (mfaEnabled && !requiresMFA) {
          // Require MFA verification
          setRequiresMFA(true);
          setIsLoading(false);
          return;
        }

        console.log('Login successful:', data.user.email);
        window.location.href = '/';
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mfaCode.length < 6) {
      setError('Please enter a valid code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://sales-crm-sigma-eosin.vercel.app';
      
      const response = await fetch(`${API_BASE}/api/mfa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'challenge',
          email,
          password,
          mfaCode,
          useRecoveryCode
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'MFA verification failed');
      }

      // MFA verified successfully
      console.log('MFA verification successful');
      window.location.href = '/';

    } catch (err: any) {
      setError(err.message || 'MFA verification failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">SalesCRM</h1>
            <p className="text-slate-500 text-sm font-medium">
              {requiresMFA ? 'Two-Factor Authentication' : 'Create an account'}
            </p>
          </div>

          {!requiresMFA ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all outline-none text-sm text-slate-900 placeholder-slate-400 disabled:opacity-50 font-medium"
                  placeholder="email@domain.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all outline-none text-sm text-slate-900 placeholder-slate-400 disabled:opacity-50 font-medium"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-400" />
                  <span className="text-slate-600 font-medium">Remember me</span>
                </label>
                <div className="flex-1"></div>
                <button type="button" className="text-slate-600 hover:text-slate-900 font-medium">
                  Forgot?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl shadow-yellow-500/30 uppercase tracking-wider text-sm"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  'Create'
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-sm text-slate-500 font-medium">
                  Already have an account?{' '}
                  <button type="button" className="text-slate-900 font-bold hover:underline">
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMFAVerify} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-yellow-50 rounded-xl p-5 text-center border-2 border-yellow-200">
                <Shield className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                <p className="text-sm font-black text-slate-900 uppercase tracking-wider">MFA Required</p>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  {useRecoveryCode ? 'Enter a recovery code' : 'Enter the 6-digit code from your authenticator app'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  {useRecoveryCode ? 'Recovery Code' : 'Verification Code'}
                </label>
                <input
                  type="text"
                  inputMode={useRecoveryCode ? 'text' : 'numeric'}
                  maxLength={useRecoveryCode ? 9 : 6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(useRecoveryCode ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                  className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all outline-none text-center text-2xl font-mono tracking-widest text-slate-900 disabled:opacity-50 font-bold"
                  placeholder={useRecoveryCode ? 'XXXX-XXXX' : '000000'}
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl shadow-yellow-500/30 uppercase tracking-wider text-sm"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify & Sign In'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setUseRecoveryCode(!useRecoveryCode);
                  setMfaCode('');
                  setError('');
                }}
                className="w-full text-sm text-slate-600 hover:text-slate-900 font-bold"
              >
                {useRecoveryCode ? 'Use authenticator app instead' : 'Use recovery code'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequiresMFA(false);
                  setMfaCode('');
                  setError('');
                }}
                className="w-full text-sm text-slate-600 hover:text-slate-900 font-bold"
              >
                ← Back to login
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center font-medium">
              By signing up, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-xl">
            {/* Main Image Area */}
            <div className="relative mb-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto mb-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="text-2xl font-black tracking-tight">Welcome to SalesCRM</h3>
                    <p className="text-sm text-slate-300 mt-2 font-medium">Manage your sales pipeline efficiently</p>
                  </div>
                </div>
              </div>

              {/* Floating Notification */}
              <div className="absolute -top-4 -left-4 bg-yellow-400 text-slate-900 px-4 py-2 rounded-xl shadow-2xl font-bold text-sm">
                🎉 Welcome back!
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
