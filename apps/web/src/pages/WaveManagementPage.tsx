import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type WaveStatus = 'PLANNED' | 'FIELDWORK' | 'PROCESSING' | 'PUBLISHED';

interface DemoWave {
  id: string;
  label: string;
  period: string;
  status: WaveStatus;
  targetN: number;
  actualN: number;
  fieldworkStart: string;
  fieldworkEnd: string;
}

const demoWaves: DemoWave[] = [
  { id: '1', label: 'Q2-2024', period: 'Apr-Jun 2024', status: 'PUBLISHED', targetN: 500, actualN: 508, fieldworkStart: '2024-04-15', fieldworkEnd: '2024-06-15' },
  { id: '2', label: 'Q1-2024', period: 'Jan-Mar 2024', status: 'PUBLISHED', targetN: 500, actualN: 510, fieldworkStart: '2024-01-15', fieldworkEnd: '2024-03-15' },
  { id: '3', label: 'Q4-2023', period: 'Oct-Dec 2023', status: 'PUBLISHED', targetN: 500, actualN: 521, fieldworkStart: '2023-10-15', fieldworkEnd: '2023-12-15' },
  { id: '4', label: 'Q3-2023', period: 'Jul-Sep 2023', status: 'PUBLISHED', targetN: 500, actualN: 498, fieldworkStart: '2023-07-15', fieldworkEnd: '2023-09-15' },
  { id: '5', label: 'Q2-2023', period: 'Apr-Jun 2023', status: 'PUBLISHED', targetN: 500, actualN: 515, fieldworkStart: '2023-04-15', fieldworkEnd: '2023-06-15' },
  { id: '6', label: 'Q1-2023', period: 'Jan-Mar 2023', status: 'PUBLISHED', targetN: 500, actualN: 502, fieldworkStart: '2023-01-15', fieldworkEnd: '2023-03-15' },
];

const statusColors: Record<WaveStatus, string> = {
  PLANNED: 'bg-[rgba(148,163,184,0.15)] text-[#94A3B8] border-[rgba(148,163,184,0.3)]',
  FIELDWORK: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]',
  PROCESSING: 'bg-[rgba(139,94,166,0.15)] text-[#8B5EA6] border-[rgba(139,94,166,0.3)]',
  PUBLISHED: 'bg-[rgba(34,197,94,0.15)] text-[#22C55E] border-[rgba(34,197,94,0.3)]',
};

export default function WaveManagementPage() {
  const [selectedWave, setSelectedWave] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  return (
    <div className="space-y-6">
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div>
          <h1 className="text-2xl font-display text-white">Wave Management</h1>
          <p className="text-sm text-pulse-meta mt-1">South Africa Cereal Brand Tracker 2023-2024</p>
        </div>
        <button onClick={() => { setShowWizard(true); setWizardStep(1); }} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Wave
        </button>
      </motion.div>

      <div className="cyan-line" />

      {/* Wave List */}
      <div className="space-y-3">
        {demoWaves.map((wave, i) => (
          <motion.div
            key={wave.id}
            className={`glass-card-hover p-5 cursor-pointer ${selectedWave === wave.id ? 'cyan-glow' : ''}`}
            onClick={() => setSelectedWave(selectedWave === wave.id ? null : wave.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-lg font-mono font-bold text-white">{wave.label}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-mono ${statusColors[wave.status]}`}>
                  {wave.status}
                </span>
              </div>
              <div className="flex items-center gap-6 text-xs font-mono">
                <div className="text-right">
                  <span className="text-pulse-meta">Period</span>
                  <p className="text-pulse-body mt-0.5">{wave.period}</p>
                </div>
                <div className="text-right">
                  <span className="text-pulse-meta">Sample</span>
                  <p className="text-pulse-body mt-0.5">
                    <span className={wave.actualN >= wave.targetN ? 'text-pulse-success' : 'text-pulse-amber'}>
                      {wave.actualN}
                    </span>
                    /{wave.targetN}
                  </p>
                </div>
                <div className="w-32">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-pulse-meta">Quota Fill</span>
                    <span className="text-pulse-body">{Math.round((wave.actualN / wave.targetN) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-[rgba(148,163,184,0.1)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: wave.actualN >= wave.targetN ? '#22C55E' : wave.actualN >= wave.targetN * 0.8 ? '#F59E0B' : '#EF4444' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (wave.actualN / wave.targetN) * 100)}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 + 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
              {selectedWave === wave.id && (
                <motion.div
                  className="mt-4 pt-4 border-t border-[rgba(0,212,255,0.1)] grid grid-cols-2 md:grid-cols-4 gap-4"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div>
                    <span className="text-[10px] text-pulse-meta font-mono block">Fieldwork Start</span>
                    <span className="text-xs text-pulse-body font-mono">{wave.fieldworkStart}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-pulse-meta font-mono block">Fieldwork End</span>
                    <span className="text-xs text-pulse-body font-mono">{wave.fieldworkEnd}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs py-1.5 px-3">Upload Data</button>
                    <button className="btn-primary text-xs py-1.5 px-3">Process</button>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs py-1.5 px-3">View Survey</button>
                    <button className="btn-secondary text-xs py-1.5 px-3">Quality Flags</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* New Wave Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWizard(false)} />
            <motion.div
              className="relative glass-card w-full max-w-2xl p-8 mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display text-white">New Wave Setup</h2>
                <button onClick={() => setShowWizard(false)} className="text-pulse-meta hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono ${
                      s === wizardStep ? 'bg-pulse-cyan text-pulse-bg' : s < wizardStep ? 'bg-[rgba(34,197,94,0.2)] text-pulse-success' : 'bg-[rgba(148,163,184,0.1)] text-pulse-meta'
                    }`}>
                      {s < wizardStep ? '✓' : s}
                    </div>
                    {s < 5 && <div className={`w-8 h-0.5 ${s < wizardStep ? 'bg-pulse-success' : 'bg-[rgba(148,163,184,0.1)]'}`} />}
                  </div>
                ))}
              </div>

              {/* Step content */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">Wave Metadata</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs text-pulse-meta block mb-1">Wave Label</label><input className="input-dark" placeholder="Q3-2024" /></div>
                    <div><label className="text-xs text-pulse-meta block mb-1">Period</label><input className="input-dark" placeholder="Jul-Sep 2024" /></div>
                    <div><label className="text-xs text-pulse-meta block mb-1">Fieldwork Start</label><input type="date" className="input-dark" /></div>
                    <div><label className="text-xs text-pulse-meta block mb-1">Fieldwork End</label><input type="date" className="input-dark" /></div>
                    <div><label className="text-xs text-pulse-meta block mb-1">Target N</label><input type="number" className="input-dark" defaultValue={500} /></div>
                  </div>
                </div>
              )}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">Survey Builder</h3>
                  <p className="text-xs text-pulse-meta">Drag and drop to reorder questions</p>
                  <div className="glass-card p-4 text-sm text-pulse-body">Survey builder with drag-and-drop question ordering would render here with full interactive functionality.</div>
                </div>
              )}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">Sample Quota Setup</h3>
                  <p className="text-xs text-pulse-meta">Set targets for Sex, Age, SEC, and District</p>
                  <div className="glass-card p-4 text-sm text-pulse-body">Quota setup grid with target cells per demographic combination.</div>
                </div>
              )}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">Fieldwork Notes</h3>
                  <textarea className="input-dark h-32 resize-none" placeholder="Add fieldwork notes and instructions..." />
                </div>
              )}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">Review & Activate</h3>
                  <div className="glass-card p-4 text-sm text-pulse-body">Wave summary and confirmation would render here.</div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button onClick={() => setWizardStep(Math.max(1, wizardStep - 1))} className="btn-secondary" disabled={wizardStep === 1}>Back</button>
                {wizardStep < 5 ? (
                  <button onClick={() => setWizardStep(wizardStep + 1)} className="btn-primary">Next</button>
                ) : (
                  <button onClick={() => setShowWizard(false)} className="btn-primary">Activate Wave</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
