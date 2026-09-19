interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusMap: Record<string, { class: string; label: string }> = {
  // Operational states
  Operational: { class: 'badge-success', label: 'Operational' },
  Healthy: { class: 'badge-success', label: 'Healthy' },
  Online: { class: 'badge-success', label: 'Online' },
  Active: { class: 'badge-success', label: 'Active' },
  Running: { class: 'badge-success', label: 'Running' },
  Completed: { class: 'badge-success', label: 'Completed' },
  Resolved: { class: 'badge-success', label: 'Resolved' },
  Approved: { class: 'badge-success', label: 'Approved' },
  Addressed: { class: 'badge-success', label: 'Addressed' },

  // Warning states
  Warning: { class: 'badge-warning', label: 'Warning' },
  Degraded: { class: 'badge-warning', label: 'Degraded' },
  Paused: { class: 'badge-warning', label: 'Paused' },
  Reviewing: { class: 'badge-warning', label: 'Reviewing' },
  Acknowledged: { class: 'badge-warning', label: 'Acknowledged' },
  Investigating: { class: 'badge-warning', label: 'Investigating' },
  'Needs Review': { class: 'badge-warning', label: 'Needs Review' },
  'Review Required': { class: 'badge-warning', label: 'Review Required' },
  Open: { class: 'badge-warning', label: 'Open' },
  Limited: { class: 'badge-warning', label: 'Limited' },
  Restricted: { class: 'badge-pending', label: 'Restricted' },

  // Critical states
  Critical: { class: 'badge-critical', label: 'Critical' },
  Failed: { class: 'badge-critical', label: 'Failed' },
  Offline: { class: 'badge-critical', label: 'Offline' },
  Rejected: { class: 'badge-critical', label: 'Rejected' },
  Blocked: { class: 'badge-critical', label: 'Blocked' },

  // Pending/info states
  Pending: { class: 'badge-pending', label: 'Pending' },
  Queued: { class: 'badge-pending', label: 'Queued' },
  'Pending Review': { class: 'badge-pending', label: 'Pending Review' },
  Scheduled: { class: 'badge-info', label: 'Scheduled' },
  Cancelled: { class: 'badge-neutral', label: 'Cancelled' },
  Draft: { class: 'badge-neutral', label: 'Draft' },
  Disabled: { class: 'badge-neutral', label: 'Disabled' },
  Decommissioned: { class: 'badge-neutral', label: 'Decommissioned' },
  Maintenance: { class: 'badge-info', label: 'Maintenance' },
  Recorded: { class: 'badge-neutral', label: 'Recorded' },
  Assigned: { class: 'badge-info', label: 'Assigned' },
  Created: { class: 'badge-info', label: 'Created' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusMap[status] || { class: 'badge-neutral', label: status };
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : '';

  return (
    <span className={`badge ${config.class} ${sizeClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
}
