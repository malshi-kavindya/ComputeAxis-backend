import { useState, useEffect } from 'react';
import { Mail, Building2, Briefcase, Calendar, Edit, Save, Activity } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import Modal from '@/components/dashboard/Modal';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getActivityLogs } from '@/api/apiClient';
import type { ActivityLog } from '@/data/mockData';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [form, setForm] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@computeaxis.net',
    company: user?.company || 'ComputeAxis',
    role: user?.role || 'Infrastructure Operator',
  });

  useEffect(() => {
    (async () => {
      const logs = await getActivityLogs();
      setRecentActivity(logs.filter((l) => l.user === (user?.name || 'Alex Morgan')).slice(0, 5));
    })();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateUser(form);
    setSaving(false);
    setShowEdit(false);
    toast('Profile updated successfully.', 'success');
  };

  const initials = (user?.name || 'Alex Morgan')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="View and manage your account information."
        actions={
          <button onClick={() => { setForm({ name: user?.name || '', email: user?.email || '', company: user?.company || '', role: user?.role || '' }); setShowEdit(true); }} className="btn-primary">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        }
      />

      {/* Profile Header Card */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-accent-600/20 text-accent-500 flex items-center justify-center text-2xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-ink-100">{user?.name || 'Alex Morgan'}</h2>
            <p className="text-sm text-ink-400 mt-0.5">{user?.email || 'alex.morgan@computeaxis.net'}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="badge badge-info"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{user?.role || 'Infrastructure Operator'}</span>
              <span className="text-xs text-ink-400">{user?.company || 'ComputeAxis'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-100 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-axis-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-ink-400" />
              </div>
              <div>
                <p className="text-xs text-ink-400">Email</p>
                <p className="text-sm text-ink-100">{user?.email || 'alex.morgan@computeaxis.net'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-axis-700 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-ink-400" />
              </div>
              <div>
                <p className="text-xs text-ink-400">Organization</p>
                <p className="text-sm text-ink-100">{user?.company || 'ComputeAxis'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-axis-700 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-ink-400" />
              </div>
              <div>
                <p className="text-xs text-ink-400">Role</p>
                <p className="text-sm text-ink-100">{user?.role || 'Infrastructure Operator'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-axis-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-ink-400" />
              </div>
              <div>
                <p className="text-xs text-ink-400">Account Created</p>
                <p className="text-sm text-ink-100">{new Date(user?.createdAt || '2024-03-15').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-accent-500" />
            <h3 className="text-sm font-semibold text-ink-100">Recent Activity</h3>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-ink-400 text-center py-6">No recent activity</p>
          ) : (
            <div className="space-y-1">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-axis-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-100 font-medium truncate">{log.action}</p>
                    <p className="text-xs text-ink-400">{log.resourceType} · {log.resourceName}</p>
                  </div>
                  <StatusBadge status={log.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Profile"
        subtitle="Update your basic profile information."
        footer={
          <>
            <button onClick={() => setShowEdit(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Company / Organization</label>
            <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-1.5">Role</label>
            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
