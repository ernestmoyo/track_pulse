export default function EcgLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 0 20 L 20 20 L 30 8 L 40 32 L 50 4 L 60 36 L 70 12 L 80 20 L 120 20"
          stroke="#00D4FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          style={{
            animation: 'ecg-draw 2s ease-in-out forwards infinite',
          }}
        />
      </svg>
    </div>
  );
}
