import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Quote, Star, ArrowUpRight, TrendingUp } from 'lucide-react';

const CASE_STUDIES = [
  {
    quote:
      'Empezamos con una licitacion de aseo institucional y en 3 meses ya teniamos 2 contratos mas de papeleria. LICICONT nos abrio la puerta al SECOP.',
    name: 'Laura Gutierrez',
    role: 'Gerente Comercial',
    company: 'Suministros Avanza SAS',
    sector: 'Papeleria y Aseo',
    challenge: 'No sabian como participar en SECOP II',
    solution: 'Acompanamiento completo desde el registro hasta la primera propuesta',
    result: '3 contratos de suministros en 3 meses',
    metric: '3 contratos',
  },
  {
    quote:
      'Gracias al analisis Go/No-Go solo licitamos donde teniamos chance real. Ganamos un contrato de infraestructura TI por $2.800M con una gobernacion.',
    name: 'Ricardo Vargas',
    role: 'Director de Tecnologia',
    company: 'DataNet Colombia SAS',
    sector: 'Tecnologia',
    challenge: 'Invertian en propuestas de TI con baja probabilidad de ganar',
    solution: 'Analisis Go/No-Go + propuesta tecnica especializada en TI',
    result: 'Contrato adjudicado por $2.800M COP',
    metric: '+$2.800M',
  },
  {
    quote:
      'LICICONT detecto un riesgo en el pliego que nadie mas vio. Ganamos la licitacion de la terminal de transporte sin una sola observacion.',
    name: 'Carlos Andres Mejia',
    role: 'Gerente General',
    company: 'Constructora Mejia & Asociados',
    sector: 'Obras Civiles',
    challenge: 'Perdian por fallos en documentacion tecnica y juridica',
    solution: 'Revision juridica profunda + estructuracion de propuesta integral de obra',
    result: 'Contrato adjudicado por $1.200M COP',
    metric: '+$1.200M',
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
            Casos de Éxito
          </span>
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Resultados reales de clientes reales
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary lg:text-lg">
            Así he ayudado a empresas colombianas a ganar contratos con el Estado.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {CASE_STUDIES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
            >
              {/* Metric banner */}
              <div className="flex items-center justify-between rounded-t-2xl bg-primary px-6 py-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                  <TrendingUp className="h-3.5 w-3.5 text-gold" />
                  Resultado
                </span>
                <span className="text-sm font-bold text-gold-light">{c.metric}</span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                {/* Before → After flow */}
                <div className="mb-5 space-y-3">
                  <div className="rounded-xl bg-red-50 px-4 py-2.5">
                    <p className="text-[11px] font-semibold text-red-400 uppercase">Reto</p>
                    <p className="text-xs leading-relaxed text-red-600">{c.challenge}</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowUpRight className="h-4 w-4 rotate-90 text-text-light" />
                  </div>
                  <div className="rounded-xl bg-emerald-50 px-4 py-2.5">
                    <p className="text-[11px] font-semibold text-emerald-500 uppercase">Resultado</p>
                    <p className="text-xs leading-relaxed text-emerald-700">{c.result}</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative mb-5 flex-1">
                  <Quote className="absolute -top-1 -left-1 h-7 w-7 text-gold/15" />
                  <p className="pl-5 text-sm leading-relaxed text-text-secondary italic">
                    &ldquo;{c.quote}&rdquo;
                  </p>
                </div>

                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Author */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-primary">{c.name}</p>
                  <p className="text-xs text-text-secondary">{c.role} — {c.company}</p>
                  <span className="mt-2 inline-block rounded-full bg-bg-alt px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">
                    {c.sector}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
