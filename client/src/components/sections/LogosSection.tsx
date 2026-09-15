import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from 'motion/react';

const ENTITIES = [
  'MinTIC', 'INVÍAS', 'ANI', 'SENA', 'MinSalud',
  'Ecopetrol', 'MinDefensa', 'MinEducación', 'DIAN', 'ICBF',
  'IDU Bogotá', 'Gobernación Antioquia', 'MinAmbiente', 'SECOP',
];

/** Mantiene un valor dentro del rango [min, max) para el bucle infinito. */
function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

export default function LogosSection() {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  // La banda avanza sola, pero el scroll la empuja: al bajar acelera, al subir
  // se invierte. Es un detalle pequeño que delata una mano detrás.
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    let moveBy = direction.current * -2.4 * (delta / 1000);
    const factor = velocityFactor.get();

    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <section className="overflow-hidden border-y border-border bg-bg-alt py-8">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-6 text-center text-xs font-medium tracking-widest text-text-light uppercase"
      >
        Hemos participado en procesos con entidades como
      </motion.p>

      <div className="relative">
        {/* Bordes difuminados: la banda no empieza ni termina, atraviesa */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg-alt to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg-alt to-transparent" />

        <motion.div
          style={reduced ? undefined : { x }}
          className={`flex whitespace-nowrap ${reduced ? 'justify-center' : 'w-max'}`}
        >
          {[...ENTITIES, ...ENTITIES, ...ENTITIES, ...ENTITIES].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="mx-8 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-text-secondary/60 uppercase select-none"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold/40" />
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
