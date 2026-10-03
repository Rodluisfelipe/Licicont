import { useRef, useState } from 'react';
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import RevealText from '@/components/motion/RevealText';
import { useHaptics } from '@/hooks/useHaptics';
import SnapCarousel from '@/components/motion/SnapCarousel';
import { DURATION, EASE_OUT } from '@/lib/easing';
import {
  Check,
  ChevronDown,
  Compass,
  HandCoins,
  Lock,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
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
  ShieldCheck,
  HandCoins,
};

function DetailList({
  title,
  items,
  featured,
}: {
  title: string;
  items: string[];
  featured: boolean;
}) {
  return (
    <>
      <p className={`mt-5 text-sm font-semibold ${featured ? 'text-white' : 'text-primary'}`}>
        {title}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className={`flex gap-2.5 text-sm leading-relaxed ${
              featured ? 'text-white/75' : 'text-text-secondary'
            }`}
          >
            <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function PlanCard({
  service,
  delay,
  column,
}: {
  service: Service;
  delay: number;
  /** Posición en la fila: desfasa la columna para dar profundidad. */
  column: number;
}) {
  const [open, setOpen] = useState(false);
  const featured = Boolean(service.featured);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { haptic } = useHaptics();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const drift = useSpring(
    useTransform(scrollYProgress, [0, 1], [column * 26, column * -26]),
    { stiffness: 110, damping: 30, restDelta: 0.001 }
  );

  return (
    <motion.div
      ref={cardRef}
      style={reduced ? undefined : { y: drift }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: DURATION.base, ease: EASE_OUT, delay }}
      className={`flex w-full flex-col rounded-lg border p-7 transition-all duration-300 ${
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
            className={`rounded border px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase ${
              featured
                ? 'border-gold/60 bg-gold/15 text-gold-light'
                : 'border-gold/30 text-gold-dark'
            }`}
          >
            {service.badge}
          </span>
        )}
      </div>

      <p
        className={`text-[13px] font-medium ${
          featured ? 'text-gold-light/85' : 'text-gold-dark/85'
        }`}
      >
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
        <p
          className={`tnum text-lg font-semibold ${
            featured ? 'text-gold-light' : 'text-primary'
          }`}
        >
          {service.price}
        </p>
        {service.priceNote && (
          <p className={`mt-0.5 text-xs ${featured ? 'text-white/50' : 'text-text-light'}`}>
            {service.priceNote}
          </p>
        )}
      </div>

      {/* Qué incluye */}
      <p
        className={`mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase ${
          featured ? 'text-white/50' : 'text-text-light'
        }`}
      >
        {service.includesTitle ?? 'Incluye'}
      </p>
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

            {service.priceTables?.map((table) => (
              <div key={table.title} className="mt-5">
                <p className={`text-sm font-semibold ${featured ? 'text-white' : 'text-primary'}`}>
                  {table.title}
                </p>
                {table.note && (
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      featured ? 'text-white/60' : 'text-text-secondary'
                    }`}
                  >
                    {table.note}
                  </p>
                )}
                <dl
                  className={`mt-2.5 divide-y rounded-lg border text-xs ${
                    featured ? 'divide-white/10 border-white/15' : 'divide-border border-border'
                  }`}
                >
                  {table.rows.map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between gap-3 px-3 py-2">
                      <dt className={featured ? 'text-white/70' : 'text-text-secondary'}>
                        {row.label}
                      </dt>
                      <dd
                        className={`tnum shrink-0 font-semibold ${
                          featured ? 'text-gold-light' : 'text-primary'
                        }`}
                      >
                        {row.price}
                      </dd>
                    </div>
                  ))}
                </dl>
                {table.footnotes?.map((note) => (
                  <p
                    key={note}
                    className={`mt-1.5 text-xs leading-relaxed ${
                      featured ? 'text-white/55' : 'text-text-light'
                    }`}
                  >
                    {note}
                  </p>
                ))}
              </div>
            ))}

            {service.extra && (
              <DetailList title={service.extra.title} items={service.extra.items} featured={featured} />
            )}

            {service.conditions && (
              <DetailList title="Condiciones" items={service.conditions} featured={featured} />
            )}

            {service.notIncludes.length > 0 && (
              <>
                <p
                  className={`mt-5 text-sm font-semibold ${featured ? 'text-white' : 'text-primary'}`}
                >
                  No incluye
                </p>
                <ul className="mt-2 space-y-2">
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
              </>
            )}

            <div
              className={`mt-4 border-l-2 border-gold py-1 pl-3 text-xs leading-relaxed ${
                featured ? 'text-white/60' : 'text-text-secondary'
              }`}
            >
              <span className="font-semibold text-gold-dark">
                {service.id === 'proceso' ? 'Forma de pago: ' : 'Modelo de cobro: '}
              </span>
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
        onClick={() => {
          haptic('tick');
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        className={`-mx-2 mt-2 mb-5 inline-flex min-h-[44px] items-center gap-1 self-start px-2 text-xs font-semibold transition-colors ${
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
        className={`btn mt-auto ${featured ? 'btn-primary' : 'btn-outline'}`}
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
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <span className="eyebrow eyebrow-center mb-4">El menú completo</span>
          <h2 className="display-2 text-primary">
            <RevealText text="Cuatro formas de trabajar conmigo" />
          </h2>
          <p className="lede mt-4">
            Desde dejar tu RUP en regla hasta que yo licite contigo cada mes. Cada
            servicio dice qué incluye, qué no y cuánto cuesta.
          </p>

          <p className="mx-auto mt-5 flex max-w-xl items-start gap-2.5 rounded-lg border border-gold/30 bg-white px-4 py-3 text-left text-sm leading-relaxed text-text-secondary">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            <span>
              Antes de empezar firmamos acuerdo de confidencialidad y de prestación de
              servicios. Tu información de costos, precios y proveedores no sale de aquí.
            </span>
          </p>

          <a
            href="#diagnostico"
            className="btn btn-outline mt-7 text-gold-dark hover:text-primary"
          >
            <Compass className="h-4 w-4" />
            ¿No sabes cuál? Haz el diagnóstico
          </a>
        </motion.div>

        {/* Escritorio: rejilla · Móvil: carrusel con parada en cada tarjeta */}
        <div className="mx-auto max-w-5xl">
          <SnapCarousel
            labels={SERVICES.map((s) => `Ver ${s.name}`)}
            desktopClassName="md:grid md:grid-cols-2 md:items-start md:gap-6 md:overflow-visible md:px-0"
          >
            {SERVICES.map((service, i) => (
              <PlanCard
                key={service.id}
                service={service}
                delay={(i % 2) * 0.08}
                column={i % 2}
              />
            ))}
          </SnapCarousel>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-text-light">
          Valores en pesos colombianos. Abre “Ver detalle completo” en cada servicio para
          ver precios por modalidad, condiciones y lo que no incluye.
        </p>

        {/* Diferenciadores */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <div className="mb-10 text-center">
            <span className="eyebrow eyebrow-center mb-3">La diferencia</span>
            <h3 className="display-2 text-primary">Por qué Licicont y no otro</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
            {DIFFERENTIATORS.map((diff) => {
              const Icon = DIFF_ICONS[diff.icon];
              return (
                <div
                  key={diff.title}
                  className="card card-hover flex items-start gap-4 p-5 sm:block sm:p-6"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold sm:mb-4 sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h4 className="mb-1.5 text-[15px] font-semibold text-primary sm:mb-2 sm:text-base">
                      {diff.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {diff.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
