import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import RevealText from '@/components/motion/RevealText';
import { useHaptics } from '@/hooks/useHaptics';
import {
  Radar,
  Wrench,
  Plane,
  BadgeCheck,
  FileText,
  Scale,
  Users,
  BarChart3,
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
        title: 'Papelería, Cafetería y Aseo',
        description:
          'Tu puerta de entrada a la contratación pública. Procesos frecuentes y de entrada rápida, ideales para empezar en SECOP II. En subasta inversa el margen se gana en el costo, por eso analizo el precio antes de que te presentes. Te acompaño desde el primer pliego hasta la adjudicación.',
      },
      {
        icon: <Wrench className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Ferretería y Materiales',
        description:
          'Herramientas, materiales de construcción, eléctricos e iluminación (UNSPSC segmentos 27, 30, 31 y 39). Procesos frecuentes en alcaldías, gobernaciones y entidades nacionales.',
      },
    ],
  },
  {
    key: 'tecnologia',
    label: 'Tecnología',
    services: [
      {
        icon: <BarChart3 className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Licitaciones de Tecnología',
        description:
          'Software, hardware, infraestructura TI, telecomunicaciones. Procesos de alto valor con MinTIC, gobernaciones y entidades que requieren soluciones tecnológicas.',
      },
      {
        icon: <ShieldCheck className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Propuestas Técnicas Especializadas',
        description:
          'Estructuro la narrativa técnica y el cumplimiento de requerimientos funcionales que los evaluadores buscan en licitaciones de TI.',
      },
    ],
  },
  {
    key: 'tiquetes',
    label: 'Tiquetes Aéreos',
    services: [
      {
        icon: <Plane className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Tiquetes Aéreos y Turismo',
        description:
          'Suministro de tiquetes aéreos y servicios turísticos para entidades públicas (UNSPSC 78111500 y 90121500). Contratos recurrentes con ejecución por demanda.',
      },
      {
        icon: <BadgeCheck className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Requisitos del Sector',
        description:
          'Estos pliegos suelen exigir afiliación IATA, GDS, Registro Nacional de Turismo y certificaciones de aerolíneas. Verifico que cumplas antes de presentarte.',
      },
    ],
  },
  {
    key: 'obras',
    label: 'Obras Civiles',
    services: [
      {
        icon: <Scale className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Infraestructura y Construcción',
        description:
          'Vías, edificaciones, terminales, hospitales. Los contratos de mayor valor en SECOP. +$103.000 millones en experiencia participada en obras civiles.',
      },
      {
        icon: <FileText className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Consorcios y AIU Estratégico',
        description:
          'Formación de consorcios competitivos, estructuración de AIU, análisis de precios unitarios y presupuestos de obra para licitar con ventaja.',
      },
    ],
  },
  {
    key: 'estrategia',
    label: 'Estrategia',
    services: [
      {
        icon: <Users className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Evaluación Go / No-Go',
        description:
          'Análisis cuantitativo de cada licitación: probabilidad de éxito, competencia esperada y ROI estimado. Solo licitas donde puedes ganar.',
      },
      {
        icon: <FolderSearch className="h-7 w-7" strokeWidth={1.5} />,
        title: 'Análisis de Precios y Competencia',
        description:
          'Precios de referencia, históricos de adjudicación y competidores de tu sector. Estructuro ofertas económicas ganadoras.',
      },
    ],
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [activeTab, setActiveTab] = useState('suministros');
  const { haptic } = useHaptics();
  const active = CATEGORIES.find((c) => c.key === activeTab)!;

  return (
    <section id="servicios" ref={ref} className="bg-bg-alt py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <span className="eyebrow eyebrow-center mb-4">Nichos de Especialización</span>
          <h2 className="display-2 text-primary">
            <RevealText text="Suministros para empezar, tecnología y obras para escalar" />
          </h2>
          <p className="lede mt-4">
            Desde papelería, aseo, ferretería y tiquetes aéreos hasta contratos de infraestructura de miles de millones.
          </p>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mb-10 flex max-w-3xl flex-wrap justify-center gap-1 rounded-lg border border-border bg-white p-1"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                haptic('tick');
                setActiveTab(cat.key);
              }}
              className={`min-h-[44px] flex-auto rounded-md px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 sm:flex-1 sm:px-4 ${
                activeTab === cat.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:bg-bg-alt hover:text-primary'
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
                className="group card card-hover p-7"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                  {service.icon}
                </div>
                <h3 className="display-3 mb-2 text-primary">{service.title}</h3>
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
