import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface PulseKpiCardProps {
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  threshold: number;
  sparklineData: number[];
  delay?: number;
}

export default function PulseKpiCard({
  label,
  value,
  previousValue,
  unit,
  threshold,
  sparklineData,
  delay = 0,
}: PulseKpiCardProps) {
  const { value: displayValue } = useCountUp(value, 1200, value % 1 === 0 ? 0 : 1);
  const delta = value - previousValue;
  const isUp = delta > 0;
  const isDown = delta < 0;
  const isHealthy = value > threshold;

  const sparkData = sparklineData.length > 0
    ? sparklineData.map((v, i) => ({ idx: i, v }))
    : [{ idx: 0, v: previousValue || value * 0.9 }, { idx: 1, v: value * 0.95 }, { idx: 2, v: value * 0.98 }, { idx: 3, v: value }];

  return (
    <motion.div
      className="glass-card-hover relative p-5 overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      {/* Pulse ring animation */}
      {isHealthy && (
        <div className="absolute top-3 right-3">
          <div className="relative w-3 h-3">
            <div className="absolute inset-0 rounded-full bg-pulse-cyan opacity-80" />
            <div className="pulse-ring" />
          </div>
        </div>
      )}

      {/* Label */}
      <p className="text-xs text-pulse-meta uppercase tracking-wider font-mono mb-3">{label}</p>

      {/* Value */}
      <div className="flex items-end gap-1 mb-2">
        <span className="text-3xl font-mono font-bold text-white leading-none">
          {displayValue}
        </span>
        {unit && <span className="text-lg text-pulse-meta font-mono mb-0.5">{unit}</span>}
      </div>

      {/* Delta badge */}
      <div className="flex items-center gap-2 mb-4">
        {delta !== 0 && (
          <motion.span
            className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full ${
              isUp
                ? 'bg-[rgba(34,197,94,0.15)] text-pulse-success'
                : isDown
                ? 'bg-[rgba(239,68,68,0.15)] text-pulse-danger'
                : 'bg-[rgba(148,163,184,0.15)] text-pulse-body'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.5 }}
          >
            {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{delta.toFixed(1)}pp
          </motion.span>
        )}
        <span className="text-xs text-pulse-meta">vs prev wave</span>
      </div>

      {/* Sparkline */}
      <div className="h-10 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke="#00D4FF"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
              animationBegin={delay * 1000 + 800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
