import React, { useState } from 'react';
import { ArrowRight, AlertCircle, Info } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call authentication
    setTimeout(() => {
      if (email.toLowerCase() === 'admin@salescrm.com' && password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-white"
            >
              <path d="M18 6L6 18M6 6l12 12" transform="rotate(45 12 12)" />
              <path d="M4 4h16v16H4z" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to access your dashboard</p>
        </div>

        {/* Credential Hint */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">Demo Credentials</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 text-blue-800">
              <span className="font-medium text-blue-600">Email:</span>
              <span className="font-mono">admin@salescrm.com</span>
              <span className="font-medium text-blue-600">Pass:</span>
              <span className="font-mono">admin123</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 placeholder-gray-400"
              placeholder="admin@salescrm.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200 mt-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account? <a href="#" className="text-blue-600 font-semibold hover:underline">Start free trial</a>
          </p>
        </div>
      </div>
      <p className="mt-6 text-xs text-gray-400">© 2024 SalesCRM Inc. All rights reserved.</p>
    </div>
  );
};