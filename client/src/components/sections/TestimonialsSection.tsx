import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import SnapCarousel from '@/components/motion/SnapCarousel';
import { Building2 } from 'lucide-react';

/** Procesos en los que Andrés participó. Sin valores individuales ni testimonios. */
const PROJECTS: { title: string; entity?: string; sector: string }[] = [
  { title: 'Nueva Terminal de Transporte de Tunja', sector: 'Obras civiles' },
  {
    title: 'Parque Agroalimentario de Tunja',
    entity: 'Gobernación de Boyacá',
    sector: 'Obras civiles',
  },
  {
    title: 'Hospital de Perros y Gatos de Bogotá',
    entity: 'Secretaría Distrital',
    sector: 'Obras civiles',
  },
  {
    title:
      'Dotación Tecnológica y todas las sedes de la Universidad Pedagógica y Tecnológica de Colombia',
    entity: 'UPTC',
    sector: 'Tecnología',
  },
  {
    title: 'Suministros de Papelería y Artículos de Oficina',
    entity: 'CENAC',
    sector: 'Suministros',
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="trayectoria" ref={ref} className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="eyebrow eyebrow-center mb-4">Trayectoria</span>
          <h2 className="display-2 text-primary">Proyectos en los que he participado</h2>
          <p className="lede mt-4">
            Procesos de obras civiles que lograron adjudicación, por cerca de $103.000 millones
            en contratación pública.
          </p>
        </motion.div>

        {/* Escritorio: rejilla · Móvil: carrusel */}
        <SnapCarousel
          labels={PROJECTS.map((p) => `Ver ${p.title}`)}
          desktopClassName="md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3"
        >
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card card-hover flex w-full flex-col p-6"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                <Building2 className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="text-base leading-snug font-semibold text-primary">{p.title}</h3>
              {p.entity && <p className="mt-1.5 text-sm text-text-secondary">{p.entity}</p>}
              <div className="mt-auto pt-4">
                <span className="rounded border border-border bg-bg-alt px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                  {p.sector}
                </span>
              </div>
            </motion.article>
          ))}
        </SnapCarousel>
      </div>
    </section>
  );
}
