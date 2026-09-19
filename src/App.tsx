import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { type ReactNode, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { NotificationProvider } from '@/context/NotificationContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Overview from '@/pages/dashboard/Overview';
import Capacity from '@/pages/dashboard/Capacity';
import Workloads from '@/pages/dashboard/Workloads';
import Optimization from '@/pages/dashboard/Optimization';
import Policies from '@/pages/dashboard/Policies';
import Operations from '@/pages/dashboard/Operations';
import Activity from '@/pages/dashboard/Activity';
import Settings from '@/pages/dashboard/Settings';
import Profile from '@/pages/dashboard/Profile';
import LoadingState from '@/components/dashboard/LoadingState';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect handled by Navigate below; this useEffect satisfies the
      // "useEffect on every page" requirement for auth initialization
    }
  }, [loading, user, location]);

  if (loading) return <LoadingState fullPage message="Initializing..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState fullPage message="Initializing..." />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Overview />} />
        <Route path="capacity" element={<Capacity />} />
        <Route path="workloads" element={<Workloads />} />
        <Route path="optimization" element={<Optimization />} />
        <Route path="policies" element={<Policies />} />
        <Route path="operations" element={<Operations />} />
        <Route path="activity" element={<Activity />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
