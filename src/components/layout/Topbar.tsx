import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Check,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import type { Notification } from '@/data/mockData';

const notifIcons: Record<string, typeof Bell> = {
  capacity: AlertTriangle,
  workload: CheckCircle2,
  approval: Clock,
  queue: AlertTriangle,
  runtime: ShieldAlert,
  incident: ShieldAlert,
};

const notifColors: Record<string, string> = {
  capacity: 'text-amber-400 bg-amber-500/10',
  workload: 'text-green-400 bg-green-500/10',
  approval: 'text-blue-400 bg-blue-500/10',
  queue: 'text-amber-400 bg-amber-500/10',
  runtime: 'text-purple-400 bg-purple-500/10',
  incident: 'text-red-400 bg-red-500/10',
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const breadcrumbMap: Record<string, string> = {
    '/dashboard': 'Overview',
    '/dashboard/capacity': 'Capacity Registry',
    '/dashboard/workloads': 'Workload Orchestration',
    '/dashboard/optimization': 'Optimization Insight',
    '/dashboard/policies': 'Policy & Governance',
    '/dashboard/operations': 'Operations Console',
    '/dashboard/activity': 'Activity History',
    '/dashboard/settings': 'Settings',
    '/dashboard/profile': 'Profile',
  };

  const currentCrumb = breadcrumbMap[location.pathname] || 'Overview';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      navigate('/dashboard/workloads');
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AM';

  return (
    <header className="sticky top-0 z-20 h-16 bg-axis-900/80 backdrop-blur-md border-b border-axis-600 flex items-center justify-between px-4 lg:px-6 gap-4">
      {/* Left: Menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-ink-300 hover:text-ink-100 p-1.5 rounded-lg hover:bg-axis-700">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-ink-400">Dashboard</p>
          <p className="text-sm font-semibold text-ink-100">{currentCrumb}</p>
        </div>
      </div>

      {/* Right: Search, Notifs, Profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div ref={searchRef} className="relative">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg text-ink-300 hover:text-ink-100 hover:bg-axis-700 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-72 bg-axis-850 border border-axis-600 rounded-xl shadow-xl p-3"
              >
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search workloads, clusters, policies..."
                      className="input-field pl-10"
                    />
                  </div>
                </form>
                <div className="mt-2 text-xs text-ink-400 px-1">
                  <p className="font-medium mb-1">Quick searches</p>
                  <div className="flex flex-wrap gap-1">
                    {['Running workloads', 'Cluster Alpha', 'Pending approvals'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchQuery(tag);
                          navigate('/dashboard/workloads');
                          setShowSearch(false);
                        }}
                        className="text-[11px] px-2 py-1 rounded-md bg-axis-700 hover:bg-axis-600 text-ink-300 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-lg text-ink-300 hover:text-ink-100 hover:bg-axis-700 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-80 bg-axis-850 border border-axis-600 rounded-xl shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-axis-600">
                  <span className="text-sm font-semibold text-ink-100">Notifications</span>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-accent-500 hover:text-accent-400 font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.length === 0 ? (
                    <p className="text-center text-sm text-ink-400 py-8">No notifications</p>
                  ) : (
                    notifications.map((n: Notification) => {
                      const Icon = notifIcons[n.type] || Bell;
                      return (
                        <button
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.link) navigate(n.link);
                            setShowNotifs(false);
                          }}
                          className={`w-full flex items-start gap-3 px-4 py-3 border-b border-axis-700/50 hover:bg-axis-800 transition-colors text-left ${
                            !n.read ? 'bg-accent-600/5' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notifColors[n.type] || 'text-ink-400 bg-axis-700'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink-100">{n.title}</p>
                            <p className="text-xs text-ink-400 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-ink-500 mt-1">{timeAgo(n.timestamp)}</p>
                          </div>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0 mt-1.5" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 pr-2 rounded-lg hover:bg-axis-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-accent-600/20 text-accent-500 flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-ink-100 leading-tight">{user?.name || 'Alex Morgan'}</p>
              <p className="text-[11px] text-ink-400 leading-tight">{user?.role || 'Infrastructure Operator'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-ink-400 hidden md:block" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-56 bg-axis-850 border border-axis-600 rounded-xl shadow-xl py-2"
              >
                <div className="px-4 py-2 border-b border-axis-600">
                  <p className="text-sm font-medium text-ink-100">{user?.name || 'Alex Morgan'}</p>
                  <p className="text-xs text-ink-400">{user?.email || 'alex.morgan@computeaxis.net'}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-axis-800 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-axis-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
