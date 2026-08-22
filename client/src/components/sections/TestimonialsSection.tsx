import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Quote, Star, ArrowUpRight, TrendingUp } from 'lucide-react';

const CASE_STUDIES = [
  {
    quote:
      'Empezamos con una licitación de aseo institucional y en 3 meses ya teníamos 2 contratos más de papelería. LICICONT nos abrió la puerta al SECOP.',
    name: 'Laura Gutiérrez',
    role: 'Gerente Comercial',
    company: 'Suministros Avanza SAS',
    sector: 'Papelería y Aseo',
    challenge: 'No sabían cómo participar en SECOP II',
    solution: 'Acompañamiento completo desde el registro hasta la primera propuesta',
    result: '3 contratos de suministros en 3 meses',
    metric: '3 contratos',
  },
  {
    quote:
      'Gracias al análisis Go/No-Go solo licitamos donde teníamos opción real. Ganamos un contrato de infraestructura TI por $2.800M con una gobernación.',
    name: 'Ricardo Vargas',
    role: 'Director de Tecnología',
    company: 'DataNet Colombia SAS',
    sector: 'Tecnología',
    challenge: 'Invertían en propuestas de TI con baja probabilidad de ganar',
    solution: 'Análisis Go/No-Go + propuesta técnica especializada en TI',
    result: 'Contrato adjudicado por $2.800M COP',
    metric: '+$2.800M',
  },
  {
    quote:
      'LICICONT detectó un riesgo en el pliego que nadie más vio. Ganamos la licitación de la terminal de transporte sin una sola observación.',
    name: 'Carlos Andrés Mejía',
    role: 'Gerente General',
    company: 'Constructora Mejía & Asociados',
    sector: 'Obras Civiles',
    challenge: 'Perdían por fallos en documentación técnica y jurídica',
    solution: 'Revisión jurídica profunda + estructuración de propuesta integral de obra',
    result: 'Contrato adjudicado por $1.200M COP',
    metric: '+$1.200M',
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="eyebrow eyebrow-center mb-4">Casos de Éxito</span>
          <h2 className="display-2 text-primary">
            Resultados reales de clientes reales
          </h2>
          <p className="lede mt-4">
            Así he ayudado a empresas colombianas a ganar contratos con el Estado.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {CASE_STUDIES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex flex-col rounded-lg border border-border bg-white shadow-sm transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
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
                  <span className="mt-2 inline-block rounded border border-border bg-bg-alt px-2 py-0.5 text-[11px] font-medium text-text-secondary">
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
