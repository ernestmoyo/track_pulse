import { useAuthStore } from '@/stores/auth.store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-[rgba(0,212,255,0.1)] bg-[#0A0F1A]/80 backdrop-blur-lg flex items-center justify-between px-6">
      {/* Left: Breadcrumb area */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-pulse-cyan animate-pulse" />
        <span className="text-sm text-pulse-body font-mono">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Right: User info */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-pulse-meta hover:text-pulse-body hover:bg-[rgba(255,255,255,0.04)] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pulse-amber rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pulse-teal to-pulse-purple flex items-center justify-center text-sm font-medium text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm text-white font-medium">{user?.name}</div>
              <div className="text-xs text-pulse-meta">{user?.role}</div>
            </div>
            <svg className={`w-4 h-4 text-pulse-meta transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-12 w-48 glass-card p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-[rgba(0,212,255,0.1)] mb-1">
                  <p className="text-sm text-white">{user?.email}</p>
                  <p className="text-xs text-pulse-meta mt-0.5">{user?.organizationName}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-pulse-danger hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
