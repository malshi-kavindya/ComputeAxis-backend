import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircuitBoard, Eye, EyeOff, Mail, Lock, User, Building2, Briefcase, Loader2, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/lib/firebase';

const roles = [
  'Infrastructure Operator',
  'Platform Engineer',
  'MLOps Engineer',
  'Research Computing',
  'FinOps Stakeholder',
  'Administrator',
];

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'];
  return { score, label: labels[score], color: colors[score] };
}

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    password: '',
    confirmPassword: '',
    agree: false,
  remember: false,
  showPassword: false,
  showConfirm: false,
  loading: false,
    serverError: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const set = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = 'Full name is required';
    if (!form.email) e.email = 'Work email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.company) e.company = 'Company / Organization is required';
    if (!form.role) e.role = 'Please select a role';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    if (!form.agree) e.agree = 'You must agree to the Terms of Service and Privacy Policy';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, serverError: '' }));
    if (!validate()) return;
    setForm((prev) => ({ ...prev, loading: true }));
    try {
      await register({
        name: form.name,
        email: form.email,
        company: form.company,
        role: form.role,
        password: form.password,
      });
      navigate('/dashboard');
    } catch (error) {
      setForm((prev) => ({ ...prev, serverError: getAuthErrorMessage(error) }));
    } finally {
      setForm((prev) => ({ ...prev, loading: false }));
    }
  };

  const pw = passwordStrength(form.password);

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
            Build a unified control plane for your AI compute infrastructure.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-ink-400 mt-4 text-base leading-relaxed"
          >
            Register your workspace to manage clusters, workloads, policies, and operations across your entire GPU fleet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 space-y-3"
          >
            {[
              'Capacity registry with cluster and accelerator tracking',
              'Workload orchestration with queue and runtime governance',
              'Optimization insights with utilization and queue pressure analysis',
              'Policy enforcement with change review workflows',
            ].map((feat) => (
              <div key={feat} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-accent-600/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent-500" />
                </div>
                <p className="text-sm text-ink-300">{feat}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 text-xs text-ink-500">
          <p>computeaxis.net — Enterprise GPU Infrastructure Platform</p>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-axis-900 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md my-8"
        >
          <div className="flex lg:hidden items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-lg bg-accent-600 flex items-center justify-center">
              <CircuitBoard className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-ink-100">ComputeAxis</span>
          </div>

          <h2 className="text-2xl font-bold text-ink-100">Create your ComputeAxis workspace</h2>
          <p className="text-sm text-ink-400 mt-1">Get started with GPU compute orchestration.</p>

          {form.serverError && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {form.serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink-200 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input id="name" type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="Alex Morgan" className={`input-field pl-10 ${errors.name ? 'border-red-500/50' : ''}`} />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-200 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                  placeholder="you@company.com" className={`input-field pl-10 ${errors.email ? 'border-red-500/50' : ''}`} />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-ink-200 mb-1.5">Company / Organization</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input id="company" type="text" value={form.company} onChange={(e) => set('company', e.target.value)}
                    placeholder="Acme AI Labs" className={`input-field pl-10 ${errors.company ? 'border-red-500/50' : ''}`} />
                </div>
                {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company}</p>}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-ink-200 mb-1.5">Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <select id="role" value={form.role} onChange={(e) => set('role', e.target.value)}
                    className={`input-field pl-10 appearance-none cursor-pointer ${errors.role ? 'border-red-500/50' : ''}`}>
                    <option value="">Select role</option>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {errors.role && <p className="text-xs text-red-400 mt-1">{errors.role}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-200 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input id="password" type={form.showPassword ? 'text' : 'password'} value={form.password}
                  onChange={(e) => set('password', e.target.value)} placeholder="Create a password"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`} />
                <button type="button" onClick={() => set('showPassword', !form.showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200">
                  {form.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < pw.score ? pw.color : 'bg-axis-600'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-ink-400 mt-1">{pw.label}</p>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-200 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input id="confirmPassword" type={form.showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)} placeholder="Re-enter password"
                  className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500/50' : ''}`} />
                <button type="button" onClick={() => set('showConfirm', !form.showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200">
                  {form.showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={form.agree} onChange={(e) => set('agree', e.target.checked)}
                  className="w-4 h-4 rounded border-axis-500 bg-axis-800 text-accent-600 focus:ring-accent-500/30 mt-0.5" />
                <span className="text-sm text-ink-300">
                  I agree to the <span className="text-accent-500">Terms of Service</span> and <span className="text-accent-500">Privacy Policy</span>
                </span>
              </label>
              {errors.agree && <p className="text-xs text-red-400 mt-1">{errors.agree}</p>}
            </div>

            <button type="submit" disabled={form.loading} className="btn-primary w-full">
              {form.loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-sm text-ink-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-500 hover:text-accent-400 font-medium">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
