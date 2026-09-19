import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircuitBoard, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/lib/firebase';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-axis-950 p-6 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-accent-600 flex items-center justify-center">
            <CircuitBoard className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="text-lg font-bold text-ink-100">ComputeAxis</span>
            <span className="text-xs text-ink-400 block leading-none">GPU Compute Orchestration</span>
          </div>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-ink-100">Check your email</h2>
              <p className="text-sm text-ink-400 mt-2">
                We've sent a password reset link to <span className="text-ink-200 font-medium">{email}</span>.
                Follow the instructions to reset your password.
              </p>
              <Link to="/login" className="btn-secondary mt-6 inline-flex">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-ink-100">Reset your password</h2>
              <p className="text-sm text-ink-400 mt-1">
                Enter your work email and we'll send you a link to reset your password.
              </p>

              {error && (
                <p className="text-xs text-red-400 mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">{error}</p>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink-200 mb-1.5">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <Link to="/login" className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-200 mt-6 justify-center">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
