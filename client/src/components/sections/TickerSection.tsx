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
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay * 0.05 }}
      className="card card-hover p-6 text-center"
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
        {icon}
      </div>
      <div className="mb-1">
        <span className="font-display text-lg text-gold">{prefix}</span>
        <span className="font-display tnum text-3xl font-semibold text-primary lg:text-[2.25rem]">
          {decimals > 0 ? animatedValue.toFixed(decimals) : animatedValue.toLocaleString('es-CO')}
        </span>
        <span className="font-display ml-0.5 text-lg font-semibold text-gold">{suffix}</span>
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
            Números que respaldan mi trabajo
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
