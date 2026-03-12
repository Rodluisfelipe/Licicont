import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Search, Crosshair, FileCheck, Trophy } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: <Search className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Diagnóstico',
    description:
      'Evaluamos su empresa: experiencia, RUP, capacidad financiera, equipo y sectores de interés. Definimos su perfil competitivo.',
    tags: ['Análisis de capacidad', 'Revisión RUP', 'Perfil competitivo'],
  },
  {
    num: '02',
    icon: <Crosshair className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Inteligencia',
    description:
      'Identificamos licitaciones alineadas con su perfil. Analizamos competencia y precios de referencia. Decision conjunta: Go o No-Go.',
    tags: ['Monitoreo SECOP', 'Análisis Go/No-Go', 'Benchmark precios'],
  },
  {
    num: '03',
    icon: <FileCheck className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Preparación',
    description:
      'Estructuramos la propuesta técnica, económica y documental. Revisión jurídica rigurosa. Cumplimiento al 100% antes de radicar.',
    tags: ['Propuesta técnica', 'Oferta económica', 'Revisión legal'],
  },
  {
    num: '04',
    icon: <Trophy className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Adjudicación',
    description:
      'Acompañamos post-entrega: subsanaciones, aclaraciones, audiencias. Defendemos su propuesta hasta lograr la adjudicación.',
    tags: ['Subsanaciones', 'Seguimiento', 'Defensa evaluadores'],
  },
];

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="proceso" ref={ref} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
            Metodología
          </span>
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            De la oportunidad al contrato firmado
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary lg:text-lg">
            Un proceso probado en más de 350 contratos adjudicados. Cuatro fases que 
            maximizan su probabilidad de éxito.
          </p>
        </motion.div>

        {/* Steps row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
            >
              {/* Step number */}
              <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-white shadow-sm">
                Paso {step.num}
              </span>

              <div className="mb-4 mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                {step.icon}
              </div>

              <h3 className="mb-2 text-lg font-bold text-primary">
                {step.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-bg-alt px-2.5 py-0.5 text-[11px] font-medium text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Connector arrow (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 text-gold lg:block">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7 4l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
