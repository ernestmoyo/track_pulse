import { motion } from 'framer-motion';

interface Alert {
  id: string;
  type: 'warning' | 'positive' | 'neutral';
  message: string;
  timestamp: string;
}

interface AlertsFeedProps {
  alerts: Alert[];
}

export default function AlertsFeed({ alerts }: AlertsFeedProps) {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-1">Alerts</h3>
      <p className="text-xs text-pulse-meta mb-4">Significant changes this wave</p>

      <div className="space-y-3 max-h-48 overflow-y-auto">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              alert.type === 'warning'
                ? 'bg-[rgba(245,158,11,0.05)] border-[rgba(245,158,11,0.2)]'
                : alert.type === 'positive'
                ? 'bg-[rgba(34,197,94,0.05)] border-[rgba(34,197,94,0.2)]'
                : 'bg-[rgba(148,163,184,0.05)] border-[rgba(148,163,184,0.15)]'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
          >
            <span className="text-base mt-0.5">
              {alert.type === 'warning' ? '⚠' : alert.type === 'positive' ? '✦' : '○'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-pulse-body leading-relaxed">{alert.message}</p>
              <p className="text-[10px] text-pulse-meta mt-1 font-mono">{alert.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
