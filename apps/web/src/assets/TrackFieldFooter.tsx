export default function TrackFieldFooter({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-pulse-meta text-xs font-mono ${className}`}>
      {/* TP monogram icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2v20M8 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="#57B9A5" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span>
        Powered by <span className="text-pulse-teal">TrackField Projects</span> | trackfieldprojects.com
      </span>
    </div>
  );
}
