import { useState, useEffect } from 'react';
import { User, Building2, Bell, Lock, Globe, Save, LogOut, Monitor } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const tabs = ['Profile', 'Workspace', 'Notifications', 'Security'];

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@computeaxis.net',
    role: user?.role || 'Infrastructure Operator',
    company: user?.company || 'ComputeAxis',
  });
  const [workspace, setWorkspace] = useState({
    name: 'ComputeAxis Production',
    timezone: 'UTC',
    defaultQueue: 'Priority',
  });
  const [notifPrefs, setNotifPrefs] = useState({
    capacityAlerts: true,
    workloadAlerts: true,
    policyReviews: true,
    incidentNotifications: true,
  });
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateUser(profile);
    setSaving(false);
    toast('Profile settings saved.', 'success');
  };

  const handleSaveWorkspace = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast('Workspace settings saved.', 'success');
  };

  const handleSaveNotifs = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast('Notification preferences saved.', 'success');
  };

  const handleChangePassword = async () => {
    if (!security.currentPassword || !security.newPassword) {
      toast('Please fill in all password fields.', 'error');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast('New passwords do not match.', 'error');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast('Password changed successfully.', 'success');
  };

  const timezones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo'];
  const queues = ['Priority', 'Standard', 'Research'];

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, workspace, notification and security preferences." />

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

      {/* Profile Tab */}
      {activeTab === 'Profile' && (
        <div className="card p-6 max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-accent-500" />
            <h3 className="text-base font-semibold text-ink-100">Profile Settings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-200 mb-1.5">Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-200 mb-1.5">Email</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-200 mb-1.5">Role</label>
              <input type="text" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-200 mb-1.5">Company</label>
              <input type="text" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} className="input-field" />
            </div>
          </div>
          <button onClick={handleSaveProfile} disabled={saving} className="btn-primary mt-5">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Workspace Tab */}
      {activeTab === 'Workspace' && (
        <div className="card p-6 max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-5 h-5 text-accent-500" />
            <h3 className="text-base font-semibold text-ink-100">Workspace Settings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-200 mb-1.5">Workspace Name</label>
              <input type="text" value={workspace.name} onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-200 mb-1.5">Default Timezone</label>
              <select value={workspace.timezone} onChange={(e) => setWorkspace({ ...workspace, timezone: e.target.value })} className="input-field cursor-pointer">
                {timezones.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-200 mb-1.5">Default Queue</label>
              <select value={workspace.defaultQueue} onChange={(e) => setWorkspace({ ...workspace, defaultQueue: e.target.value })} className="input-field cursor-pointer">
                {queues.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleSaveWorkspace} disabled={saving} className="btn-primary mt-5">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'Notifications' && (
        <div className="card p-6 max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-accent-500" />
            <h3 className="text-base font-semibold text-ink-100">Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'capacityAlerts', label: 'Capacity Alerts', desc: 'Get notified when cluster capacity thresholds are reached.' },
              { key: 'workloadAlerts', label: 'Workload Alerts', desc: 'Receive alerts for workload state changes and completions.' },
              { key: 'policyReviews', label: 'Policy Reviews', desc: 'Get notified when change reviews need your attention.' },
              { key: 'incidentNotifications', label: 'Incident Notifications', desc: 'Receive alerts when incidents are assigned or updated.' },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between py-3 border-b border-axis-700/50 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-100">{item.label}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={notifPrefs[item.key as keyof typeof notifPrefs]}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-axis-600 rounded-full peer peer-checked:bg-accent-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-ink-200 after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
          <button onClick={handleSaveNotifs} disabled={saving} className="btn-primary mt-5">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'Security' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-5 h-5 text-accent-500" />
              <h3 className="text-base font-semibold text-ink-100">Change Password</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-200 mb-1.5">Current Password</label>
                <input type="password" value={security.currentPassword} onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-200 mb-1.5">New Password</label>
                <input type="password" value={security.newPassword} onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-200 mb-1.5">Confirm New Password</label>
                <input type="password" value={security.confirmPassword} onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })} className="input-field" />
              </div>
            </div>
            <button onClick={handleChangePassword} disabled={saving} className="btn-primary mt-5">
              <Lock className="w-4 h-4" />
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Monitor className="w-5 h-5 text-accent-500" />
              <h3 className="text-base font-semibold text-ink-100">Session Management</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-axis-700/50">
                <div>
                  <p className="text-sm text-ink-100">Current Session</p>
                  <p className="text-xs text-ink-400">This browser · Active now</p>
                </div>
                <span className="badge badge-success"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />Active</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-axis-700/50">
                <div>
                  <p className="text-sm text-ink-100">Mobile App</p>
                  <p className="text-xs text-ink-400">Last active 2 hours ago</p>
                </div>
                <span className="text-xs text-ink-400">Idle</span>
              </div>
            </div>
            <button
              onClick={() => { toast('All other sessions signed out.', 'success'); }}
              className="btn-secondary mt-4"
            >
              <LogOut className="w-4 h-4" />
              Sign Out All Other Sessions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
