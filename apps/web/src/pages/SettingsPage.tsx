import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth.store';

const SETTINGS_TABS = ['Profile', 'Organization', 'Notifications', 'API Keys', 'Branding'];

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState('Profile');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display text-white">Settings</h1>
        <p className="text-sm text-pulse-meta mt-1">Manage your account and platform preferences</p>
      </motion.div>

      <div className="cyan-line" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-[rgba(0,212,255,0.1)] text-pulse-cyan border border-[rgba(0,212,255,0.2)]'
                  : 'text-pulse-body hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={activeTab} className="lg:col-span-3 glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {activeTab === 'Profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Profile Settings</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pulse-teal to-pulse-purple flex items-center justify-center text-2xl font-medium text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-sm text-pulse-meta">{user?.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-pulse-meta block mb-1.5">Full Name</label>
                  <input className="input-dark" defaultValue={user?.name} />
                </div>
                <div>
                  <label className="text-xs text-pulse-meta block mb-1.5">Email</label>
                  <input className="input-dark" defaultValue={user?.email} disabled />
                </div>
              </div>

              <div className="border-t border-[rgba(0,212,255,0.1)] pt-6">
                <h4 className="text-sm font-medium text-white mb-4">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-pulse-meta block mb-1.5">Current Password</label>
                    <input type="password" className="input-dark" />
                  </div>
                  <div />
                  <div>
                    <label className="text-xs text-pulse-meta block mb-1.5">New Password</label>
                    <input type="password" className="input-dark" />
                  </div>
                  <div>
                    <label className="text-xs text-pulse-meta block mb-1.5">Confirm Password</label>
                    <input type="password" className="input-dark" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Notification Preferences</h3>
              {[
                { label: 'Wave Published', desc: 'Get notified when a new wave is published' },
                { label: 'Significant Metric Change', desc: 'Alert when a metric shows significant movement' },
                { label: 'Report Ready', desc: 'Notification when a generated report is ready to download' },
                { label: 'Weekly Digest', desc: 'Receive a weekly summary of platform activity' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-[rgba(148,163,184,0.05)]">
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="text-xs text-pulse-meta mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-[rgba(148,163,184,0.2)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pulse-cyan" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'API Keys' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">API Key Management</h3>
              <p className="text-sm text-pulse-meta">Manage API keys for external integrations</p>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Production Key</p>
                    <p className="text-xs text-pulse-meta font-mono mt-1">tp_live_****...****8f2d</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs py-1.5">Reveal</button>
                    <button className="btn-secondary text-xs py-1.5 text-pulse-danger border-[rgba(239,68,68,0.3)]">Revoke</button>
                  </div>
                </div>
              </div>
              <button className="btn-primary text-sm">Generate New Key</button>
            </div>
          )}

          {activeTab === 'Branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Report Branding</h3>
              <p className="text-sm text-pulse-meta">Customize branding for client reports</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-pulse-meta block mb-1.5">Company Logo</label>
                  <div className="input-dark flex items-center justify-center h-24 border-dashed cursor-pointer hover:border-pulse-cyan transition-colors">
                    <span className="text-xs text-pulse-meta">Upload logo (SVG, PNG)</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-pulse-meta block mb-1.5">Primary Brand Color</label>
                  <div className="flex gap-2">
                    <input type="color" defaultValue="#00D4FF" className="w-10 h-10 rounded cursor-pointer bg-transparent border border-pulse-meta" />
                    <input className="input-dark flex-1" defaultValue="#00D4FF" />
                  </div>
                </div>
              </div>
              <button className="btn-primary">Save Branding</button>
            </div>
          )}

          {activeTab === 'Organization' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Organization Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-pulse-meta block mb-1.5">Organization Name</label>
                  <input className="input-dark" defaultValue={user?.organizationName} />
                </div>
                <div>
                  <label className="text-xs text-pulse-meta block mb-1.5">Website</label>
                  <input className="input-dark" defaultValue="trackfieldprojects.com" />
                </div>
              </div>
              <button className="btn-primary">Update Organization</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
