import { useState, useEffect, useMemo } from 'react';
import { History, Search, Filter } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable, { type Column } from '@/components/dashboard/DataTable';
import PageHeader, { SearchBar, FilterDropdown } from '@/components/dashboard/PageHeader';
import Drawer from '@/components/dashboard/Drawer';
import LoadingState from '@/components/dashboard/LoadingState';
import { getActivityLogs } from '@/api/apiClient';
import type { ActivityLog } from '@/data/mockData';

const userOptions = [
  { value: 'Alex Morgan', label: 'Alex Morgan' },
  { value: 'Jordan Lee', label: 'Jordan Lee' },
  { value: 'Sam Patel', label: 'Sam Patel' },
  { value: 'Taylor Quinn', label: 'Taylor Quinn' },
];
const actionOptions = [
  { value: 'Updated allocation', label: 'Updated allocation' },
  { value: 'Changed quota', label: 'Changed quota' },
  { value: 'Updated cluster status', label: 'Updated cluster status' },
  { value: 'Scheduled maintenance', label: 'Scheduled maintenance' },
  { value: 'Adjusted queue priority', label: 'Adjusted queue priority' },
  { value: 'Submitted workload', label: 'Submitted workload' },
  { value: 'Approved change review', label: 'Approved change review' },
  { value: 'Assigned incident owner', label: 'Assigned incident owner' },
  { value: 'Cancelled workload', label: 'Cancelled workload' },
  { value: 'Updated runtime profile', label: 'Updated runtime profile' },
];
const resourceTypeOptions = [
  { value: 'Workload', label: 'Workload' },
  { value: 'Cluster', label: 'Cluster' },
  { value: 'Policy', label: 'Policy' },
  { value: 'Queue', label: 'Queue' },
  { value: 'Change Review', label: 'Change Review' },
  { value: 'Incident', label: 'Incident' },
  { value: 'Runtime Profile', label: 'Runtime Profile' },
];
const statusOptions = [
  { value: 'Completed', label: 'Completed' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Recorded', label: 'Recorded' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Created', label: 'Created' },
  { value: 'Assigned', label: 'Assigned' },
];

export default function Activity() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getActivityLogs();
      setLogs(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (userFilter && l.user !== userFilter) return false;
      if (actionFilter && l.action !== actionFilter) return false;
      if (resourceTypeFilter && l.resourceType !== resourceTypeFilter) return false;
      if (statusFilter && l.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return l.user.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.resourceName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [logs, userFilter, actionFilter, resourceTypeFilter, statusFilter, search]);

  const columns: Column<ActivityLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      sortValue: (l) => l.timestamp,
      render: (l) => <span className="text-xs font-mono text-ink-300">{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>,
    },
    { key: 'user', header: 'User', sortable: true, sortValue: (l) => l.user, render: (l) => <span className="font-medium text-ink-100">{l.user}</span> },
    { key: 'action', header: 'Action', sortable: true, sortValue: (l) => l.action },
    { key: 'resourceType', header: 'Resource Type', sortable: true, sortValue: (l) => l.resourceType, render: (l) => <span className="text-xs text-ink-300">{l.resourceType}</span> },
    { key: 'resourceName', header: 'Resource', sortable: true, sortValue: (l) => l.resourceName, render: (l) => <span className="text-ink-200">{l.resourceName}</span> },
    { key: 'previousState', header: 'Previous State', render: (l) => <span className="text-xs text-ink-400">{l.previousState}</span> },
    { key: 'newState', header: 'New State', render: (l) => <span className="text-xs text-ink-200">{l.newState}</span> },
    { key: 'status', header: 'Status', render: (l) => <StatusBadge status={l.status} size="sm" /> },
  ];

  if (loading) return <LoadingState message="Loading activity records..." />;

  return (
    <div>
      <PageHeader
        title="Activity History"
        subtitle="Review operational changes, record updates and accountable user actions."
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by user, action or resource" />
        <FilterDropdown label="User" value={userFilter} onChange={setUserFilter} options={userOptions} />
        <FilterDropdown label="Action" value={actionFilter} onChange={setActionFilter} options={actionOptions} />
        <FilterDropdown label="Resource Type" value={resourceTypeFilter} onChange={setResourceTypeFilter} options={resourceTypeOptions} />
        <FilterDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(l) => l.id}
        onRowClick={(l) => { setSelectedLog(l); setShowDrawer(true); }}
        emptyMessage="No activity records match your filters."
      />

      {/* Activity Detail Drawer */}
      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} title="Activity Detail">
        {selectedLog && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-axis-700 flex items-center justify-center">
                <History className="w-5 h-5 text-accent-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-100">{selectedLog.action}</p>
                <p className="text-xs text-ink-400">{new Date(selectedLog.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <div className="card p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink-400">User</span>
                <span className="text-ink-100">{selectedLog.user}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-400">Resource Type</span>
                <span className="text-ink-100">{selectedLog.resourceType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-400">Resource</span>
                <span className="text-ink-100">{selectedLog.resourceName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-400">Previous State</span>
                <span className="text-ink-200 font-mono">{selectedLog.previousState}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-400">New State</span>
                <span className="text-ink-100 font-mono">{selectedLog.newState}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-400">Status</span>
                <StatusBadge status={selectedLog.status} size="sm" />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
