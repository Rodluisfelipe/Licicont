import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { TrendingUp, FileCheck, Users, MapPin, BarChart3, Zap } from 'lucide-react';

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
  const animatedValue = useAnimatedCounter({
    end: isInView ? value : 0,
    duration: 2500,
    decimals,
    delay: delay * 150,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay * 0.08 }}
      className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
    >
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
        {icon}
      </div>
      <div className="mb-1">
        <span className="text-sm text-gold">{prefix}</span>
        <span className="text-3xl font-bold tabular-nums text-primary lg:text-4xl">
          {decimals > 0 ? animatedValue.toFixed(decimals) : animatedValue.toLocaleString()}
        </span>
        <span className="ml-0.5 text-sm font-semibold text-gold">{suffix}</span>
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
    <section id="resultados" ref={ref} className="bg-bg-alt py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
            Resultados Comprobados
          </span>
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Números que respaldan mi trabajo
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary lg:text-lg">
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
