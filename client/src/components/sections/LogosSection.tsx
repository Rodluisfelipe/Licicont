import { motion } from 'motion/react';

const ENTITIES = [
  'MinTIC', 'INVÍAS', 'ANI', 'SENA', 'MinSalud',
  'Ecopetrol', 'MinDefensa', 'MinEducación', 'DIAN', 'ICBF',
  'IDU Bogotá', 'Gobernación Antioquia', 'MinAmbiente', 'SECOP',
];

export default function LogosSection() {
  return (
    <section className="overflow-hidden border-y border-border bg-bg-alt py-10">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-6 text-center text-xs font-medium tracking-widest text-text-light uppercase"
      >
        Hemos participado en procesos con entidades como
      </motion.p>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-bg-alt to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-bg-alt to-transparent" />

        <div className="flex animate-ticker whitespace-nowrap">
          {[...ENTITIES, ...ENTITIES].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="mx-8 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-text-secondary/60 uppercase select-none"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold/40" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
