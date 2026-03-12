import { cn } from '@/lib/cn';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

/**
 * BorderBeam — Borde animado con gradiente rotando (estilo Aceternity/Magic UI).
 * Se aplica como hijo de un contenedor con `position: relative; overflow: hidden`.
 */
export function BorderBeam({
  className,
  size = 200,
  duration = 6,
  delay = 0,
  colorFrom = '#B89146',
  colorTo = '#D4A853',
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        className
      )}
      style={{
        padding: borderWidth,
        maskImage: `linear-gradient(transparent, transparent), linear-gradient(#fff, #fff)`,
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        maskClip: 'padding-box, border-box',
      }}
    >
      <div
        className="absolute aspect-square animate-border-beam"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}
