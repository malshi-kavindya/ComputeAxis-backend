import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircuitBoard, Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, Cpu, Server, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/lib/firebase';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

export default function Login() {
  const { user, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Work email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setServerError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setServerError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setServerError(getAuthErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-axis-950 relative overflow-hidden flex-col justify-between p-12 grid-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-600 flex items-center justify-center">
              <CircuitBoard className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-ink-100">ComputeAxis</span>
              <span className="text-xs text-ink-400 block leading-none">GPU Compute Orchestration</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-ink-100 leading-tight"
          >
            Orchestrate GPU capacity across your entire AI infrastructure.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-ink-400 mt-4 text-base leading-relaxed"
          >
            Monitor workload demand, optimize accelerator allocation, and govern runtime policies from a single control plane.
          </motion.p>

          {/* Decorative metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mt-10"
          >
            <div className="card p-4">
              <Cpu className="w-5 h-5 text-accent-500 mb-2" />
              <p className="text-xl font-bold text-ink-100 tabular-nums">2,624</p>
              <p className="text-xs text-ink-400">Accelerators</p>
            </div>
            <div className="card p-4">
              <Server className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-xl font-bold text-ink-100 tabular-nums">12</p>
              <p className="text-xs text-ink-400">Clusters</p>
            </div>
            <div className="card p-4">
              <Activity className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-xl font-bold text-ink-100 tabular-nums">76.4%</p>
              <p className="text-xs text-ink-400">Utilization</p>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-xs text-ink-500">
          <p>computeaxis.net — Enterprise GPU Infrastructure Platform</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-axis-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-accent-600 flex items-center justify-center">
              <CircuitBoard className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-ink-100">ComputeAxis</span>
          </div>

          <h2 className="text-2xl font-bold text-ink-100">Sign In</h2>
          <p className="text-sm text-ink-400 mt-1">Access your GPU compute operations dashboard.</p>

          {serverError && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-200 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500/50' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-axis-500 bg-axis-800 text-accent-600 focus:ring-accent-500/30"
                />
                <span className="text-sm text-ink-300">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-accent-500 hover:text-accent-400 font-medium">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading || googleLoading} className="btn-primary w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-axis-600" />
            <span className="text-xs text-ink-500">OR</span>
            <div className="flex-1 h-px bg-axis-600" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-axis-500 bg-axis-800 text-sm font-medium text-ink-100 hover:bg-axis-700 transition-colors disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>

          <p className="text-sm text-ink-400 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-500 hover:text-accent-400 font-medium">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
