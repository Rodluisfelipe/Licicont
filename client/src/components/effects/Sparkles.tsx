import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

interface SparklesProps {
  className?: string;
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
}

/**
 * Sparkles — Partículas doradas flotantes usando CSS puro.
 * Más ligero que Three.js para decoración de secciones.
 */
export function Sparkles({
  className,
  count = 20,
  color = '#B89146',
  minSize = 1,
  maxSize = 3,
}: SparklesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      const size = minSize + Math.random() * (maxSize - minSize);
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const animDuration = 3 + Math.random() * 4;
      const delay = Math.random() * 5;

      Object.assign(sparkle.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
        left: `${x}%`,
        top: `${y}%`,
        opacity: '0',
        animation: `sparkle-pulse ${animDuration}s ${delay}s ease-in-out infinite`,
        pointerEvents: 'none',
      });

      container.appendChild(sparkle);
    }
  }, [count, color, minSize, maxSize]);

  return (
    <>
      <style>{`
        @keyframes sparkle-pulse {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.5; transform: scale(1); }
        }
      `}</style>
      <div
        ref={containerRef}
        className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
        aria-hidden="true"
      />
    </>
  );
}
