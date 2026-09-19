import { useState, useEffect, useMemo } from 'react';
import {
  Server, Cpu, HardDrive, Wrench, Plus, Download, Search,
  MoreHorizontal, Eye, Edit, Activity, RefreshCw,
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable, { type Column } from '@/components/dashboard/DataTable';
import PageHeader, { SearchBar, FilterDropdown } from '@/components/dashboard/PageHeader';
import Modal from '@/components/dashboard/Modal';
import Drawer from '@/components/dashboard/Drawer';
import LoadingState from '@/components/dashboard/LoadingState';
import { useToast } from '@/context/ToastContext';
import { getClusters, createCluster } from '@/api/apiClient';
import type { Cluster } from '@/data/mockData';

const statusFilters = [
  { value: 'Operational', label: 'Operational' },
  { value: 'Warning', label: 'Warning' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Decommissioned', label: 'Decommissioned' },
];

const gpuTypes = [
  { value: 'NVIDIA H100', label: 'NVIDIA H100' },
  { value: 'NVIDIA A100', label: 'NVIDIA A100' },
  { value: 'NVIDIA L40S', label: 'NVIDIA L40S' },
  { value: 'NVIDIA A10', label: 'NVIDIA A10' },
  { value: 'NVIDIA V100', label: 'NVIDIA V100' },
];

const environments = ['Production', 'Research', 'Inference', 'Development'];
const tenancies = ['Dedicated', 'Shared', 'Multi-tenant'];
const runtimeProfiles = ['Training Standard', 'Inference Optimized', 'Research Experimental', 'Batch Processing', 'Simulation Standard'];

export default function Capacity() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gpuFilter, setGpuFilter] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showRegister, setShowRegister] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', environment: '', owner: '', tenancy: '', gpuType: '',
    totalGpus: '', reservedGpus: '', maintenanceState: 'Operational',
    driverVersion: '535.129.03', runtimeProfile: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const data = await getClusters();
      setClusters(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return clusters.filter((c) => {
      if (activeTab !== 'All' && c.status !== activeTab) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (gpuFilter && c.gpuType !== gpuFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.gpuType.toLowerCase().includes(q) || c.owner.toLowerCase().includes(q);
      }
      return true;
    });
  }, [clusters, activeTab, statusFilter, gpuFilter, search]);

  const summary = useMemo(() => {
    const totalClusters = clusters.length;
    const totalNodes = clusters.reduce((s, c) => s + c.nodeCount, 0);
    const totalGpus = clusters.reduce((s, c) => s + c.totalGpus, 0);
    const available = clusters.reduce((s, c) => s + c.availableGpus, 0);
    const reserved = clusters.reduce((s, c) => s + c.reservedGpus, 0);
    const maintenance = clusters.filter((c) => c.status === 'Maintenance').reduce((s, c) => s + c.nodeCount, 0);
    return { totalClusters, totalNodes, totalGpus, available, reserved, maintenance };
  }, [clusters]);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = 'Cluster name is required';
    if (!form.environment) e.environment = 'Environment is required';
    if (!form.owner) e.owner = 'Owner is required';
    if (!form.gpuType) e.gpuType = 'GPU type is required';
    if (!form.totalGpus || Number(form.totalGpus) <= 0) e.totalGpus = 'Enter a valid GPU count';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const newCluster = await createCluster({
        name: form.name,
        environment: form.environment,
        owner: form.owner,
        gpuType: form.gpuType,
        totalGpus: Number(form.totalGpus),
        reservedGpus: Number(form.reservedGpus) || 0,
        driverVersion: form.driverVersion,
        runtimeProfile: form.runtimeProfile || 'Training Standard',
      });
      setClusters((prev) => [...prev, newCluster]);
      setShowRegister(false);
      setForm({ name: '', environment: '', owner: '', tenancy: '', gpuType: '', totalGpus: '', reservedGpus: '', maintenanceState: 'Operational', driverVersion: '535.129.03', runtimeProfile: '' });
      toast('Cluster registered successfully.', 'success');
    } catch {
      toast('Failed to register cluster. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Cluster>[] = [
    {
      key: 'name',
      header: 'Cluster Name',
      sortable: true,
      sortValue: (c) => c.name,
      render: (c) => (
        <div>
          <p className="font-medium text-ink-100">{c.name}</p>
          <p className="text-xs text-ink-400">{c.location}</p>
        </div>
      ),
    },
    { key: 'environment', header: 'Environment', sortable: true, sortValue: (c) => c.environment },
    { key: 'gpuType', header: 'GPU Type', sortable: true, sortValue: (c) => c.gpuType },
    { key: 'totalGpus', header: 'Total GPUs', sortable: true, sortValue: (c) => c.totalGpus, render: (c) => <span className="tabular-nums">{c.totalGpus}</span> },
    { key: 'allocatedGpus', header: 'Allocated', sortable: true, sortValue: (c) => c.allocatedGpus, render: (c) => <span className="tabular-nums">{c.allocatedGpus}</span> },
    { key: 'availableGpus', header: 'Available', sortable: true, sortValue: (c) => c.availableGpus, render: (c) => <span className="tabular-nums text-green-400">{c.availableGpus}</span> },
    {
      key: 'utilization',
      header: 'Utilization',
      sortable: true,
      sortValue: (c) => c.utilization,
      render: (c) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-axis-600 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${c.utilization > 80 ? 'bg-accent-600' : c.utilization > 60 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${c.utilization}%` }} />
          </div>
          <span className="text-xs tabular-nums text-ink-300">{c.utilization}%</span>
        </div>
      ),
    },
    { key: 'owner', header: 'Owner', sortable: true, sortValue: (c) => c.owner },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} size="sm" /> },
  ];

  if (loading) return <LoadingState message="Loading capacity registry..." />;

  return (
    <div>
      <PageHeader
        title="Capacity Registry"
        subtitle="Manage clusters, nodes, accelerator inventory and available compute capacity."
        actions={
          <>
            <button onClick={() => toast('Exporting capacity records...', 'info')} className="btn-secondary">
              <Download className="w-4 h-4" />
              Export Records
            </button>
            <button onClick={() => setShowRegister(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              Register Cluster
            </button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard icon={Server} label="Total Clusters" value={summary.totalClusters} accent />
        <StatCard icon={HardDrive} label="Total Nodes" value={summary.totalNodes} />
        <StatCard icon={Cpu} label="Total Accelerators" value={summary.totalGpus.toLocaleString()} />
        <StatCard icon={Activity} label="Available Capacity" value={summary.available} sublabel="GPUs available" />
        <StatCard icon={Server} label="Reserved Capacity" value={summary.reserved} sublabel="GPUs reserved" />
        <StatCard icon={Wrench} label="Maintenance Nodes" value={summary.maintenance} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-thin">
        {['All', 'Operational', 'Warning', 'Maintenance', 'Decommissioned'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-accent-600/15 text-accent-500 border border-accent-600/30' : 'text-ink-300 hover:text-ink-100 hover:bg-axis-800 border border-transparent'
            }`}
          >
            {tab}
            {tab !== 'All' && (
              <span className="ml-1.5 text-xs text-ink-400">
                {clusters.filter((c) => c.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by cluster, node, GPU type or owner" />
        <FilterDropdown label="GPU Type" value={gpuFilter} onChange={setGpuFilter} options={gpuTypes} />
        <FilterDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={statusFilters} />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(c) => c.id}
        onRowClick={(c) => {
          setSelectedCluster(c);
          setShowDrawer(true);
        }}
        actions={(c) => (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActionMenu(actionMenu === c.id ? null : c.id);
              }}
              className="p-1.5 rounded-lg text-ink-400 hover:text-ink-100 hover:bg-axis-700"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {actionMenu === c.id && (
              <>
                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActionMenu(null); }} />
                <div className="absolute right-0 top-8 z-20 w-44 bg-axis-850 border border-axis-600 rounded-lg shadow-xl py-1">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedCluster(c); setShowDrawer(true); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-axis-800">
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toast('Edit cluster form would open here.', 'info'); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-axis-800">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toast('Status update dialog would open here.', 'info'); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-axis-800">
                    <RefreshCw className="w-4 h-4" /> Update Status
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedCluster(c); setShowDrawer(true); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-axis-800">
                    <Activity className="w-4 h-4" /> View Nodes
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      />

      {/* Register Cluster Modal */}
      <Modal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        title="Register Cluster"
        subtitle="Add a new cluster to your capacity registry."
        size="lg"
        footer={
          <>
            <button onClick={() => setShowRegister(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleRegister} disabled={submitting} className="btn-primary">
              {submitting ? 'Registering...' : 'Register Cluster'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Cluster Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Cluster Omega" className={`input-field ${formErrors.name ? 'border-red-500/50' : ''}`} />
            {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Environment</label>
            <select value={form.environment} onChange={(e) => setForm({ ...form, environment: e.target.value })}
              className={`input-field cursor-pointer ${formErrors.environment ? 'border-red-500/50' : ''}`}>
              <option value="">Select environment</option>
              {environments.map((env) => <option key={env} value={env}>{env}</option>)}
            </select>
            {formErrors.environment && <p className="text-xs text-red-400 mt-1">{formErrors.environment}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Owner / Team</label>
            <input type="text" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}
              placeholder="ML Platform" className={`input-field ${formErrors.owner ? 'border-red-500/50' : ''}`} />
            {formErrors.owner && <p className="text-xs text-red-400 mt-1">{formErrors.owner}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Tenancy</label>
            <select value={form.tenancy} onChange={(e) => setForm({ ...form, tenancy: e.target.value })} className="input-field cursor-pointer">
              <option value="">Select tenancy</option>
              {tenancies.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">GPU Type</label>
            <select value={form.gpuType} onChange={(e) => setForm({ ...form, gpuType: e.target.value })}
              className={`input-field cursor-pointer ${formErrors.gpuType ? 'border-red-500/50' : ''}`}>
              <option value="">Select GPU type</option>
              {gpuTypes.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
            {formErrors.gpuType && <p className="text-xs text-red-400 mt-1">{formErrors.gpuType}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Total GPU Count</label>
            <input type="number" value={form.totalGpus} onChange={(e) => setForm({ ...form, totalGpus: e.target.value })}
              placeholder="128" className={`input-field ${formErrors.totalGpus ? 'border-red-500/50' : ''}`} />
            {formErrors.totalGpus && <p className="text-xs text-red-400 mt-1">{formErrors.totalGpus}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Reserved Capacity</label>
            <input type="number" value={form.reservedGpus} onChange={(e) => setForm({ ...form, reservedGpus: e.target.value })}
              placeholder="16" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Maintenance State</label>
            <select value={form.maintenanceState} onChange={(e) => setForm({ ...form, maintenanceState: e.target.value })} className="input-field cursor-pointer">
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Warning">Warning</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Driver Version</label>
            <input type="text" value={form.driverVersion} onChange={(e) => setForm({ ...form, driverVersion: e.target.value })}
              placeholder="535.129.03" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Runtime Profile</label>
            <select value={form.runtimeProfile} onChange={(e) => setForm({ ...form, runtimeProfile: e.target.value })} className="input-field cursor-pointer">
              <option value="">Select profile</option>
              {runtimeProfiles.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Cluster Detail Drawer */}
      <Drawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title={selectedCluster?.name || 'Cluster Details'}
        width="max-w-xl"
      >
        {selectedCluster && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <StatusBadge status={selectedCluster.status} />
              <span className="text-xs text-ink-400">Last updated: {new Date(selectedCluster.lastUpdated).toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-xs text-ink-400">Environment</p>
                <p className="text-sm font-medium text-ink-100 mt-1">{selectedCluster.environment}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-ink-400">Location</p>
                <p className="text-sm font-medium text-ink-100 mt-1">{selectedCluster.location}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-ink-400">GPU Type</p>
                <p className="text-sm font-medium text-ink-100 mt-1">{selectedCluster.gpuType}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-ink-400">Owner</p>
                <p className="text-sm font-medium text-ink-100 mt-1">{selectedCluster.owner}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-ink-100 mb-3">Capacity Allocation</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="card p-3 text-center">
                  <p className="text-lg font-bold text-ink-100 tabular-nums">{selectedCluster.totalGpus}</p>
                  <p className="text-xs text-ink-400">Total GPUs</p>
                </div>
                <div className="card p-3 text-center">
                  <p className="text-lg font-bold text-accent-500 tabular-nums">{selectedCluster.allocatedGpus}</p>
                  <p className="text-xs text-ink-400">Allocated</p>
                </div>
                <div className="card p-3 text-center">
                  <p className="text-lg font-bold text-green-400 tabular-nums">{selectedCluster.availableGpus}</p>
                  <p className="text-xs text-ink-400">Available</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-ink-100 mb-3">Runtime Information</h4>
              <div className="card p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Driver Version</span>
                  <span className="text-ink-100 font-mono">{selectedCluster.driverVersion}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Runtime Profile</span>
                  <span className="text-ink-100">{selectedCluster.runtimeProfile}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Node Count</span>
                  <span className="text-ink-100 tabular-nums">{selectedCluster.nodeCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Utilization</span>
                  <span className="text-ink-100 tabular-nums">{selectedCluster.utilization}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-ink-100 mb-3">Maintenance History</h4>
              <div className="card p-4">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="flex-1">
                    <p className="text-sm text-ink-100">Driver upgrade completed</p>
                    <p className="text-xs text-ink-400">Sep 12, 2026 · 02:15 UTC</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-t border-axis-700/50">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="flex-1">
                    <p className="text-sm text-ink-100">Node health check</p>
                    <p className="text-xs text-ink-400">Sep 08, 2026 · 14:30 UTC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
