import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  Cpu,
  BarChart3,
  Shield,
  Activity,
  History,
  Settings,
  CircuitBoard,
} from 'lucide-react';
import { type ReactNode, type LucideIcon } from 'react';

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Capacity Registry', icon: Server, path: '/dashboard/capacity' },
  { label: 'Workload Orchestration', icon: Cpu, path: '/dashboard/workloads' },
  { label: 'Optimization Insight', icon: BarChart3, path: '/dashboard/optimization' },
  { label: 'Policy & Governance', icon: Shield, path: '/dashboard/policies' },
  { label: 'Operations Console', icon: Activity, path: '/dashboard/operations' },
  { label: 'Activity History', icon: History, path: '/dashboard/activity' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-axis-900 border-r border-axis-600 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-axis-600 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center">
            <CircuitBoard className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-ink-100 tracking-tight">ComputeAxis</span>
            <span className="text-[10px] text-ink-400 block leading-none">GPU Orchestration</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`nav-link ${active ? 'active' : ''}`}
              >
                <item.icon className={`w-4.5 h-4.5 ${active ? 'text-accent-500' : ''}`} style={{ width: 18, height: 18 }} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Divider */}
          <div className="pt-4 mt-4 border-t border-axis-700">
            <NavLink
              to="/dashboard/settings"
              onClick={onClose}
              className={`nav-link ${isActive('/dashboard/settings') ? 'active' : ''}`}
            >
              <Settings className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Version */}
        <div className="px-5 py-3 border-t border-axis-600 shrink-0">
          <p className="text-[10px] text-ink-400 font-mono">v2.4.1 · build 20260916</p>
        </div>
      </aside>
    </>
  );
}

export function SidebarSkeleton(): ReactNode {
  return null;
}
