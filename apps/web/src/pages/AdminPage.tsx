import { useState } from 'react';
import { motion } from 'framer-motion';

const ADMIN_TABS = ['Clients', 'Brands', 'Users', 'Studies', 'System', 'Audit Log'];

const demoUsers = [
  { id: '1', name: 'Samundombe Ilalio', email: 'sam@trackfield.com', role: 'ADMIN', org: 'TrackField Projects', lastLogin: '2024-06-28 14:30', active: true },
  { id: '2', name: 'Sarah Chen', email: 'analyst@trackfield.com', role: 'ANALYST', org: 'TrackField Projects', lastLogin: '2024-06-27 09:15', active: true },
  { id: '3', name: 'Thabo Nkosi', email: 'tigerbrands@client.za', role: 'CLIENT_VIEWER', org: 'Tiger Brands', lastLogin: '2024-06-25 16:42', active: true },
];

const demoClients = [
  { id: '1', name: 'Tiger Brands', brands: 1, studies: 1, active: true },
];

const auditLog = [
  { id: '1', user: 'Admin User', action: 'Viewed Dashboard', resource: 'Dashboard', time: '14:30:22' },
  { id: '2', user: 'Analyst User', action: 'Generated Report', resource: 'Report Q2-2024', time: '09:15:44' },
  { id: '3', user: 'Admin User', action: 'Updated Wave Status', resource: 'Q2-2024', time: '08:52:11' },
  { id: '4', user: 'Thabo Nkosi', action: 'Downloaded Report', resource: 'Report Q1-2024', time: '16:42:33' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Users');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display text-white">Administration</h1>
        <p className="text-sm text-pulse-meta mt-1">Platform management and system health</p>
      </motion.div>

      <div className="cyan-line" />

      {/* System health cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'API Response', value: '45ms', status: 'healthy' },
          { label: 'DB Connections', value: '12/100', status: 'healthy' },
          { label: 'Active Users', value: '3', status: 'healthy' },
          { label: 'Job Queue', value: '0 pending', status: 'healthy' },
        ].map((item, i) => (
          <motion.div key={item.label} className="glass-card p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-pulse-meta font-mono uppercase">{item.label}</span>
              <div className={`w-2 h-2 rounded-full ${item.status === 'healthy' ? 'bg-pulse-success' : 'bg-pulse-danger'}`} />
            </div>
            <span className="text-lg font-mono text-white">{item.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 glass-card w-fit">
        {ADMIN_TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-xs transition-colors ${activeTab === tab ? 'bg-[rgba(0,212,255,0.1)] text-pulse-cyan border border-[rgba(0,212,255,0.2)]' : 'text-pulse-meta hover:text-pulse-body'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {activeTab === 'Users' && (
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[rgba(0,212,255,0.1)]">
              <h3 className="text-sm font-medium text-white">User Management</h3>
              <button className="btn-primary text-xs py-1.5">Add User</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(148,163,184,0.05)]">
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Name</th>
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Email</th>
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Role</th>
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Organization</th>
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Last Login</th>
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[rgba(148,163,184,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="px-4 py-3 text-sm text-white">{user.name}</td>
                    <td className="px-4 py-3 text-xs text-pulse-body font-mono">{user.email}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(0,212,255,0.1)] text-pulse-cyan font-mono">{user.role}</span></td>
                    <td className="px-4 py-3 text-xs text-pulse-body">{user.org}</td>
                    <td className="px-4 py-3 text-xs text-pulse-meta font-mono">{user.lastLogin}</td>
                    <td className="px-4 py-3"><div className={`w-2 h-2 rounded-full ${user.active ? 'bg-pulse-success' : 'bg-pulse-danger'}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Clients' && (
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[rgba(0,212,255,0.1)]">
              <h3 className="text-sm font-medium text-white">Client Management</h3>
              <button className="btn-primary text-xs py-1.5">Add Client</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(148,163,184,0.05)]">
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Client</th>
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Brands</th>
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Studies</th>
                  <th className="text-left px-4 py-3 text-xs text-pulse-meta font-mono">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoClients.map((c) => (
                  <tr key={c.id} className="border-b border-[rgba(148,163,184,0.03)]">
                    <td className="px-4 py-3 text-sm text-white">{c.name}</td>
                    <td className="px-4 py-3 text-xs font-mono text-pulse-body">{c.brands}</td>
                    <td className="px-4 py-3 text-xs font-mono text-pulse-body">{c.studies}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(34,197,94,0.15)] text-[#22C55E]">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Audit Log' && (
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-[rgba(0,212,255,0.1)]">
              <h3 className="text-sm font-medium text-white">Audit Trail</h3>
            </div>
            <div className="divide-y divide-[rgba(148,163,184,0.05)]">
              {auditLog.map((entry) => (
                <div key={entry.id} className="px-4 py-3 flex items-center gap-4">
                  <span className="text-xs text-pulse-meta font-mono w-16">{entry.time}</span>
                  <span className="text-xs text-pulse-body w-28">{entry.user}</span>
                  <span className="text-xs text-white flex-1">{entry.action}</span>
                  <span className="text-xs text-pulse-meta font-mono">{entry.resource}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!['Users', 'Clients', 'Audit Log'].includes(activeTab) && (
          <div className="glass-card p-12 text-center">
            <p className="text-pulse-meta text-sm">{activeTab} management panel</p>
            <p className="text-pulse-meta text-xs mt-1">Connected to backend API for full CRUD operations</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
