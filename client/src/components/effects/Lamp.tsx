import { cn } from '@/lib/cn';

interface LampProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Lamp — Efecto de "resplandor cónico" para encabezados de sección.
 * Inspirado en Aceternity UI Lamp component.
 */
export function Lamp({ className, children }: LampProps) {
  return (
    <div className={cn('relative flex flex-col items-center justify-center overflow-hidden', className)}>
      {/* Glow cone */}
      <div className="relative z-0 flex w-full items-center justify-center">
        {/* Left gradient arm */}
        <div
          className="absolute h-48 w-[30rem] -translate-y-[6rem]"
          style={{
            background: 'conic-gradient(from 70deg at 50% 100%, transparent 0deg, #B89146 80deg, transparent 160deg)',
            opacity: 0.10,
            filter: 'blur(60px)',
          }}
        />
        {/* Center glow */}
        <div
          className="absolute h-32 w-[20rem] -translate-y-[4rem]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(184, 145, 70, 0.15) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        {/* Thin gold line */}
        <div className="absolute top-0 h-px w-64 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
