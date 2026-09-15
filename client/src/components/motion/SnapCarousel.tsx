import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useHaptics } from '@/hooks/useHaptics';

interface SnapCarouselProps {
  children: ReactNode[];
  /** Etiqueta accesible de cada parada, para la paginación. */
  labels: string[];
  /** Clases del contenedor en escritorio, donde deja de ser carrusel. */
  desktopClassName?: string;
  /** Ancho de cada tarjeta en móvil. */
  itemClassName?: string;
  className?: string;
}

/**
 * Carrusel táctil con parada en cada tarjeta.
 *
 * En móvil evita que una lista larga se convierta en scroll interminable: seis
 * tarjetas apiladas son seis pantallas, en carrusel son una. En escritorio el
 * mismo marcado se comporta como rejilla, sin duplicar contenido ni montar dos
 * árboles distintos.
 */
export default function SnapCarousel({
  children,
  labels,
  desktopClassName = 'md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3',
  itemClassName = 'w-[82vw] sm:w-[60vw] md:w-auto',
  className = '',
}: SnapCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const { haptic } = useHaptics();

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const card = rail.firstElementChild as HTMLElement | null;
        if (!card) return;
        // Fuera del carrusel (escritorio) el rail no se desplaza.
        if (rail.scrollWidth <= rail.clientWidth) return;
        const step = card.offsetWidth + 16;
        const next = Math.max(0, Math.min(children.length - 1, Math.round(rail.scrollLeft / step)));
        setCurrent((prev) => {
          if (prev !== next) haptic('tick');
          return next;
        });
      });
    };

    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      rail.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [children.length, haptic]);

  const goTo = (i: number) => {
    const rail = railRef.current;
    const card = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !card) return;
    haptic('select');
    rail.scrollTo({ left: i * (card.offsetWidth + 16), behavior: 'smooth' });
  };

  return (
    <>
      <div
        ref={railRef}
        className={`snap-row -mx-6 flex gap-4 overflow-x-auto px-6 pb-2 md:mx-0 ${desktopClassName} ${className}`}
      >
        {children.map((child, i) => (
          <div key={i} className={`snap-item flex shrink-0 md:shrink ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>

      {/* Paginación: solo tiene sentido mientras es carrusel */}
      <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => goTo(i)}
            aria-label={label}
            aria-current={i === current ? 'true' : undefined}
            className="flex h-11 items-center px-2"
          >
            <span
              className={`block h-1 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-gold' : 'w-2 bg-border-strong'
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
