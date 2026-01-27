import React, { useState, useEffect } from 'react';
import { X, Shield, Smartphone, Copy, Check, AlertCircle, Key } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface MFASetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MFASetupModal: React.FC<MFASetupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'intro' | 'scan' | 'verify' | 'recovery'>('intro');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || 'https://sales-crm-sigma-eosin.vercel.app';

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep('intro');
      setQrCode('');
      setSecret('');
      setVerificationCode('');
      setRecoveryCodes([]);
      setError('');
    }
  }, [isOpen]);

  const enrollTOTP = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch(`${API_BASE}/api/mfa/enroll-totp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll MFA');
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep('scan');

    } catch (err: any) {
      setError(err.message || 'Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTOTP = async () => {
    if (verificationCode.length !== 6) {
      setError('Code must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch(`${API_BASE}/api/mfa/verify-totp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      setRecoveryCodes(data.recoveryCodes);
      setStep('recovery');

    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const complete = () => {
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Set Up MFA</h2>
              <p className="text-xs text-gray-500">Protect your account with 2FA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Intro */}
          {step === 'intro' && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enable Multi-Factor Authentication
                </h3>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security by requiring a code from your authenticator app when signing in.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Smartphone className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Authenticator App</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Use Google Authenticator, Microsoft Authenticator, Authy, or any TOTP-compatible app
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Key className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Recovery Codes</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Save backup codes to access your account if you lose your device
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={enrollTOTP}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Setting up...' : 'Continue'}
              </button>
            </div>
          )}

          {/* Step 2: Scan QR Code */}
          {step === 'scan' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Scan QR Code
                </h3>
                <p className="text-sm text-gray-600">
                  Open your authenticator app and scan this QR code
                </p>
              </div>

              {qrCode && (
                <div className="flex justify-center py-4">
                  <img src={qrCode} alt="MFA QR Code" className="w-48 h-48 border-4 border-gray-100 rounded-lg" />
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Or enter this key manually:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono bg-white px-3 py-2 rounded border border-gray-200 break-all">
                    {secret}
                  </code>
                  <button
                    onClick={copySecret}
                    className="shrink-0 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title="Copy secret key"
                  >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep('verify')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                I've Scanned the Code
              </button>
            </div>
          )}

          {/* Step 3: Verify Code */}
          {step === 'verify' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Verify Setup
                </h3>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('scan')}
                  className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={verifyTOTP}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Enable'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Recovery Codes */}
          {step === 'recovery' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="text-green-600" size={24} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  MFA Enabled Successfully!
                </h3>
                <p className="text-sm text-gray-600">
                  Save these recovery codes in a safe place
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs font-medium text-yellow-900 mb-2">
                  ⚠️ Save these codes now - they won't be shown again
                </p>
                <p className="text-xs text-yellow-800">
                  Use these codes to access your account if you lose your authenticator device.
                  Each code can only be used once.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-700">Recovery Codes:</p>
                  <button
                    onClick={copyRecoveryCodes}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {recoveryCodes.map((code, index) => (
                    <code key={index} className="text-xs font-mono bg-white px-3 py-2 rounded border border-gray-200 text-center">
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              <button
                onClick={complete}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Done - I've Saved My Codes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
