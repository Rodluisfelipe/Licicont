import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterOptions {
  end: number;
  duration?: number;
  decimals?: number;
  delay?: number;
}

/**
 * Hook para contadores animados estilo terminal financiero.
 * Incrementa de 0 al valor final con easing.
 */
export function useAnimatedCounter({
  end,
  duration = 2000,
  decimals = 0,
  delay = 0,
}: AnimatedCounterOptions): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = easedProgress * end;

        setCount(Number(currentValue.toFixed(decimals)));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, decimals, delay]);

  return count;
}
