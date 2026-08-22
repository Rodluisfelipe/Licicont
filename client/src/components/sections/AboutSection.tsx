import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { CheckCircle, ChevronDown, Compass, MessageCircle } from 'lucide-react';

/** Credenciales de un vistazo, antes de que nadie lea un párrafo. */
const CREDENTIALS = [
  { value: '+$200.000M', label: 'en procesos participados' },
  { value: '10 años', label: 'en contratación estatal' },
  { value: '5 nichos', label: 'de especialización' },
];

const EXPERTISE = [
  'Licitar en papeler\u00eda, cafeter\u00eda y aseo',
  'Ganar contratos de tecnolog\u00eda y software',
  'Competir en obras civiles e infraestructura',
  'Analizar pliegos de condiciones',
  'Estructurar ofertas econ\u00f3micas ganadoras',
  'Ejecutar y liquidar contratos a satisfacci\u00f3n',
];

export default function AboutSection({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="sobre-mi" ref={ref} className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center lg:sticky lg:top-24"
          >
            <div className="relative w-72 lg:w-80">
              {/* Gold premium frame */}
              <div className="rounded-2xl bg-gradient-to-br from-gold via-gold-light to-gold-dark p-[3px] shadow-xl shadow-gold/20">
                <div className="rounded-[13px] bg-gradient-to-br from-gold-dark/20 via-transparent to-gold/20 p-[3px]">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src="/andres.jpeg"
                      alt="Andrés Beltrán Mora — Especialista en Licitaciones Públicas y Contratación Estatal en Colombia"
                      className="h-auto w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width="320"
                      height="400"
                    />
                  </div>
                </div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-5 left-4 right-4 rounded-xl border border-gold/20 bg-white/95 p-4 shadow-lg backdrop-blur-md">
                <p className="text-sm font-bold text-primary">Andrés Beltrán Mora</p>
                <p className="text-xs text-text-secondary">Especialista en Licitaciones Públicas & Contratación Estatal</p>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="mb-4 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
              Sobre Mí
            </span>
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              Más de una década ganando{' '}
              <span className="text-gold">licitaciones públicas</span>
            </h2>

            {/* Credenciales rápidas */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {CREDENTIALS.map((c) => (
                <div key={c.label} className="rounded-xl border border-border bg-bg-alt px-3 py-3 text-center">
                  <p className="text-base font-bold text-gold-dark sm:text-lg">{c.value}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-text-secondary">{c.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-text-secondary">
              <p>
                Desde 2015 descubrí mi pasión por la contratación pública y desde entonces he construido
                una trayectoria enfocada en comprender, estructurar y ganar procesos licitatorios con el Estado colombiano.
              </p>
              <p>
                Durante más de <strong className="text-primary">6 años en el sector de obras civiles</strong>, participé
                en procesos que lograron la adjudicación de proyectos de gran impacto: la <strong className="text-primary">Nueva Terminal
                de Transporte de Tunja</strong>, el <strong className="text-primary">Parque Agroalimentario de Tunja</strong>{' '}
                con la Gobernación de Boyacá, y el <strong className="text-primary">Hospital de Perros y Gatos de Bogotá</strong>{' '}
                con la Secretaría Distrital — sumando aproximadamente <strong className="text-primary">$103.000 millones</strong> en contratación pública.
              </p>
            </div>

            {/* Trayectoria completa — a un clic, sin muro de texto */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-4 text-base leading-relaxed text-text-secondary">
              <p>
                Posteriormente amplié mi experiencia al <strong className="text-primary">sector de suministros</strong>:{' '}
                <strong className="text-primary">papelería, cafetería, aseo y tecnología</strong> — donde llevo más de 4 años participando en procesos
                que también superan los <strong className="text-primary">$100.000 millones</strong> en contratos. Estos nichos son la puerta de entrada
                perfecta para empresas que quieren empezar en SECOP de forma segura.
              </p>
              <p>
                Hoy me especializo en <strong className="text-primary">5 nichos clave</strong>: papelería, cafetería, aseo,
                tecnología y obras civiles. Integro <strong className="text-primary">Inteligencia Artificial</strong>{' '}
                al análisis de pliegos y la estructuración de propuestas. Mi enfoque no es vender cursos grabados:
                es <strong className="text-primary">acompañarte con casos reales, paso a paso</strong>, hasta que ganes.
              </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark transition-colors hover:text-gold"
            >
              {expanded ? 'Ver menos' : 'Leer mi trayectoria completa'}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>

            {/* What you'll learn */}
            <div className="mt-7 rounded-2xl border border-border bg-bg-alt p-5">
              <p className="mb-4 text-sm font-semibold text-primary">En mis asesorías aprenderás a:</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {EXPERTISE.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  document
                    .querySelector('#diagnostico')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-gold/25 transition-all hover:bg-gold-dark hover:shadow-xl"
              >
                <Compass className="h-5 w-5" />
                Ver qué servicio me corresponde
              </button>
              <button
                onClick={onContact}
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-semibold text-primary transition-all hover:border-gold/50 hover:bg-bg-alt"
              >
                <MessageCircle className="h-5 w-5" />
                Hablemos
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
