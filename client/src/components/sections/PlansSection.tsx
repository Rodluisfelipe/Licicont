import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Check,
  ChevronDown,
  Compass,
  HandCoins,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  Target,
  X,
  type LucideIcon,
} from 'lucide-react';
import { SERVICES, DIFFERENTIATORS, type Service } from '@/data/services';
import { buildServiceMessage, whatsappUrl } from '@/lib/whatsapp';
import ServiceIcon from '@/components/diagnostic/ServiceIcon';

const DIFF_ICONS: Record<string, LucideIcon> = {
  Target,
  Sparkles,
  ShieldAlert,
  HandCoins,
};

function PlanCard({ service, delay }: { service: Service; delay: number }) {
  const [open, setOpen] = useState(false);
  const featured = Boolean(service.featured);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay }}
      className={`flex flex-col rounded-2xl border p-7 transition-all duration-300 ${
        featured
          ? 'border-gold bg-primary text-white shadow-xl shadow-gold/10'
          : 'border-border bg-white shadow-sm hover:border-gold/30 hover:shadow-lg'
      }`}
    >
      {/* Encabezado */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            featured ? 'bg-gold text-white' : 'bg-gold/10 text-gold'
          }`}
        >
          <ServiceIcon name={service.icon} className="h-6 w-6" />
        </span>
        {service.badge && (
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              featured ? 'bg-gold text-white' : 'bg-gold/10 text-gold-dark'
            }`}
          >
            {service.badge}
          </span>
        )}
      </div>

      <p className={`text-xs italic ${featured ? 'text-white/50' : 'text-text-light'}`}>
        “{service.clientVoice}”
      </p>
      <h3
        className={`mt-1.5 text-lg leading-snug font-bold sm:min-h-[3.5rem] ${
          featured ? 'text-white' : 'text-primary'
        }`}
      >
        {service.name}
      </h3>
      <p
        className={`mt-2 text-sm leading-relaxed sm:min-h-[3.75rem] ${
          featured ? 'text-white/70' : 'text-text-secondary'
        }`}
      >
        {service.tagline}
      </p>

      {/* Precio */}
      <div
        className={`my-4 rounded-xl border px-4 py-3.5 ${
          featured ? 'border-white/15 bg-white/5' : 'border-border bg-bg-alt'
        }`}
      >
        <p className={`text-base font-bold ${featured ? 'text-gold-light' : 'text-primary'}`}>
          {service.price}
        </p>
        {service.priceNote && (
          <p className={`mt-0.5 text-xs ${featured ? 'text-white/50' : 'text-text-light'}`}>
            {service.priceNote}
          </p>
        )}
      </div>

      {/* Qué incluye */}
      <ul className="space-y-2">
        {service.includes.slice(0, 3).map((item) => (
          <li
            key={item}
            className={`flex gap-2.5 text-sm leading-relaxed ${
              featured ? 'text-white/75' : 'text-text-secondary'
            }`}
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Detalle expandible */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="mt-2 space-y-2">
              {service.includes.slice(3).map((item) => (
                <li
                  key={item}
                  className={`flex gap-2.5 text-sm leading-relaxed ${
                    featured ? 'text-white/75' : 'text-text-secondary'
                  }`}
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {service.notIncludes.length > 0 && (
              <ul className="mt-3 space-y-2">
                {service.notIncludes.map((item) => (
                  <li
                    key={item}
                    className={`flex gap-2.5 text-sm leading-relaxed ${
                      featured ? 'text-white/40' : 'text-text-light'
                    }`}
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            <div
              className={`mt-4 border-l-2 border-gold py-1 pl-3 text-xs leading-relaxed ${
                featured ? 'text-white/60' : 'text-text-secondary'
              }`}
            >
              <span className="font-semibold text-gold-dark">Modelo de cobro: </span>
              {service.pricingModel}
            </div>
            <p
              className={`mt-3 text-xs leading-relaxed ${
                featured ? 'text-white/55' : 'text-text-light'
              }`}
            >
              <span className="font-semibold">Diferencial: </span>
              {service.differentiator}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`mt-3 mb-6 inline-flex items-center gap-1 self-start text-xs font-semibold transition-colors ${
          featured ? 'text-gold-light hover:text-gold' : 'text-gold-dark hover:text-gold'
        }`}
      >
        {open ? 'Ver menos' : 'Ver detalle completo'}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* CTA */}
      <a
        href={whatsappUrl(buildServiceMessage(service.name, service.price))}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 pt-3 text-sm font-semibold transition-all ${
          featured
            ? 'bg-gold text-white hover:bg-gold-light'
            : 'border border-border text-primary hover:border-gold hover:bg-gold hover:text-white'
        }`}
      >
        <MessageCircle className="h-4 w-4" />
        Me interesa este servicio
      </a>
    </motion.div>
  );
}

export default function PlansSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="planes" ref={ref} className="scroll-mt-20 bg-bg-alt py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
            El menú completo
          </span>
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Seis formas de trabajar conmigo
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary lg:text-lg">
            Desde aprender a licitar hasta que yo licite contigo cada mes. Cada servicio
            dice qué incluye, qué no y cuánto cuesta.
          </p>

          <a
            href="#diagnostico"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white px-5 py-2.5 text-sm font-semibold text-gold-dark transition-all hover:border-gold hover:bg-gold hover:text-white"
          >
            <Compass className="h-4 w-4" />
            ¿No sabes cuál? Haz el diagnóstico
          </a>
        </motion.div>

        {/* Grilla de servicios */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <PlanCard key={service.id} service={service} delay={i * 0.06} />
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-text-light">
          Los valores son rangos de referencia. El precio final se cierra según el sector,
          el tamaño del proceso y el alcance que necesites.
        </p>

        {/* Diferenciadores */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h3 className="mb-10 text-center text-2xl font-bold text-primary sm:text-3xl">
            Por qué Licicont y no otro
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATORS.map((diff) => {
              const Icon = DIFF_ICONS[diff.icon];
              return (
                <div
                  key={diff.title}
                  className="rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h4 className="mb-2 text-base font-bold text-primary">{diff.title}</h4>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {diff.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
