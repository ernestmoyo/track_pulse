import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth.store';
import TrackFieldFooter from '@/assets/TrackFieldFooter';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-pulse-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* ECG Pulse Hero Animation */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <svg width="600" height="100" viewBox="0 0 600 100" fill="none" className="w-[90vw] max-w-[600px]">
          {/* Flatline that becomes ECG */}
          <motion.path
            d="M 0 50 L 120 50 L 160 50 L 190 15 L 210 85 L 230 10 L 250 90 L 270 25 L 300 50 L 380 50 L 400 50 L 430 20 L 445 70 L 460 15 L 475 80 L 490 30 L 510 50 L 600 50"
            stroke="#00D4FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
          {/* Glow effect */}
          <motion.path
            d="M 0 50 L 120 50 L 160 50 L 190 15 L 210 85 L 230 10 L 250 90 L 270 25 L 300 50 L 380 50 L 400 50 L 430 20 L 445 70 L 460 15 L 475 80 L 490 30 L 510 50 L 600 50"
            stroke="#00D4FF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.15"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>

      {/* Brand Name */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-5xl md:text-6xl font-display text-white tracking-tight">TRACK</span>
          <span className="text-5xl md:text-6xl font-mono font-semibold text-pulse-cyan tracking-tight">PULSE</span>
        </div>
        <p className="text-pulse-body text-lg font-light italic">
          Your brand&apos;s vital signs, every quarter.
        </p>
      </motion.div>

      {/* Login Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md glass-card p-8 mx-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-pulse-danger text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-pulse-body mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-dark"
              placeholder="sam@trackfield.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-pulse-body mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-pulse-meta cursor-pointer">
              <input type="checkbox" className="rounded border-pulse-meta" />
              Remember me
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 p-3 rounded-lg bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.1)]">
          <p className="text-xs text-pulse-meta font-mono">
            Demo: sam@trackfield.com / TrackField@2024
          </p>
        </div>
      </motion.form>

      {/* Footer */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <TrackFieldFooter />
      </motion.div>
    </div>
  );
}
