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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            {requiresMFA ? (
              <Shield className="w-7 h-7 text-white" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-white"
              >
                <path d="M18 6L6 18M6 6l12 12" transform="rotate(45 12 12)" />
                <path d="M4 4h16v16H4z" strokeWidth="2" />
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">SalesCRM</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {requiresMFA ? 'Two-Factor Authentication' : 'Sign in to your account'}
          </p>
        </div>

        {!requiresMFA ? (
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-100">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 placeholder-gray-400 disabled:opacity-50"
              placeholder="admin@salescrm.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 placeholder-gray-400 disabled:opacity-50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        ) : (
          <form onSubmit={handleMFAVerify} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-100">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">MFA Enabled</p>
              <p className="text-xs text-gray-600 mt-1">
                {useRecoveryCode ? 'Enter a recovery code' : 'Enter the 6-digit code from your authenticator app'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {useRecoveryCode ? 'Recovery Code' : 'Verification Code'}
              </label>
              <input
                type="text"
                inputMode={useRecoveryCode ? 'text' : 'numeric'}
                maxLength={useRecoveryCode ? 9 : 6}
                value={mfaCode}
                onChange={(e) => setMfaCode(useRecoveryCode ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-center text-lg font-mono tracking-wider text-gray-900 disabled:opacity-50"
                placeholder={useRecoveryCode ? 'XXXX-XXXX' : '000000'}
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
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
              className="w-full text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              ← Back to login
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            
          </p>
        </div>
      </div>
    </div>
  );
};
