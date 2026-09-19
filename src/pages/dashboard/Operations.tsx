import { useState, useEffect, useCallback } from 'react';
import {
  Server, HardDrive, AlertTriangle, Ban, Clock,
  RefreshCw, Activity, CheckCircle2, UserPlus, Eye, MoreHorizontal,
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable, { type Column } from '@/components/dashboard/DataTable';
import PageHeader from '@/components/dashboard/PageHeader';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import LoadingState from '@/components/dashboard/LoadingState';
import { useToast } from '@/context/ToastContext';
import {
  getOperationsStatus, getAlerts, getIncidents, getQueues, assignIncidentOwner, acknowledgeAlert, resolveAlert,
} from '@/api/apiClient';
import type { Alert, Incident, QueueInfo } from '@/data/mockData';

interface ClusterHealth {
  id: string;
  name: string;
  health: 'Healthy' | 'Degraded' | 'Maintenance' | 'Offline';
  nodes: string;
  gpuUtil: number;
  memPressure: 'Low' | 'Medium' | 'High';
  activeWorkloads: number;
  alerts: number;
  status: string;
}

const clusterHealthData: ClusterHealth[] = [
  { id: 'ch1', name: 'Cluster Alpha', health: 'Healthy', nodes: '32/32', gpuUtil: 81, memPressure: 'Medium', activeWorkloads: 28, alerts: 0, status: 'Operational' },
  { id: 'ch2', name: 'Cluster Beta', health: 'Healthy', nodes: '64/64', gpuUtil: 82, memPressure: 'Medium', activeWorkloads: 42, alerts: 0, status: 'Operational' },
  { id: 'ch3', name: 'Cluster Gamma', health: 'Degraded', nodes: '14/16', gpuUtil: 60, memPressure: 'High', activeWorkloads: 12, alerts: 2, status: 'Warning' },
  { id: 'ch4', name: 'Cluster Delta', health: 'Healthy', nodes: '12/12', gpuUtil: 44, memPressure: 'Low', activeWorkloads: 6, alerts: 0, status: 'Operational' },
  { id: 'ch5', name: 'Cluster Epsilon', health: 'Healthy', nodes: '48/48', gpuUtil: 81, memPressure: 'Medium', activeWorkloads: 35, alerts: 0, status: 'Operational' },
  { id: 'ch6', name: 'Cluster Zeta', health: 'Healthy', nodes: '32/32', gpuUtil: 77, memPressure: 'Medium', activeWorkloads: 18, alerts: 0, status: 'Operational' },
  { id: 'ch7', name: 'Cluster Eta', health: 'Maintenance', nodes: '0/8', gpuUtil: 0, memPressure: 'Low', activeWorkloads: 0, alerts: 1, status: 'Maintenance' },
  { id: 'ch8', name: 'Cluster Theta', health: 'Healthy', nodes: '24/24', gpuUtil: 83, memPressure: 'Medium', activeWorkloads: 22, alerts: 0, status: 'Operational' },
  { id: 'ch9', name: 'Cluster Iota', health: 'Healthy', nodes: '6/6', gpuUtil: 42, memPressure: 'Low', activeWorkloads: 3, alerts: 0, status: 'Operational' },
  { id: 'ch10', name: 'Cluster Kappa', health: 'Degraded', nodes: '14/16', gpuUtil: 69, memPressure: 'High', activeWorkloads: 8, alerts: 3, status: 'Warning' },
  { id: 'ch11', name: 'Cluster Lambda', health: 'Healthy', nodes: '12/12', gpuUtil: 75, memPressure: 'Medium', activeWorkloads: 10, alerts: 1, status: 'Operational' },
  { id: 'ch12', name: 'Cluster Mu', health: 'Offline', nodes: '0/8', gpuUtil: 0, memPressure: 'Low', activeWorkloads: 0, alerts: 0, status: 'Decommissioned' },
];

const owners = ['Alex Morgan', 'Jordan Lee', 'Sam Patel', 'Taylor Quinn', 'Unassigned'];

export default function Operations() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [opsStatus, setOpsStatus] = useState<ReturnType<typeof getOperationsStatus> extends Promise<infer T> ? T : never>(null as never);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [confirm, setConfirm] = useState<{ action: string; alert: Alert } | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [status, alrts, incs, qs] = await Promise.all([
      getOperationsStatus(), getAlerts(), getIncidents(), getQueues(),
    ]);
    setOpsStatus(status as never);
    setAlerts(alrts);
    setIncidents(incs);
    setQueues(qs);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleAcknowledge = async (alert: Alert) => {
    try {
      await acknowledgeAlert(alert.id);
      setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, status: 'Acknowledged' } : a)));
      toast('Alert acknowledged.', 'success');
    } catch {
      toast('Failed to acknowledge alert.', 'error');
    }
  };

  const handleResolve = async (alert: Alert) => {
    try {
      await resolveAlert(alert.id);
      setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, status: 'Resolved' } : a)));
      toast('Alert resolved.', 'success');
    } catch {
      toast('Failed to resolve alert.', 'error');
    }
  };

  const handleAssignOwner = async (id: string, owner: string) => {
    try {
      await assignIncidentOwner(id, owner);
      setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, assignedOwner: owner } : i)));
      toast(`Incident assigned to ${owner}.`, 'success');
    } catch {
      toast('Failed to assign owner.', 'error');
    }
  };

  const queueColumns: Column<QueueInfo>[] = [
    { key: 'name', header: 'Queue', sortable: true, sortValue: (q) => q.name, render: (q) => <span className="font-medium text-ink-100">{q.name}</span> },
    { key: 'pendingJobs', header: 'Pending Jobs', sortable: true, sortValue: (q) => q.pendingJobs, render: (q) => <span className="tabular-nums">{q.pendingJobs}</span> },
    { key: 'oldestWait', header: 'Oldest Wait', sortable: true, sortValue: (q) => q.oldestWait },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      sortValue: (q) => q.priority,
      render: (q) => <span className={`text-xs font-medium ${q.priority === 'High' ? 'text-accent-500' : q.priority === 'Medium' ? 'text-blue-400' : 'text-ink-400'}`}>{q.priority}</span>,
    },
    { key: 'capacityAvailable', header: 'Capacity Available', render: (q) => <span className="text-xs">{q.capacityAvailable}</span> },
    { key: 'status', header: 'Status', render: (q) => <StatusBadge status={q.status} size="sm" /> },
  ];

  const incidentColumns: Column<Incident>[] = [
    { key: 'incident', header: 'Incident', sortable: true, sortValue: (i) => i.incident, render: (i) => <span className="font-medium text-ink-100">{i.incident}</span> },
    { key: 'severity', header: 'Severity', render: (i) => <StatusBadge status={i.severity} size="sm" /> },
    {
      key: 'assignedOwner',
      header: 'Assigned Owner',
      render: (i) => (
        <select
          value={i.assignedOwner}
          onChange={(e) => handleAssignOwner(i.id, e.target.value)}
          className="bg-axis-900 border border-axis-600 rounded-md px-2 py-1 text-xs text-ink-200 cursor-pointer focus:border-accent-500"
        >
          {owners.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ),
    },
    { key: 'opened', header: 'Opened', sortable: true, sortValue: (i) => i.opened, render: (i) => <span className="text-xs font-mono">{i.opened}</span> },
    { key: 'status', header: 'Status', render: (i) => <StatusBadge status={i.status} size="sm" /> },
  ];

  if (loading) return <LoadingState message="Loading operations console..." />;

  return (
    <div>
      <PageHeader
        title="Operations Console"
        subtitle="Monitor live workload state, cluster health, pending queues and operational exceptions."
        actions={
          <>
            <button onClick={loadData} className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <label className="flex items-center gap-2 text-sm text-ink-300 cursor-pointer px-3 py-2 rounded-lg bg-axis-800 border border-axis-600">
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="w-4 h-4 rounded border-axis-500 text-accent-600 focus:ring-accent-500/30" />
              Auto-refresh
            </label>
          </>
        }
      />

      {/* Status Banner */}
      <div className="card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-100">Compute Environment Status: <span className="text-green-400">Operational</span></p>
            <p className="text-xs text-ink-400">Last updated: {lastUpdated}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live monitoring active
        </div>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard icon={Server} label="Clusters Online" value={`${opsStatus.clustersOnline} / ${opsStatus.totalClusters}`} accent />
        <StatCard icon={HardDrive} label="Healthy Nodes" value={`${opsStatus.healthyNodes} / ${opsStatus.totalNodes}`} />
        <StatCard icon={AlertTriangle} label="Active Alerts" value={String(opsStatus.activeAlerts).padStart(2, '0')} />
        <StatCard icon={Ban} label="Blocked Workloads" value={String(opsStatus.blockedWorkloads).padStart(2, '0')} />
        <StatCard icon={Clock} label="Pending Approvals" value={String(opsStatus.pendingApprovals).padStart(2, '0')} />
      </div>

      {/* Cluster Health Table */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-ink-100 mb-3">Cluster Health</h3>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-axis-600 bg-axis-900/50">
                {['Cluster', 'Health', 'Nodes', 'GPU Util', 'Memory Pressure', 'Active Workloads', 'Alerts', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clusterHealthData.map((c) => (
                <tr key={c.id} className="table-row-hover border-b border-axis-700/50">
                  <td className="px-4 py-3 text-ink-100 font-medium whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${c.health === 'Healthy' ? 'badge-success' : c.health === 'Degraded' ? 'badge-warning' : c.health === 'Maintenance' ? 'badge-info' : 'badge-critical'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      {c.health}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-200 tabular-nums whitespace-nowrap">{c.nodes}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-axis-600 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${c.gpuUtil > 80 ? 'bg-accent-600' : c.gpuUtil > 60 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${c.gpuUtil}%` }} />
                      </div>
                      <span className="text-xs tabular-nums text-ink-300">{c.gpuUtil}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${c.memPressure === 'High' ? 'text-red-400' : c.memPressure === 'Medium' ? 'text-amber-400' : 'text-green-400'}`}>{c.memPressure}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-200 tabular-nums whitespace-nowrap">{c.activeWorkloads}</td>
                  <td className="px-4 py-3 text-ink-200 tabular-nums whitespace-nowrap">{c.alerts > 0 ? <span className="text-amber-400">{c.alerts}</span> : '0'}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Queues */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-ink-100 mb-3">Pending Queues</h3>
        <DataTable columns={queueColumns} data={queues} rowKey={(q) => q.id} />
      </div>

      {/* Exceptions & Alerts */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-ink-100 mb-3">Exceptions & Alerts</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  alert.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                  alert.severity === 'Warning' ? 'bg-amber-500/10 text-amber-400' :
                  alert.severity === 'Pending' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <AlertTriangle className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-ink-100">{alert.title}</h4>
                    <StatusBadge status={alert.status} size="sm" />
                  </div>
                  <p className="text-xs text-ink-400 mt-1">{alert.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-ink-500">
                    <span>Resource: <span className="text-ink-300">{alert.affectedResource}</span></span>
                    <span>Owner: <span className="text-ink-300">{alert.owner}</span></span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {alert.status === 'Active' && (
                      <button onClick={() => setConfirm({ action: 'acknowledge', alert })} className="text-xs px-2.5 py-1.5 rounded-md bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== 'Resolved' && (
                      <button onClick={() => setConfirm({ action: 'resolve', alert })} className="text-xs px-2.5 py-1.5 rounded-md bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                        Resolve
                      </button>
                    )}
                    <button onClick={() => toast(`Details for "${alert.title}" would open here.`, 'info')} className="text-xs px-2.5 py-1.5 rounded-md bg-axis-700 text-ink-300 hover:bg-axis-600 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Ownership */}
      <div>
        <h3 className="text-sm font-semibold text-ink-100 mb-3">Incident Ownership</h3>
        <DataTable columns={incidentColumns} data={incidents} rowKey={(i) => i.id} />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.action === 'acknowledge') handleAcknowledge(confirm.alert);
          else handleResolve(confirm.alert);
        }}
        title={confirm?.action === 'acknowledge' ? 'Acknowledge Alert' : 'Resolve Alert'}
        message={`Are you sure you want to ${confirm?.action} "${confirm?.alert.title}"?`}
        confirmLabel={confirm?.action === 'acknowledge' ? 'Acknowledge' : 'Resolve'}
        variant={confirm?.action === 'resolve' ? 'info' : 'warning'}
      />
    </div>
  );
}
