import { useState, useEffect, useRef } from 'react';

export function useCountUp(
  end: number,
  duration = 1200,
  decimals = 1,
  startOnMount = true,
): { value: string; isComplete: boolean } {
  const [displayValue, setDisplayValue] = useState(startOnMount ? '0' : end.toFixed(decimals));
  const [isComplete, setIsComplete] = useState(!startOnMount);
  const rafRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!startOnMount) return;

    const startVal = 0;
    const endVal = end;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * eased;

      setDisplayValue(current.toFixed(decimals));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal.toFixed(decimals));
        setIsComplete(true);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, decimals, startOnMount]);

  return { value: displayValue, isComplete };
}
