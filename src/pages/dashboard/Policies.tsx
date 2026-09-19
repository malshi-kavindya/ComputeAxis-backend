import { useState, useEffect } from 'react';
import {
  Shield, Cpu, Clock, CheckCircle2, AlertTriangle, Edit, Eye,
  Check, X, FileText, Plus,
} from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable, { type Column } from '@/components/dashboard/DataTable';
import PageHeader from '@/components/dashboard/PageHeader';
import Modal from '@/components/dashboard/Modal';
import LoadingState from '@/components/dashboard/LoadingState';
import { useToast } from '@/context/ToastContext';
import {
  getEntitlements, getRuntimeProfiles, getPolicies, getChangeReviews, reviewChangeReview,
} from '@/api/apiClient';
import type { Entitlement, RuntimeProfile, SchedulingPolicy, ChangeReview } from '@/data/mockData';

const tabs = ['Entitlements', 'Runtime Profiles', 'Scheduling Policies', 'Change Reviews', 'Exceptions'];

export default function Policies() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Entitlements');
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [runtimeProfiles, setRuntimeProfiles] = useState<RuntimeProfile[]>([]);
  const [policies, setPolicies] = useState<SchedulingPolicy[]>([]);
  const [changeReviews, setChangeReviews] = useState<ChangeReview[]>([]);
  const [reviewModal, setReviewModal] = useState<ChangeReview | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    (async () => {
      const [ent, rp, pol, cr] = await Promise.all([
        getEntitlements(), getRuntimeProfiles(), getPolicies(), getChangeReviews(),
      ]);
      setEntitlements(ent);
      setRuntimeProfiles(rp);
      setPolicies(pol);
      setChangeReviews(cr);
      setLoading(false);
    })();
  }, []);

  const handleReview = async (status: ChangeReview['status']) => {
    if (!reviewModal) return;
    setReviewing(true);
    try {
      const updated = await reviewChangeReview(reviewModal.id, status, reviewComment);
      setChangeReviews((prev) => prev.map((r) => (r.id === reviewModal.id ? updated : r)));
      toast(`Change review ${status.toLowerCase()}.`, 'success');
      setReviewModal(null);
      setReviewComment('');
    } catch {
      toast('Failed to submit review.', 'error');
    } finally {
      setReviewing(false);
    }
  };

  const entitlementColumns: Column<Entitlement>[] = [
    { key: 'team', header: 'Team', sortable: true, sortValue: (e) => e.team, render: (e) => <span className="font-medium text-ink-100">{e.team}</span> },
    { key: 'project', header: 'Project', sortable: true, sortValue: (e) => e.project },
    { key: 'gpuQuota', header: 'GPU Quota', sortable: true, sortValue: (e) => e.gpuQuota, render: (e) => <span className="tabular-nums">{e.gpuQuota} GPUs</span> },
    { key: 'used', header: 'Used', sortable: true, sortValue: (e) => e.used, render: (e) => <span className="tabular-nums">{e.used}</span> },
    { key: 'remaining', header: 'Remaining', sortable: true, sortValue: (e) => e.remaining, render: (e) => <span className="tabular-nums text-green-400">{e.remaining}</span> },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      sortValue: (e) => e.priority,
      render: (e) => (
        <span className={`text-xs font-medium ${e.priority === 'High' ? 'text-accent-500' : e.priority === 'Medium' ? 'text-blue-400' : 'text-ink-400'}`}>{e.priority}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (e) => <StatusBadge status={e.status} size="sm" /> },
  ];

  const reviewColumns: Column<ChangeReview>[] = [
    { key: 'request', header: 'Request', sortable: true, sortValue: (r) => r.request, render: (r) => <span className="font-medium text-ink-100">{r.request}</span> },
    { key: 'requestedBy', header: 'Requested By', sortable: true, sortValue: (r) => r.requestedBy },
    { key: 'type', header: 'Type', sortable: true, sortValue: (r) => r.type },
    { key: 'affectedResource', header: 'Affected Resource', sortable: true, sortValue: (r) => r.affectedResource },
    { key: 'submitted', header: 'Submitted', sortable: true, sortValue: (r) => r.submitted },
    { key: 'reviewer', header: 'Reviewer', sortable: true, sortValue: (r) => r.reviewer },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} size="sm" /> },
  ];

  if (loading) return <LoadingState message="Loading policy records..." />;

  return (
    <div>
      <PageHeader
        title="Policy & Governance"
        subtitle="Manage entitlements, runtime profiles, scheduling rules and operational change controls."
        actions={
          <button onClick={() => toast('New change review form would open here.', 'info')} className="btn-primary">
            <Plus className="w-4 h-4" />
            Submit Change Review
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-accent-600/15 text-accent-500 border border-accent-600/30' : 'text-ink-300 hover:text-ink-100 hover:bg-axis-800 border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Entitlements Tab */}
      {activeTab === 'Entitlements' && (
        <DataTable
          columns={entitlementColumns}
          data={entitlements}
          rowKey={(e) => e.id}
          actions={(e) => (
            <button onClick={() => toast(`Edit entitlement for ${e.team}.`, 'info')} className="p-1.5 rounded-lg text-ink-400 hover:text-ink-100 hover:bg-axis-700">
              <Edit className="w-4 h-4" />
            </button>
          )}
        />
      )}

      {/* Runtime Profiles Tab */}
      {activeTab === 'Runtime Profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {runtimeProfiles.map((rp) => (
            <div key={rp.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-axis-700 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-accent-500" />
                </div>
                <StatusBadge status={rp.status} size="sm" />
              </div>
              <h4 className="text-sm font-semibold text-ink-100">{rp.name}</h4>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-400">Framework</span>
                  <span className="text-ink-200">{rp.framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">CUDA Version</span>
                  <span className="text-ink-200 font-mono">{rp.cudaVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Container</span>
                  <span className="text-ink-200">{rp.container}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Approved For</span>
                  <span className="text-ink-200">{rp.approvedFor}</span>
                </div>
              </div>
              <button onClick={() => toast(`Edit runtime profile "${rp.name}".`, 'info')} className="btn-ghost mt-4 w-full">
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Scheduling Policies Tab */}
      {activeTab === 'Scheduling Policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((p) => (
            <div key={p.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-600/15 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink-100">{p.name}</h4>
                    <p className="text-xs text-ink-400">Scope: {p.scope}</p>
                  </div>
                </div>
                <StatusBadge status={p.status} size="sm" />
              </div>
              <p className="text-sm text-ink-300 mt-2">{p.description}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-axis-700">
                <p className="text-xs text-ink-500">Last updated: {new Date(p.lastUpdated).toLocaleDateString()}</p>
                <button onClick={() => toast(`Edit policy "${p.name}".`, 'info')} className="btn-ghost">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Change Reviews Tab */}
      {activeTab === 'Change Reviews' && (
        <DataTable
          columns={reviewColumns}
          data={changeReviews}
          rowKey={(r) => r.id}
          actions={(r) => (
            <button
              onClick={() => { setReviewModal(r); setReviewComment(''); }}
              className="p-1.5 rounded-lg text-ink-400 hover:text-ink-100 hover:bg-axis-700"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        />
      )}

      {/* Exceptions Tab */}
      {activeTab === 'Exceptions' && (
        <div className="card p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-ink-500 mx-auto mb-3" />
          <p className="text-sm text-ink-300 font-medium">No active exceptions</p>
          <p className="text-xs text-ink-400 mt-1">Policy exceptions will appear here when requested.</p>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewModal}
        onClose={() => setReviewModal(null)}
        title="Review Change Request"
        subtitle={reviewModal?.request}
        footer={
          <>
            <button onClick={() => handleReview('Rejected')} disabled={reviewing} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50">
              <X className="w-4 h-4" /> Reject
            </button>
            <button onClick={() => handleReview('Needs Review')} disabled={reviewing} className="btn-secondary">
              <AlertTriangle className="w-4 h-4" /> Request Changes
            </button>
            <button onClick={() => handleReview('Approved')} disabled={reviewing} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50">
              <Check className="w-4 h-4" /> Approve
            </button>
          </>
        }
      >
        {reviewModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-3">
                <p className="text-xs text-ink-400">Requested By</p>
                <p className="text-sm text-ink-100 mt-1">{reviewModal.requestedBy}</p>
              </div>
              <div className="card p-3">
                <p className="text-xs text-ink-400">Type</p>
                <p className="text-sm text-ink-100 mt-1">{reviewModal.type}</p>
              </div>
              <div className="card p-3">
                <p className="text-xs text-ink-400">Affected Resource</p>
                <p className="text-sm text-ink-100 mt-1">{reviewModal.affectedResource}</p>
              </div>
              <div className="card p-3">
                <p className="text-xs text-ink-400">Reviewer</p>
                <p className="text-sm text-ink-100 mt-1">{reviewModal.reviewer}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-200 mb-1.5">Reviewer Comment</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Add a comment for this review decision..."
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
