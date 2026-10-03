import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { TrendingUp, FileCheck, Users, MapPin, BarChart3, Zap } from 'lucide-react';
import RevealText from '@/components/motion/RevealText';
import { DURATION, EASE_OUT } from '@/lib/easing';

interface MetricCardProps {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  /** Cifra larga: tipografía un punto más pequeña para que quepa en la tarjeta. */
  compact?: boolean;
  icon: React.ReactNode;
  delay: number;
}

const format = (v: number) => Math.round(v).toLocaleString('es-CO');

function MetricCard({ label, value, suffix, prefix = '', compact, icon, delay }: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const reduced = useReducedMotion();

  // El HTML trae la cifra final: así la leen buscadores, lectores de pantalla
  // y cualquiera sin JavaScript. Solo si la tarjeta aún está fuera de pantalla
  // al cargar, se pone en cero para contar hasta el valor cuando aparezca.
  const numRef = useRef<HTMLSpanElement>(null);
  const armed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const num = numRef.current;
    if (reduced || !el || !num) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) {
      armed.current = true;
      num.textContent = format(0);
    }
  }, [reduced]);

  useEffect(() => {
    const num = numRef.current;
    if (!isInView || !armed.current || !num) return;
    armed.current = false;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (v) => {
        num.textContent = format(v);
      },
    });
    return () => {
      controls.stop();
      num.textContent = format(value);
    };
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: DURATION.base, ease: EASE_OUT, delay: delay * 0.05 }}
      className="card card-hover min-w-0 px-3 py-5 text-center sm:p-6"
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
        {icon}
      </div>
      <div className="mb-1">
        <span className={`font-semibold text-gold ${compact ? 'text-base sm:text-lg' : 'text-lg'}`}>{prefix}</span>
        <span
          className={`tnum font-semibold text-primary ${
            compact ? 'text-xl min-[400px]:text-2xl xl:text-[1.6rem]' : 'text-3xl lg:text-[2.25rem]'
          }`}
        >
          <span ref={numRef}>{format(value)}</span>
        </span>
        <span className="ml-0.5 text-lg font-semibold text-gold">{suffix}</span>
      </div>
      <p className="text-[13px] leading-snug text-balance break-words hyphens-auto text-text-secondary sm:text-sm" lang="es">{label}</p>
    </motion.div>
  );
}

const METRICS = [
  { label: 'Procesos Participados', value: 100, suffix: '+', icon: <FileCheck className="h-5 w-5" strokeWidth={1.5} /> },
  { label: 'Años de Experiencia', value: 10, suffix: '+', icon: <TrendingUp className="h-5 w-5" strokeWidth={1.5} /> },
  { label: 'Empresas Asesoradas', value: 50, suffix: '+', icon: <Users className="h-5 w-5" strokeWidth={1.5} /> },
  { label: 'millones COP en procesos', value: 200000, suffix: '', prefix: '+$', compact: true, icon: <BarChart3 className="h-5 w-5" strokeWidth={1.5} /> },
  { label: 'Licitaciones Analizadas/Año', value: 5000, suffix: '+', icon: <Zap className="h-5 w-5" strokeWidth={1.5} /> },
  { label: 'Departamentos Cubiertos', value: 32, suffix: '/32', icon: <MapPin className="h-5 w-5" strokeWidth={1.5} /> },
];

export default function TickerSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="resultados" ref={ref} className="bg-bg-alt py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="eyebrow eyebrow-center mb-4">Resultados Comprobados</span>
          <h2 className="display-2 text-primary">
            <RevealText text="Números que respaldan mi trabajo" />
          </h2>
          <p className="lede mt-4">
            Más de una década ayudando a empresas colombianas a ganar procesos de contratación estatal.
          </p>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-6">
          {METRICS.map((metric, i) => (
            <MetricCard key={metric.label} {...metric} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
