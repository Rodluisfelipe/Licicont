import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    question: '¿Qué es un Bróker de Licitaciones?',
    answer:
      'Un bróker de licitaciones es un intermediario especializado que gestiona todo el ciclo de contratación pública por ti: identifica oportunidades en SECOP I y II, prepara las propuestas, realiza la revisión jurídica y acompaña el proceso hasta la adjudicación. Tú te enfocas en ejecutar, yo me encargo de que ganes.',
  },
  {
    question: '¿Qué tipo de empresas pueden contratar sus servicios?',
    answer:
      'Trabajo con MiPymes, medianas empresas y contratistas enfocados en 5 nichos clave: papelería, cafetería, aseo, tecnología y obras civiles. Si tu empresa vende suministros o ejecuta proyectos de infraestructura o TI, puedo ayudarte a ganar contratos con el Estado.',
  },
  {
    question: '¿Cuánto cuesta el servicio?',
    answer:
      'Manejo un modelo flexible basado en asesorías personalizadas. Cada caso es diferente, por eso evalúo tu perfil antes de proponer un plan. Escríbeme por WhatsApp para recibir una propuesta a tu medida.',
  },
  {
    question: '¿Por qué empezar con papelería, cafetería o aseo?',
    answer:
      'Los contratos de suministros como papelería, cafetería y aseo son la puerta de entrada perfecta a la contratación estatal. Son procesos de menor cuantía, con requisitos más simples y competencia manejable. Te permiten acumular experiencia en SECOP y escalar a contratos de tecnología u obras civiles donde están las comisiones grandes.',
  },
  {
    question: '¿En qué regiones de Colombia operan?',
    answer:
      'Tengo cobertura en los 32 departamentos de Colombia. Monitoreo procesos de alcaldías, gobernaciones, ministerios, institutos y entidades descentralizadas de todo el territorio nacional a través de SECOP I y II.',
  },
  {
    question: '¿Cómo empiezo a trabajar con LICICONT?',
    answer:
      'Escríbeme por WhatsApp al +57 302 380 5967. Te contactaré para una reunión de diagnóstico gratuita donde evaluaremos juntos tu potencial en contratación estatal y diseñaremos una estrategia a tu medida.',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white transition-all duration-300 hover:border-gold/30">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="pr-4 text-sm font-semibold text-primary sm:text-base">{question}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-alt text-text-secondary transition-colors">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className="bg-bg-alt py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            ¿Tiene preguntas? Tenemos respuestas
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-3"
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
