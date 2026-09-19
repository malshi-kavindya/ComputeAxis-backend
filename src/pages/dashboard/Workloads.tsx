import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Clock, Pause, AlertCircle, CheckCircle2, Timer,
  Plus, MoreHorizontal, Eye, Play, Square, ArrowUpDown,
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable, { type Column } from '@/components/dashboard/DataTable';
import PageHeader, { SearchBar, FilterDropdown } from '@/components/dashboard/PageHeader';
import Modal from '@/components/dashboard/Modal';
import Drawer from '@/components/dashboard/Drawer';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import LoadingState from '@/components/dashboard/LoadingState';
import { useToast } from '@/context/ToastContext';
import { getWorkloads, createWorkload, updateWorkloadStatus } from '@/api/apiClient';
import type { Workload } from '@/data/mockData';

const tabs = ['All Workloads', 'Running', 'Queued', 'Paused', 'Completed', 'Failed', 'Cancelled'];

const workloadTypes = [
  { value: 'Training', label: 'Training' },
  { value: 'Inference', label: 'Inference' },
  { value: 'Batch', label: 'Batch' },
  { value: 'Research', label: 'Research' },
  { value: 'Simulation', label: 'Simulation' },
];

const priorities = ['Critical', 'High', 'Medium', 'Low'];
const queues = ['Priority', 'Standard'];
const runtimeProfiles = ['Training Standard', 'Inference Optimized', 'Research Experimental', 'Batch Processing', 'Simulation Standard'];
const gpuTypes = ['NVIDIA H100', 'NVIDIA A100', 'NVIDIA L40S', 'NVIDIA A10', 'NVIDIA V100'];

export default function Workloads() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [activeTab, setActiveTab] = useState('All Workloads');
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedWl, setSelectedWl] = useState<Workload | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState<{ action: string; wl: Workload } | null>(null);

  const [form, setForm] = useState({
    name: '', type: '', owner: '', project: '', gpuType: '', gpuQuantity: '',
    cpuRequirement: '', memoryRequirement: '', priority: 'Medium', queue: 'Standard',
    runtimeProfile: '', expectedDuration: '', description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const data = await getWorkloads();
      setWorkloads(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return workloads.filter((w) => {
      const tabStatus = activeTab === 'All Workloads' ? null : activeTab;
      if (tabStatus && w.status !== tabStatus) return false;
      if (priorityFilter && w.priority !== priorityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return w.name.toLowerCase().includes(q) || w.owner.toLowerCase().includes(q) || w.project.toLowerCase().includes(q);
      }
      return true;
    });
  }, [workloads, activeTab, priorityFilter, search]);

  const summary = useMemo(() => {
    return {
      running: workloads.filter((w) => w.status === 'Running').length,
      queued: workloads.filter((w) => w.status === 'Queued').length,
      paused: workloads.filter((w) => w.status === 'Paused').length,
      failed: workloads.filter((w) => w.status === 'Failed').length,
      completedToday: workloads.filter((w) => w.status === 'Completed').length,
      avgQueueTime: '08m 42s',
    };
  }, [workloads]);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = 'Workload name is required';
    if (!form.type) e.type = 'Workload type is required';
    if (!form.owner) e.owner = 'Owner is required';
    if (!form.project) e.project = 'Project is required';
    if (!form.gpuType) e.gpuType = 'GPU type is required';
    if (!form.gpuQuantity || Number(form.gpuQuantity) <= 0) e.gpuQuantity = 'Enter a valid GPU quantity';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const newWl = await createWorkload({
        name: form.name,
        type: form.type as Workload['type'],
        owner: form.owner,
        project: form.project,
        priority: form.priority as Workload['priority'],
        gpuRequest: Number(form.gpuQuantity),
        gpuType: form.gpuType,
        cpuRequest: Number(form.cpuRequirement) || 32,
        memoryRequest: Number(form.memoryRequirement) || 256,
        queue: form.queue as Workload['queue'],
        runtimeProfile: form.runtimeProfile || 'Training Standard',
        expectedDuration: form.expectedDuration || '04h 00m',
        description: form.description,
      });
      setWorkloads((prev) => [newWl, ...prev]);
      setShowSubmit(false);
      setForm({ name: '', type: '', owner: '', project: '', gpuType: '', gpuQuantity: '', cpuRequirement: '', memoryRequirement: '', priority: 'Medium', queue: 'Standard', runtimeProfile: '', expectedDuration: '', description: '' });
      toast('Workload submitted successfully.', 'success');
    } catch {
      toast('Failed to submit workload. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (action: string, wl: Workload) => {
    let newStatus: Workload['status'] = wl.status;
    if (action === 'pause') newStatus = 'Paused';
    else if (action === 'resume') newStatus = 'Running';
    else if (action === 'cancel') newStatus = 'Cancelled';

    try {
      await updateWorkloadStatus(wl.id, newStatus);
      setWorkloads((prev) => prev.map((w) => (w.id === wl.id ? { ...w, status: newStatus } : w)));
      toast(`Workload ${action === 'pause' ? 'paused' : action === 'resume' ? 'resumed' : 'cancelled'} successfully.`, 'success');
    } catch {
      toast(`Failed to ${action} workload.`, 'error');
    }
  };

  const columns: Column<Workload>[] = [
    {
      key: 'name',
      header: 'Workload',
      sortable: true,
      sortValue: (w) => w.name,
      render: (w) => (
        <div>
          <p className="font-medium text-ink-100">{w.name}</p>
          <p className="text-xs text-ink-400">{w.type}</p>
        </div>
      ),
    },
    { key: 'owner', header: 'Owner', sortable: true, sortValue: (w) => w.owner },
    { key: 'project', header: 'Project', sortable: true, sortValue: (w) => w.project },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      sortValue: (w) => w.priority,
      render: (w) => (
        <span className={`text-xs font-medium ${w.priority === 'Critical' ? 'text-red-400' : w.priority === 'High' ? 'text-accent-500' : w.priority === 'Medium' ? 'text-blue-400' : 'text-ink-400'}`}>
          {w.priority}
        </span>
      ),
    },
    { key: 'gpuRequest', header: 'GPU Request', sortable: true, sortValue: (w) => w.gpuRequest, render: (w) => <span className="tabular-nums">{w.gpuRequest} GPUs</span> },
    { key: 'queue', header: 'Queue', sortable: true, sortValue: (w) => w.queue, render: (w) => <span className="text-xs text-ink-300">{w.queue}</span> },
    { key: 'runtime', header: 'Runtime', render: (w) => <span className="text-xs text-ink-300 font-mono">{w.runtime}</span> },
    { key: 'status', header: 'Status', render: (w) => <StatusBadge status={w.status} size="sm" /> },
  ];

  if (loading) return <LoadingState message="Loading workload records..." />;

  return (
    <div>
      <PageHeader
        title="Workload Orchestration"
        subtitle="Manage workload submissions, queue priorities, allocation requirements and runtime state."
        actions={
          <>
            <button onClick={() => toast('Queue policies dialog would open here.', 'info')} className="btn-secondary">
              <ArrowUpDown className="w-4 h-4" />
              Queue Policies
            </button>
            <button onClick={() => setShowSubmit(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              Submit Workload
            </button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard icon={Activity} label="Running" value={summary.running} accent />
        <StatCard icon={Clock} label="Queued" value={summary.queued} />
        <StatCard icon={Pause} label="Paused" value={summary.paused} />
        <StatCard icon={AlertCircle} label="Failed" value={String(summary.failed).padStart(2, '0')} />
        <StatCard icon={CheckCircle2} label="Completed Today" value={summary.completedToday} />
        <StatCard icon={Timer} label="Avg Queue Time" value={summary.avgQueueTime} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-accent-600/15 text-accent-500 border border-accent-600/30' : 'text-ink-300 hover:text-ink-100 hover:bg-axis-800 border border-transparent'
            }`}
          >
            {tab}
            {tab !== 'All Workloads' && (
              <span className="ml-1.5 text-xs text-ink-400">{workloads.filter((w) => w.status === tab).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by workload, owner or project" />
        <FilterDropdown label="Priority" value={priorityFilter} onChange={setPriorityFilter} options={priorities.map((p) => ({ value: p, label: p }))} />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(w) => w.id}
        onRowClick={(w) => { setSelectedWl(w); setShowDrawer(true); }}
        actions={(w) => (
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setActionMenu(actionMenu === w.id ? null : w.id); }}
              className="p-1.5 rounded-lg text-ink-400 hover:text-ink-100 hover:bg-axis-700"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {actionMenu === w.id && (
              <>
                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActionMenu(null); }} />
                <div className="absolute right-0 top-8 z-20 w-44 bg-axis-850 border border-axis-600 rounded-lg shadow-xl py-1">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedWl(w); setShowDrawer(true); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-axis-800">
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  {w.status === 'Running' && (
                    <button onClick={(e) => { e.stopPropagation(); setConfirm({ action: 'pause', wl: w }); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-axis-800">
                      <Pause className="w-4 h-4" /> Pause
                    </button>
                  )}
                  {w.status === 'Paused' && (
                    <button onClick={(e) => { e.stopPropagation(); setConfirm({ action: 'resume', wl: w }); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-axis-800">
                      <Play className="w-4 h-4" /> Resume
                    </button>
                  )}
                  {(w.status === 'Running' || w.status === 'Queued' || w.status === 'Paused') && (
                    <button onClick={(e) => { e.stopPropagation(); setConfirm({ action: 'cancel', wl: w }); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                      <Square className="w-4 h-4" /> Cancel
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      />

      {/* Submit Workload Modal */}
      <Modal
        isOpen={showSubmit}
        onClose={() => setShowSubmit(false)}
        title="Submit Workload"
        subtitle="Configure resource requirements and queue assignment."
        size="xl"
        footer={
          <>
            <button onClick={() => setShowSubmit(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Workload'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Workload Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Model Training X" className={`input-field ${formErrors.name ? 'border-red-500/50' : ''}`} />
            {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Workload Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={`input-field cursor-pointer ${formErrors.type ? 'border-red-500/50' : ''}`}>
              <option value="">Select type</option>
              {workloadTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            {formErrors.type && <p className="text-xs text-red-400 mt-1">{formErrors.type}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Owner / Team</label>
            <input type="text" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}
              placeholder="ML Platform" className={`input-field ${formErrors.owner ? 'border-red-500/50' : ''}`} />
            {formErrors.owner && <p className="text-xs text-red-400 mt-1">{formErrors.owner}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Project</label>
            <input type="text" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}
              placeholder="Vision Project" className={`input-field ${formErrors.project ? 'border-red-500/50' : ''}`} />
            {formErrors.project && <p className="text-xs text-red-400 mt-1">{formErrors.project}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">GPU Type</label>
            <select value={form.gpuType} onChange={(e) => setForm({ ...form, gpuType: e.target.value })}
              className={`input-field cursor-pointer ${formErrors.gpuType ? 'border-red-500/50' : ''}`}>
              <option value="">Select GPU type</option>
              {gpuTypes.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {formErrors.gpuType && <p className="text-xs text-red-400 mt-1">{formErrors.gpuType}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">GPU Quantity</label>
            <input type="number" value={form.gpuQuantity} onChange={(e) => setForm({ ...form, gpuQuantity: e.target.value })}
              placeholder="32" className={`input-field ${formErrors.gpuQuantity ? 'border-red-500/50' : ''}`} />
            {formErrors.gpuQuantity && <p className="text-xs text-red-400 mt-1">{formErrors.gpuQuantity}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">CPU Requirement</label>
            <input type="number" value={form.cpuRequirement} onChange={(e) => setForm({ ...form, cpuRequirement: e.target.value })}
              placeholder="128" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Memory Requirement (GB)</label>
            <input type="number" value={form.memoryRequirement} onChange={(e) => setForm({ ...form, memoryRequirement: e.target.value })}
              placeholder="1024" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field cursor-pointer">
              {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Queue</label>
            <select value={form.queue} onChange={(e) => setForm({ ...form, queue: e.target.value })} className="input-field cursor-pointer">
              {queues.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Runtime Profile</label>
            <select value={form.runtimeProfile} onChange={(e) => setForm({ ...form, runtimeProfile: e.target.value })} className="input-field cursor-pointer">
              <option value="">Select profile</option>
              {runtimeProfiles.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Expected Duration</label>
            <input type="text" value={form.expectedDuration} onChange={(e) => setForm({ ...form, expectedDuration: e.target.value })}
              placeholder="08h 00m" className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the workload..." rows={2} className="input-field resize-none" />
          </div>
        </div>
      </Modal>

      {/* Workload Detail Drawer */}
      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} title={selectedWl?.name || 'Workload Details'} width="max-w-xl">
        {selectedWl && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <StatusBadge status={selectedWl.status} />
              <span className="text-xs text-ink-400">Created: {new Date(selectedWl.createdAt).toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-xs text-ink-400">Type</p>
                <p className="text-sm font-medium text-ink-100 mt-1">{selectedWl.type}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-ink-400">Priority</p>
                <p className="text-sm font-medium text-ink-100 mt-1">{selectedWl.priority}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-ink-400">Owner</p>
                <p className="text-sm font-medium text-ink-100 mt-1">{selectedWl.owner}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-ink-400">Project</p>
                <p className="text-sm font-medium text-ink-100 mt-1">{selectedWl.project}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-ink-100 mb-3">Resource Requirements</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="card p-3 text-center">
                  <p className="text-lg font-bold text-accent-500 tabular-nums">{selectedWl.gpuRequest}</p>
                  <p className="text-xs text-ink-400">GPUs</p>
                </div>
                <div className="card p-3 text-center">
                  <p className="text-lg font-bold text-ink-100 tabular-nums">{selectedWl.cpuRequest}</p>
                  <p className="text-xs text-ink-400">CPUs</p>
                </div>
                <div className="card p-3 text-center">
                  <p className="text-lg font-bold text-ink-100 tabular-nums">{selectedWl.memoryRequest}</p>
                  <p className="text-xs text-ink-400">GB Memory</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-ink-100 mb-3">Runtime Information</h4>
              <div className="card p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">GPU Type</span>
                  <span className="text-ink-100">{selectedWl.gpuType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Runtime Profile</span>
                  <span className="text-ink-100">{selectedWl.runtimeProfile}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Queue</span>
                  <span className="text-ink-100">{selectedWl.queue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Runtime</span>
                  <span className="text-ink-100 font-mono">{selectedWl.runtime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Expected Duration</span>
                  <span className="text-ink-100">{selectedWl.expectedDuration}</span>
                </div>
              </div>
            </div>

            {selectedWl.description && (
              <div>
                <h4 className="text-sm font-semibold text-ink-100 mb-2">Description</h4>
                <p className="text-sm text-ink-300">{selectedWl.description}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && handleAction(confirm.action, confirm.wl)}
        title={`${confirm?.action === 'pause' ? 'Pause' : confirm?.action === 'resume' ? 'Resume' : 'Cancel'} Workload`}
        message={`Are you sure you want to ${confirm?.action} "${confirm?.wl.name}"? This action will update the workload status.`}
        confirmLabel={confirm?.action === 'pause' ? 'Pause' : confirm?.action === 'resume' ? 'Resume' : 'Cancel Workload'}
        variant={confirm?.action === 'cancel' ? 'danger' : 'warning'}
      />
    </div>
  );
}
