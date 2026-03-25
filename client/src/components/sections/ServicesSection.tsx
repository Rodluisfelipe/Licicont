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
    key: 'suministros',
    label: 'Suministros',
    services: [
      {
        icon: <Radar className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Papeleria, Cafeteria y Aseo',
        description:
          'Tu puerta de entrada a la contratacion publica. Nichos simples, de bajo riesgo, ideales para empezar en SECOP II. Te acompaño desde el primer pliego hasta la adjudicacion.',
      },
      {
        icon: <FolderSearch className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Analisis de Precios y Competencia',
        description:
          'Inteligencia sobre precios de referencia, historicos de adjudicacion y competidores en suministros. Estructuramos ofertas economicas ganadoras.',
      },
    ],
  },
  {
    key: 'tecnologia',
    label: 'Tecnologia',
    services: [
      {
        icon: <BarChart3 className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Licitaciones de Tecnologia',
        description:
          'Software, hardware, infraestructura TI, telecomunicaciones. Procesos de alto valor con MinTIC, gobernaciones y entidades que requieren soluciones tecnologicas.',
      },
      {
        icon: <ShieldCheck className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Propuestas Tecnicas Especializadas',
        description:
          'Estructuramos la narrativa tecnica y el cumplimiento de requerimientos funcionales que los evaluadores buscan en licitaciones de TI.',
      },
    ],
  },
  {
    key: 'obras',
    label: 'Obras Civiles',
    services: [
      {
        icon: <Scale className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Infraestructura y Construccion',
        description:
          'Vias, edificaciones, terminales, hospitales. Los contratos de mayor valor en SECOP. +$103.000 millones en experiencia participada en obras civiles.',
      },
      {
        icon: <FileText className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Consorcios y AIU Estrategico',
        description:
          'Formacion de consorcios competitivos, estructuracion de AIU, analisis de precios unitarios y presupuestos de obra para licitar con ventaja.',
      },
    ],
  },
  {
    key: 'estrategia',
    label: 'Estrategia',
    services: [
      {
        icon: <Users className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Evaluacion Go / No-Go',
        description:
          'Analisis cuantitativo de cada licitacion: probabilidad de exito, competencia esperada y ROI estimado. Solo licitas donde puedes ganar.',
      },
      {
        icon: <GraduationCap className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Mentoria y Capacitacion',
        description:
          'Acompañamiento personalizado con casos reales. Te enseño paso a paso a identificar, analizar, estructurar y ganar licitaciones en SECOP II.',
      },
    ],
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [activeTab, setActiveTab] = useState('suministros');
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
            Nichos de Especializacion
          </span>
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Suministros para empezar, tecnologia y obras para escalar
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary lg:text-lg">
            Desde papeleria y aseo hasta contratos de infraestructura de miles de millones.
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
