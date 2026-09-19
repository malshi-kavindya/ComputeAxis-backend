import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu, Server, Activity, Clock, Gauge, AlertTriangle,
  Plus, Zap, ArrowRight, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import PageHeader from '@/components/dashboard/PageHeader';
import Modal from '@/components/dashboard/Modal';
import LoadingState from '@/components/dashboard/LoadingState';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getOverviewData, getOperationalEvents, getWorkloads } from '@/api/apiClient';
import { utilization24h, workloadActivity, capacityDistribution } from '@/data/mockData';
import type { OperationalEvent, Workload } from '@/data/mockData';

const chartTooltipStyle = {
  backgroundColor: '#181C25',
  border: '1px solid #242A35',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#D9D9D9',
};

export default function Overview() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReturnType<typeof getOverviewData> extends Promise<infer T> ? T : never>(null as never);
  const [events, setEvents] = useState<OperationalEvent[]>([]);
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [showRegisterCapacity, setShowRegisterCapacity] = useState(false);
  const [showSubmitWorkload, setShowSubmitWorkload] = useState(false);

  useEffect(() => {
    (async () => {
      const [overview, ops, wls] = await Promise.all([
        getOverviewData(),
        getOperationalEvents(),
        getWorkloads(),
      ]);
      setData(overview as never);
      setEvents(ops);
      setWorkloads(wls.slice(0, 5));
      setLoading(false);
    })();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Alex';

  if (loading) return <LoadingState message="Loading overview data..." />;

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${firstName}`}
        subtitle="Monitor your compute environment, workload activity and operational priorities."
        actions={
          <>
            <button onClick={() => setShowRegisterCapacity(true)} className="btn-secondary">
              <Server className="w-4 h-4" />
              Register Capacity
            </button>
            <button onClick={() => setShowSubmitWorkload(true)} className="btn-primary">
              <Zap className="w-4 h-4" />
              Submit Workload
            </button>
          </>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard icon={Cpu} label="GPU Capacity" value={data.stats.gpuCapacity.toLocaleString()} sublabel="Accelerators tracked" accent />
        <StatCard icon={Server} label="Available Capacity" value={data.stats.availableCapacity} sublabel="GPUs available" trend={{ value: '+3.2%', direction: 'up' }} />
        <StatCard icon={Activity} label="Active Workloads" value={data.stats.activeWorkloads} sublabel="Currently running" trend={{ value: '+5.1%', direction: 'up' }} />
        <StatCard icon={Clock} label="Queued Workloads" value={data.stats.queuedWorkloads} sublabel="Awaiting allocation" trend={{ value: '-2.4%', direction: 'down' }} />
        <StatCard icon={Gauge} label="Average Utilization" value={`${data.stats.averageUtilization}%`} sublabel="Across active clusters" trend={{ value: '+1.8%', direction: 'up' }} />
        <StatCard icon={AlertTriangle} label="Active Alerts" value={String(data.stats.activeAlerts).padStart(2, '0')} sublabel="Requires attention" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* GPU Utilization */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-ink-100">GPU Utilization</h3>
              <p className="text-xs text-ink-400">Last 24 hours</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-ink-300"><span className="w-2.5 h-2.5 rounded-sm bg-accent-600" />Utilization</span>
              <span className="flex items-center gap-1.5 text-ink-300"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />Allocated</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={utilization24h}>
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="allocGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#242A35" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#777C86', fontSize: 11 }} axisLine={{ stroke: '#242A35' }} tickLine={false} />
              <YAxis tick={{ fill: '#777C86', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="utilization" stroke="#FF6B35" strokeWidth={2} fill="url(#utilGrad)" />
              <Area type="monotone" dataKey="allocated" stroke="#3B82F6" strokeWidth={2} fill="url(#allocGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Capacity Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-100 mb-1">Capacity Distribution</h3>
          <p className="text-xs text-ink-400 mb-4">Current allocation state</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={capacityDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2}>
                {capacityDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="#181C25" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {capacityDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-300">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="text-ink-200 font-medium tabular-nums">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workload Activity Bar Chart */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-ink-100">Workload Activity</h3>
            <p className="text-xs text-ink-400">Last 7 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-ink-300"><span className="w-2.5 h-2.5 rounded-sm bg-green-500" />Running</span>
            <span className="flex items-center gap-1.5 text-ink-300"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />Queued</span>
            <span className="flex items-center gap-1.5 text-ink-300"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />Completed</span>
            <span className="flex items-center gap-1.5 text-ink-300"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" />Failed</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={workloadActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#242A35" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#777C86', fontSize: 11 }} axisLine={{ stroke: '#242A35' }} tickLine={false} />
            <YAxis tick={{ fill: '#777C86', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#242A3550' }} />
            <Bar dataKey="running" fill="#22C55E" radius={[3, 3, 0, 0]} />
            <Bar dataKey="queued" fill="#A855F7" radius={[3, 3, 0, 0]} />
            <Bar dataKey="completed" fill="#3B82F6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="failed" fill="#EF4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Events + Workload Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Operational Events */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-100">Recent Operational Events</h3>
            <button onClick={() => navigate('/dashboard/operations')} className="text-xs text-accent-500 hover:text-accent-400 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-axis-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink-100 font-medium truncate">{ev.event}</p>
                  <p className="text-xs text-ink-400">{ev.cluster} · {ev.owner} · {ev.time}</p>
                </div>
                <StatusBadge status={ev.severity} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Workload Queue Preview */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-100">Workload Queue Preview</h3>
            <button onClick={() => navigate('/dashboard/workloads')} className="text-xs text-accent-500 hover:text-accent-400 flex items-center gap-1">
              View All Workloads <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {workloads.map((wl) => (
              <div key={wl.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-axis-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink-100 font-medium truncate">{wl.name}</p>
                  <p className="text-xs text-ink-400">{wl.owner} · {wl.gpuRequest} GPUs</p>
                </div>
                <span className="text-xs text-ink-300 hidden sm:block">{wl.priority}</span>
                <StatusBadge status={wl.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Register Capacity Modal (simplified redirect) */}
      <Modal
        isOpen={showRegisterCapacity}
        onClose={() => setShowRegisterCapacity(false)}
        title="Register Capacity"
        subtitle="Add a new cluster to your capacity registry."
        footer={
          <>
            <button onClick={() => setShowRegisterCapacity(false)} className="btn-secondary">Cancel</button>
            <button
              onClick={() => {
                setShowRegisterCapacity(false);
                navigate('/dashboard/capacity');
                toast('Navigate to Capacity Registry to register a cluster.', 'info');
              }}
              className="btn-primary"
            >
              Go to Capacity Registry
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-400">
          You can register a new cluster, add nodes, and configure accelerator inventory from the Capacity Registry page.
        </p>
      </Modal>

      {/* Submit Workload Modal (simplified redirect) */}
      <Modal
        isOpen={showSubmitWorkload}
        onClose={() => setShowSubmitWorkload(false)}
        title="Submit Workload"
        subtitle="Submit a new workload for GPU allocation."
        footer={
          <>
            <button onClick={() => setShowSubmitWorkload(false)} className="btn-secondary">Cancel</button>
            <button
              onClick={() => {
                setShowSubmitWorkload(false);
                navigate('/dashboard/workloads');
                toast('Navigate to Workload Orchestration to submit a workload.', 'info');
              }}
              className="btn-primary"
            >
              Go to Workloads
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-400">
          You can submit a new workload, configure resource requirements, and set queue priorities from the Workload Orchestration page.
        </p>
      </Modal>
    </div>
  );
}
