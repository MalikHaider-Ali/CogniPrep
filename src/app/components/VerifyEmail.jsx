'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Mail, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

export default function VerifyEmail() {
  const { user, resendVerificationEmail, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    try {
      setResending(true);
      setError('');
      await resendVerificationEmail();
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (err) {
      setError('Failed to resend email. Please try again.');
      console.error(err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div className="max-w-md w-full bg-gray-900 rounded-3xl p-8 border border-gray-800 text-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Verify Your Email</h1>
        <p className="text-gray-400 mb-6">
          We've sent a verification link to:
          <br />
          <span className="font-mono text-purple-300">{user?.email}</span>
        </p>

        <p className="text-sm text-gray-500 mb-8">
          Please check your inbox (and spam folder) and click the link to verify your account.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-300 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            {error}
          </div>
        )}

        {resent && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-800 rounded-lg text-green-300 text-sm flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5" />
            Verification email resent!
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl py-3 px-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {resending ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Resend Verification Email
              </>
            )}
          </button>

          <button
            onClick={logout}
            className="w-full text-gray-400 hover:text-gray-300 py-2"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}