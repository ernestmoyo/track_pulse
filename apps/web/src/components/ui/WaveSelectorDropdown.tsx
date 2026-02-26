import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Wave } from '@trackpulse/shared';

interface WaveSelectorProps {
  waves: Wave[];
  selectedWaveId: string | null;
  onSelect: (waveId: string) => void;
}

export default function WaveSelectorDropdown({ waves, selectedWaveId, onSelect }: WaveSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = waves.find((w) => w.id === selectedWaveId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-sm text-white hover:border-pulse-cyan transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <svg className="w-4 h-4 text-pulse-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{selected?.label || 'Select Wave'}</span>
        <svg className={`w-4 h-4 text-pulse-meta transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 mt-2 w-56 glass-card p-2 z-50 max-h-60 overflow-y-auto"
            role="listbox"
          >
            {waves.map((wave) => (
              <li key={wave.id}>
                <button
                  onClick={() => { onSelect(wave.id); setIsOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    wave.id === selectedWaveId
                      ? 'bg-[rgba(0,212,255,0.1)] text-pulse-cyan'
                      : 'text-pulse-body hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                  role="option"
                  aria-selected={wave.id === selectedWaveId}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono">{wave.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded text-pulse-meta ${
                      wave.status === 'PUBLISHED' ? 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]' : 'bg-[rgba(148,163,184,0.1)]'
                    }`}>
                      {wave.status}
                    </span>
                  </div>
                  <p className="text-xs text-pulse-meta mt-0.5">{wave.period}</p>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
