import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AwarenessTab from '@/components/modules/tracker/AwarenessTab';
import AdvertisingTab from '@/components/modules/tracker/AdvertisingTab';
import ConsumptionTab from '@/components/modules/tracker/ConsumptionTab';
import PositioningTab from '@/components/modules/tracker/PositioningTab';
import SegmentTab from '@/components/modules/tracker/SegmentTab';

const TABS = [
  { id: 'awareness', label: 'Awareness Journey' },
  { id: 'advertising', label: 'Advertising & SOV' },
  { id: 'consumption', label: 'Consumption Patterns' },
  { id: 'positioning', label: 'Brand Positioning' },
  { id: 'segments', label: 'Segment Deep Dive' },
];

export default function BrandTrackerPage() {
  const [activeTab, setActiveTab] = useState('awareness');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display text-white">Brand Tracker</h1>
        <p className="text-sm text-pulse-meta mt-1">Jungle Oats — Deep Dive Analysis</p>
      </motion.div>

      <div className="cyan-line" />

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 glass-card w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id
                ? 'text-pulse-cyan'
                : 'text-pulse-meta hover:text-pulse-body'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'awareness' && <AwarenessTab />}
          {activeTab === 'advertising' && <AdvertisingTab />}
          {activeTab === 'consumption' && <ConsumptionTab />}
          {activeTab === 'positioning' && <PositioningTab />}
          {activeTab === 'segments' && <SegmentTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
