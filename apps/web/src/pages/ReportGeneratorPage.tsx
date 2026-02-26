import { useState } from 'react';
import { motion } from 'framer-motion';
import { REPORT_SECTION_LABELS } from '@trackpulse/shared';

const allSections = Object.entries(REPORT_SECTION_LABELS);

const demoSlides = [
  { title: 'Title Slide', description: 'Brand logo, wave period, TrackPulse branding' },
  { title: 'Executive Summary', description: 'KPI overview with significance indicators' },
  { title: 'Brand Awareness', description: 'TOM, Spontaneous, Aided awareness trends' },
  { title: 'Advertising Awareness & SOV', description: 'Ad recall rates and share of voice' },
  { title: 'Brand Consumption', description: '30-day consumption with frequency breakdown' },
  { title: 'Competitive Landscape', description: 'Radar chart comparison across dimensions' },
  { title: 'Recommendations', description: 'Strategic insights and next steps' },
];

export default function ReportGeneratorPage() {
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'executive_summary', 'brand_awareness', 'ad_awareness_sov', 'brand_consumption', 'competitive_landscape', 'recommendations',
  ]);
  const [format, setFormat] = useState<'pptx' | 'pdf' | 'both'>('pptx');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const toggleSection = (key: string) => {
    setSelectedSections((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return p + 5;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display text-white">Report Generator</h1>
        <p className="text-sm text-pulse-meta mt-1">Configure and generate professional brand health reports</p>
      </motion.div>

      <div className="cyan-line" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <motion.div className="glass-card p-6 space-y-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div>
            <label className="text-xs text-pulse-meta font-mono block mb-1.5">Brand</label>
            <select className="input-dark text-sm">
              <option>Chantecler</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-pulse-meta font-mono block mb-1.5">Wave</label>
            <select className="input-dark text-sm">
              <option>Q2-2024</option>
              <option>Compare: Q1-2024 vs Q2-2024</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-pulse-meta font-mono block mb-3">Sections</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allSections.map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleSection(key)}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedSections.includes(key) ? 'bg-pulse-cyan border-pulse-cyan' : 'border-pulse-meta group-hover:border-pulse-body'
                  }`}>
                    {selectedSections.includes(key) && (
                      <svg className="w-3 h-3 text-pulse-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                  <span className={`text-xs ${selectedSections.includes(key) ? 'text-white' : 'text-pulse-body group-hover:text-white'}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-pulse-meta font-mono block mb-1.5">Client Logo</label>
            <div className="input-dark flex items-center justify-center h-20 border-dashed cursor-pointer hover:border-pulse-cyan transition-colors">
              <span className="text-xs text-pulse-meta">Drop logo or click to upload</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-pulse-meta font-mono block mb-1.5">Output Format</label>
            <div className="flex gap-2">
              {(['pptx', 'pdf', 'both'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono transition-colors ${
                    format === f ? 'bg-[rgba(0,212,255,0.15)] text-pulse-cyan border border-[rgba(0,212,255,0.3)]' : 'glass-card text-pulse-meta hover:text-pulse-body'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedSections.length === 0}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Generating... {progress}%
              </>
            ) : progress === 100 ? (
              'Download Report'
            ) : (
              'Generate Report'
            )}
          </button>

          {isGenerating && (
            <div className="h-1.5 bg-[rgba(0,212,255,0.1)] rounded-full overflow-hidden">
              <motion.div className="h-full bg-pulse-cyan rounded-full" style={{ width: `${progress}%` }} />
            </div>
          )}
        </motion.div>

        {/* Live Preview Panel */}
        <motion.div className="lg:col-span-2 space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono">Live Preview</h3>
            <span className="text-xs text-pulse-meta font-mono">{activeSlide + 1} / {demoSlides.length}</span>
          </div>

          {/* Slide preview */}
          <div className="glass-card p-1 aspect-video relative overflow-hidden">
            <motion.div
              key={activeSlide}
              className="w-full h-full rounded-lg flex flex-col p-8"
              style={{ background: 'linear-gradient(135deg, #080C14, #1A2332)' }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Top bar */}
              <div className="h-1 w-full bg-pulse-cyan rounded mb-6" />

              {activeSlide === 0 ? (
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-3xl font-display text-white mb-2">CHANTECLER</h2>
                  <p className="text-lg text-pulse-cyan">Brand Health Tracking Report</p>
                  <p className="text-sm text-pulse-body mt-2">Q2-2024</p>
                  <p className="text-xs text-pulse-meta mt-4">Prepared for Panagora Marketing</p>
                </div>
              ) : (
                <div className="flex-1">
                  <h2 className="text-xl font-display text-white mb-4">{demoSlides[activeSlide].title}</h2>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="glass-card p-3">
                        <div className="h-2 w-16 bg-[rgba(148,163,184,0.2)] rounded mb-2" />
                        <div className="text-xl font-mono text-pulse-cyan">{(Math.random() * 50 + 30).toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="glass-card p-4 flex-1">
                    <div className="h-full flex items-center justify-center">
                      <div className="w-full h-20 flex items-end gap-1">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="flex-1 bg-pulse-cyan rounded-t" style={{ height: `${20 + Math.random() * 80}%`, opacity: 0.4 + Math.random() * 0.6 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto pt-4">
                <div className="text-[8px] text-pulse-meta font-mono">TrackPulse | Powered by TrackField Projects | trackfieldprojects.com</div>
              </div>
            </motion.div>
          </div>

          {/* Slide thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {demoSlides.map((slide, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`flex-shrink-0 w-28 h-16 rounded-lg text-[8px] p-2 transition-all ${
                  i === activeSlide ? 'cyan-glow' : 'glass-card hover:border-[rgba(0,212,255,0.2)]'
                }`}
                style={{ background: 'linear-gradient(135deg, #080C14, #1A2332)' }}
              >
                <div className="h-0.5 w-full bg-pulse-cyan rounded mb-1 opacity-50" />
                <span className="text-pulse-body line-clamp-2">{slide.title}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
