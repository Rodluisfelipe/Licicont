import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { Search, Crosshair, FileCheck, Trophy } from 'lucide-react';
import RevealText from '@/components/motion/RevealText';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { DURATION, EASE_OUT, SCROLL_SPRING } from '@/lib/easing';

const STEPS = [
  {
    num: '01',
    icon: <Search className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Diagnóstico',
    description:
      'Evaluamos tu empresa: experiencia, RUP, capacidad financiera, equipo y sectores de interés. Definimos tu perfil competitivo.',
    tags: ['Análisis de capacidad', 'Revisión RUP', 'Perfil competitivo'],
  },
  {
    num: '02',
    icon: <Crosshair className="h-7 w-7" strokeWidth={1.5} />,
    title: 'Inteligencia',
    description:
      'Identificamos licitaciones alineadas con tu perfil. Analizamos competencia y precios de referencia. Decisión conjunta: Go o No-Go.',
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
      'Acompañamos post-entrega: subsanaciones, aclaraciones, audiencias. Defendemos tu propuesta hasta lograr la adjudicación.',
    tags: ['Subsanaciones', 'Seguimiento', 'Defensa evaluadores'],
  },
];

function StepCard({ step, active }: { step: (typeof STEPS)[number]; active?: boolean }) {
  return (
    <article
      className={`card flex w-full flex-col p-8 transition-colors duration-500 lg:w-[26rem] ${
        active ? 'border-gold/45' : ''
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-500 ${
            active ? 'bg-primary text-white' : 'bg-primary/[0.06] text-primary'
          }`}
        >
          {step.icon}
        </span>
        <span className="tnum text-[2.5rem] leading-none font-bold text-border-strong">
          {step.num}
        </span>
      </div>

      <h3 className="display-3 mb-2.5 text-primary">{step.title}</h3>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-text-secondary">
        {step.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {step.tags.map((tag) => (
          <span
            key={tag}
            className="rounded border border-border bg-bg-alt px-2 py-0.5 text-[11px] font-medium text-text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

/** Cierre del recorrido: después de ver las cuatro fases, la invitación. */
function ClosingPanel() {
  return (
    <article className="relative flex w-full flex-col justify-center overflow-hidden rounded-lg border border-gold/25 bg-primary p-9 lg:w-[24rem]">
      <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <span className="eyebrow eyebrow-light mb-4">Tu turno</span>
        <h3 className="display-3 text-white">¿En qué fase estás hoy?</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          El diagnóstico te ubica en el proceso y te dice con qué servicio empezar.
        </p>
        <button
          type="button"
          onClick={() =>
            document
              .querySelector('#diagnostico')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          className="btn btn-primary mt-7"
        >
          Hacer el diagnóstico
        </button>
      </div>
    </article>
  );
}

export default function ProcessSection() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const horizontal = isDesktop && !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  // Fuera del modo horizontal no hay recorrido que consumir.
  const distance = horizontal ? measured : 0;

  // El recorrido horizontal define cuánto scroll vertical necesita la sección,
  // de modo que la velocidad se sienta 1:1 con el gesto del usuario.
  useEffect(() => {
    if (!horizontal) return;

    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setMeasured(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    // El observador emite una primera medición al empezar a observar.
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [horizontal]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const rawX = useTransform(scrollYProgress, [0.08, 0.95], [0, -distance]);
  const x = useSpring(rawX, SCROLL_SPRING);
  const progress = useTransform(scrollYProgress, [0.08, 0.95], ['0%', '100%']);

  useEffect(() => {
    if (!horizontal) return;
    return scrollYProgress.on('change', (v) => {
      const p = Math.min(0.999, Math.max(0, (v - 0.08) / 0.87));
      setActiveStep(Math.floor(p * STEPS.length));
    });
  }, [scrollYProgress, horizontal]);

  const header = (
    <div className="max-w-xl">
      <span className="eyebrow mb-4">Metodología</span>
      <h2 className="display-2 text-primary">
        <RevealText text="De la oportunidad al contrato firmado" />
      </h2>
      <p className="lede mt-4">
        El mismo método en más de 100 procesos participados. Cuatro fases que maximizan
        tu probabilidad de ganar.
      </p>
    </div>
  );

  // ── Móvil y movimiento reducido: apilado convencional ──
  if (!horizontal) {
    return (
      <section id="proceso" ref={sectionRef} className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">{header}</div>
          <div className="grid gap-5 sm:grid-cols-2">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: DURATION.base, ease: EASE_OUT, delay: i * 0.06 }}
              >
                <StepCard step={step} />
              </motion.div>
            ))}
          </div>
          <div className="mt-5">
            <ClosingPanel />
          </div>
        </div>
      </section>
    );
  }

  // ── Escritorio: la sección se ancla y las fases desfilan de lado ──
  return (
    <section
      id="proceso"
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="flex items-end justify-between gap-10 pb-9">
            {header}

            {/* Progreso del recorrido */}
            <div className="w-56 shrink-0">
              <div className="mb-2.5 flex items-center justify-between text-xs font-medium text-text-light">
                <span className="tnum">
                  {String(Math.min(activeStep + 1, STEPS.length)).padStart(2, '0')}
                </span>
                <span className="tnum">{STEPS.length.toString().padStart(2, '0')}</span>
              </div>
              <div className="h-px w-full bg-border">
                <motion.div className="h-full bg-gold" style={{ width: progress }} />
              </div>
              <p className="mt-3 text-xs text-text-light">Desplázate para recorrer las fases</p>
            </div>
          </div>
        </div>

        <div ref={viewportRef} className="w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max items-stretch gap-6 px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
          >
            {STEPS.map((step, i) => (
              <StepCard key={step.num} step={step} active={i === activeStep} />
            ))}
            <ClosingPanel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
