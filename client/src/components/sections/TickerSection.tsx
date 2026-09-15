import { useRef } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { TrendingUp, FileCheck, Users, MapPin, BarChart3, Zap } from 'lucide-react';
import RevealText from '@/components/motion/RevealText';
import { DURATION, EASE_OUT } from '@/lib/easing';

interface MetricCardProps {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  icon: React.ReactNode;
  delay: number;
}

function MetricCard({ label, value, suffix, prefix = '', decimals = 0, icon, delay }: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const reduced = useReducedMotion();

  // La cifra se construye con el gesto: el número sube mientras la tarjeta
  // cruza la pantalla, no en una animación suelta al aparecer.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'center 55%'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });
  const counted = useTransform(smooth, [0, 1], [0, value]);
  const display = useTransform(counted, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString('es-CO')
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: DURATION.base, ease: EASE_OUT, delay: delay * 0.05 }}
      className="card card-hover p-6 text-center"
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
        {icon}
      </div>
      <div className="mb-1">
        <span className="text-lg font-semibold text-gold">{prefix}</span>
        <span className="tnum text-3xl font-semibold text-primary lg:text-[2.25rem]">
          {reduced ? (
            decimals > 0 ? value.toFixed(decimals) : value.toLocaleString('es-CO')
          ) : (
            <motion.span>{display}</motion.span>
          )}
        </span>
        <span className="ml-0.5 text-lg font-semibold text-gold">{suffix}</span>
      </div>
      <p className="text-sm text-text-secondary">{label}</p>
    </motion.div>
  );
}

const METRICS = [
  { label: 'Procesos Participados', value: 100, suffix: '+', icon: <FileCheck className="h-5 w-5" strokeWidth={1.5} /> },
  { label: 'Años de Experiencia', value: 10, suffix: '+', icon: <TrendingUp className="h-5 w-5" strokeWidth={1.5} /> },
  { label: 'Empresas Asesoradas', value: 50, suffix: '+', icon: <Users className="h-5 w-5" strokeWidth={1.5} /> },
  { label: 'COP en Procesos', value: 200, suffix: 'K M', prefix: '$', icon: <BarChart3 className="h-5 w-5" strokeWidth={1.5} /> },
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
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {METRICS.map((metric, i) => (
            <MetricCard key={metric.label} {...metric} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
