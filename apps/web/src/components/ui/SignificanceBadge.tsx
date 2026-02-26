import { motion } from 'framer-motion';

interface SignificanceBadgeProps {
  direction: 'up' | 'down' | 'neutral';
  value: number;
  animated?: boolean;
  significant?: boolean;
}

export default function SignificanceBadge({ direction, value, animated = true, significant = false }: SignificanceBadgeProps) {
  const isUp = direction === 'up';
  const isDown = direction === 'down';

  const colorClass = significant
    ? isUp
      ? 'bg-[rgba(34,197,94,0.15)] text-[#22C55E] border-[rgba(34,197,94,0.3)]'
      : isDown
      ? 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border-[rgba(239,68,68,0.3)]'
      : 'bg-[rgba(148,163,184,0.1)] text-[#94A3B8] border-[rgba(148,163,184,0.2)]'
    : 'bg-[rgba(148,163,184,0.1)] text-[#94A3B8] border-[rgba(148,163,184,0.2)]';

  const arrow = isUp ? '▲' : isDown ? '▼' : '—';

  const content = (
    <span className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full border ${colorClass}`}>
      {arrow} {Math.abs(value).toFixed(1)}pp
      {significant && <span className="text-[10px] opacity-60">*</span>}
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
