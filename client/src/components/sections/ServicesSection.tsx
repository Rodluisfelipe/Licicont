import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Radar,
  FileText,
  Scale,
  Users,
  BarChart3,
  GraduationCap,
  FolderSearch,
  ShieldCheck,
} from 'lucide-react';

const CATEGORIES = [
  {
    key: 'inteligencia',
    label: 'Inteligencia',
    services: [
      {
        icon: <Radar className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Monitoreo de Licitaciones',
        description:
          'Rastreamos SECOP I y II en tiempo real, filtrando por sector, entidad y presupuesto. Alertas diarias con oportunidades relevantes.',
      },
      {
        icon: <FolderSearch className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Análisis de Competencia',
        description:
          'Inteligencia sobre adjudicaciones históricas, precios de referencia y probabilidad real de ganar cada proceso.',
      },
    ],
  },
  {
    key: 'propuestas',
    label: 'Propuestas',
    services: [
      {
        icon: <FileText className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Preparación de Propuestas',
        description:
          'Estructuramos su propuesta completa: documentación técnica, financiera y narrativa estratégica diferenciadora.',
      },
      {
        icon: <BarChart3 className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Evaluación Go / No-Go',
        description:
          'Análisis cuantitativo de cada licitación: probabilidad de éxito, competencia esperada y ROI estimado.',
      },
    ],
  },
  {
    key: 'juridico',
    label: 'Jurídico',
    services: [
      {
        icon: <Scale className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Revisión Jurídica',
        description:
          'Revisión legal de cada pliego, identificación de riesgos, preparación de impugnaciones y cumplimiento normativo.',
      },
      {
        icon: <ShieldCheck className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Gestión Documental',
        description:
          'RUP, certificaciones, pólizas y documentación actualizada. Navegamos SECOP II por usted.',
      },
    ],
  },
  {
    key: 'alianzas',
    label: 'Alianzas',
    services: [
      {
        icon: <Users className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Formación de Consorcios',
        description:
          'Conectamos con socios estratégicos para formar consorcios y uniones temporales competitivas.',
      },
      {
        icon: <GraduationCap className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Capacitación Continua',
        description:
          'Talleres de estrategia, actualizaciones normativas y coaching para que su equipo licite con autonomía.',
      },
    ],
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [activeTab, setActiveTab] = useState('inteligencia');
  const active = CATEGORIES.find((c) => c.key === activeTab)!;

  return (
    <section id="servicios" ref={ref} className="bg-bg-alt py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Todo lo que necesita para ganar licitaciones
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary lg:text-lg">
            Desde la identificación de la oportunidad hasta la adjudicación del contrato.
          </p>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mb-10 flex max-w-lg flex-wrap justify-center gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                activeTab === cat.key
                  ? 'bg-gold text-white shadow-md shadow-gold/25'
                  : 'bg-white text-text-secondary border border-border hover:border-gold/30 hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2"
          >
            {active.services.map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-border bg-white p-7 shadow-sm transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                  {service.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-primary">{service.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {service.description}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
