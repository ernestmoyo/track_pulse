import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BrandBubble {
  name: string;
  pricePerception: number; // 1-5, 1=expensive, 5=affordable
  qualityPerception: number; // 1-5, 1=economy, 5=premium
  consumptionShare: number; // for bubble size
  color: string;
  isMain: boolean;
}

const brands: BrandBubble[] = [
  { name: 'Jungle Oats', pricePerception: 3.2, qualityPerception: 4.1, consumptionShare: 49.3, color: '#00D4FF', isMain: true },
  { name: 'Weet-Bix', pricePerception: 3.5, qualityPerception: 3.5, consumptionShare: 28.3, color: '#F59E0B', isMain: false },
  { name: "Kellogg's", pricePerception: 3.8, qualityPerception: 3.1, consumptionShare: 17.2, color: '#8B5EA6', isMain: false },
  { name: 'ProNutro', pricePerception: 4.2, qualityPerception: 2.9, consumptionShare: 11.8, color: '#57B9A5', isMain: false },
  { name: 'Future Life', pricePerception: 3.6, qualityPerception: 3.3, consumptionShare: 10.2, color: '#EF4444', isMain: false },
];

export default function PositioningTab() {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (canvasRef.current) {
      setDims({
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
      });
    }
  }, []);

  const mapX = (val: number) => ((val - 1) / 4) * (dims.width - 120) + 60;
  const mapY = (val: number) => dims.height - ((val - 1) / 4) * (dims.height - 80) - 40;
  const mapSize = (val: number) => 15 + (val / 50) * 35;

  return (
    <div className="space-y-6">
      <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-1">Perceptual Positioning Map</h3>
        <p className="text-xs text-pulse-meta mb-4">Price vs Quality perception — bubble size = consumption share</p>

        <div ref={canvasRef} className="relative h-[400px] border border-[rgba(148,163,184,0.1)] rounded-lg overflow-hidden" style={{ background: 'rgba(8,12,20,0.5)' }}>
          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
            backgroundSize: `${dims.width / 5}px ${dims.height / 5}px`,
          }} />

          {/* Axis labels */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-pulse-meta">
            Affordable →
          </div>
          <div className="absolute bottom-2 left-4 text-[10px] font-mono text-pulse-meta">
            ← Expensive
          </div>
          <div className="absolute top-2 left-2 text-[10px] font-mono text-pulse-meta writing-mode-vertical">
            Premium ↑
          </div>
          <div className="absolute bottom-10 left-2 text-[10px] font-mono text-pulse-meta">
            ↓ Economy
          </div>

          {/* Center crosshair */}
          <div className="absolute left-1/2 top-0 w-px h-full bg-[rgba(148,163,184,0.1)]" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-[rgba(148,163,184,0.1)]" />

          {/* Brand Bubbles */}
          {brands.map((brand) => {
            const x = mapX(brand.pricePerception);
            const y = mapY(brand.qualityPerception);
            const size = mapSize(brand.consumptionShare);
            const isHovered = hoveredBrand === brand.name;

            return (
              <motion.div
                key={brand.name}
                className="absolute cursor-pointer"
                style={{
                  left: x - size,
                  top: y - size,
                  width: size * 2,
                  height: size * 2,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                onMouseEnter={() => setHoveredBrand(brand.name)}
                onMouseLeave={() => setHoveredBrand(null)}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: `${brand.color}${isHovered ? '60' : '30'}`,
                    border: `2px solid ${brand.color}`,
                    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: isHovered ? `0 0 20px ${brand.color}40` : 'none',
                  }}
                >
                  <span className="text-[9px] font-mono text-white font-medium text-center leading-tight px-1">
                    {brand.name}
                  </span>
                </div>

                {/* Tooltip on hover */}
                {isHovered && (
                  <motion.div
                    className="absolute -top-16 left-1/2 -translate-x-1/2 glass-card px-3 py-2 text-[10px] font-mono z-10 whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-white font-medium">{brand.name}</div>
                    <div className="text-pulse-meta">Quality: {brand.qualityPerception}/5</div>
                    <div className="text-pulse-meta">Price: {brand.pricePerception}/5</div>
                    <div className="text-pulse-cyan">Share: {brand.consumptionShare}%</div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
