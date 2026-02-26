export default function TrackPulseLogo({ className = '', size = 'default' }: { className?: string; size?: 'small' | 'default' | 'large' }) {
  const sizes = {
    small: { width: 140, height: 32 },
    default: { width: 200, height: 44 },
    large: { width: 300, height: 66 },
  };
  const { width, height } = sizes[size];

  return (
    <svg className={className} width={width} height={height} viewBox="0 0 200 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ECG Pulse Icon */}
      <path d="M 4 22 L 12 22 L 16 12 L 22 32 L 28 8 L 32 22 L 40 22" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* TRACK text */}
      <text x="48" y="20" fontFamily="'DM Serif Display', Georgia, serif" fontSize="18" fontWeight="400" fill="#FFFFFF" dominantBaseline="middle">TRACK</text>
      {/* PULSE text */}
      <text x="108" y="20" fontFamily="'JetBrains Mono', monospace" fontSize="18" fontWeight="600" fill="#00D4FF" dominantBaseline="middle">PULSE</text>
      {/* Tagline */}
      <text x="48" y="36" fontFamily="'DM Sans', sans-serif" fontSize="7" fill="#64748B" letterSpacing="1.5">BRAND HEALTH INTELLIGENCE</text>
    </svg>
  );
}
