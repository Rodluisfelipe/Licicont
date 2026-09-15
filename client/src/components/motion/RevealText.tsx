import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { DURATION, EASE_OUT } from '@/lib/easing';

interface RevealTextProps {
  /** Texto plano: se separa en palabras para revelarlas en cascada. */
  text: string;
  className?: string;
  /** Retraso inicial en segundos. */
  delay?: number;
  /** Elemento contenedor (el titular suele traer el suyo). */
  as?: 'span' | 'p';
  children?: never;
}

/**
 * Revelado por palabras: cada una sube desde detrás de una máscara.
 *
 * Es el recurso que distingue un titular compuesto de uno que simplemente
 * aparece. El texto completo queda en el DOM para lectores de pantalla y para
 * los buscadores; solo se anima la presentación.
 */
export default function RevealText({
  text,
  className = '',
  delay = 0,
  as = 'span',
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });
  const reduced = useReducedMotion();

  const Wrapper = as;
  const words = text.split(' ');

  if (reduced) {
    return <Wrapper className={className}>{text}</Wrapper>;
  }

  return (
    <Wrapper ref={ref as never} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="-mb-[0.16em] inline-flex overflow-hidden pb-[0.16em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '112%' }}
            animate={inView ? { y: '0%' } : undefined}
            transition={{
              duration: DURATION.slow,
              ease: EASE_OUT,
              delay: delay + i * 0.055,
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Wrapper>
  );
}

/**
 * Variante para composiciones que llevan marcado dentro (una palabra en otro
 * color, un salto de línea). Revela el bloque completo con la misma curva.
 */
export function RevealBlock({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '18%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : undefined}
        transition={{ duration: DURATION.slow, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
