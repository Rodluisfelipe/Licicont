import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { SCROLL_SPRING } from '@/lib/easing';

interface ParallaxProps {
  children: ReactNode;
  /** Recorrido en píxeles a lo largo de la travesía por la ventana. */
  distance?: number;
  className?: string;
}

/**
 * Desplazamiento a distinta velocidad que el resto de la página.
 *
 * Amortiguado con un muelle para que el elemento nunca se pegue literalmente al
 * scroll: esa pequeña inercia es lo que separa la profundidad del efecto barato.
 */
export default function Parallax({ children, distance = 60, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, SCROLL_SPRING);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
