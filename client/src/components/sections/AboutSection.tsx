import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Award, Building2, Brain, CheckCircle, MessageCircle } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: <Award className="h-5 w-5" />, label: '+10 años dedicado a licitaciones públicas' },
  { icon: <Building2 className="h-5 w-5" />, label: '+$200.000M COP en procesos participados' },
  { icon: <Brain className="h-5 w-5" />, label: 'Inteligencia Artificial aplicada a SECOP II' },
];

const EXPERTISE = [
  'Identificar oportunidades en SECOP II',
  'Analizar pliegos de condiciones',
  'Cumplir requisitos habilitantes y financieros',
  'Estructurar ofertas competitivas',
  'Presentar propuestas estratégicas',
  'Ejecutar y liquidar contratos a satisfacción',
];

export default function AboutSection({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="sobre-mi" ref={ref} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 lg:w-80">
              {/* Gold premium frame */}
              <div className="rounded-2xl bg-gradient-to-br from-gold via-gold-light to-gold-dark p-[3px] shadow-xl shadow-gold/20">
                <div className="rounded-[13px] bg-gradient-to-br from-gold-dark/20 via-transparent to-gold/20 p-[3px]">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src="/andres.jpeg"
                      alt="Andrés Beltrán Mora — Especialista en Licitaciones Públicas"
                      className="h-auto w-full object-cover"
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
              <p>
                Posteriormente amplié mi experiencia al <strong className="text-primary">sector de suministros</strong>{' '}
                — tecnología, aseo, cafetería, papelería — donde llevo más de 4 años participando en procesos
                que también superan los <strong className="text-primary">$100.000 millones</strong> en contratos.
              </p>
              <p>
                Hoy trabajo de forma independiente integrando <strong className="text-primary">Inteligencia Artificial</strong>{' '}
                al análisis de pliegos y la estructuración de propuestas. Mi enfoque no es vender cursos grabados:
                es <strong className="text-primary">acompañarte con casos reales, paso a paso</strong>, hasta que ganes.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-8 space-y-3">
              {HIGHLIGHTS.map((h) => (
                <div key={h.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    {h.icon}
                  </div>
                  <span className="text-sm font-medium text-primary">{h.label}</span>
                </div>
              ))}
            </div>

            {/* What you'll learn */}
            <div className="mt-8 rounded-2xl border border-border bg-bg-alt p-6">
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
            <div className="mt-8">
              <button
                onClick={onContact}
                className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-gold/25 transition-all hover:bg-gold-dark hover:shadow-xl"
              >
                <MessageCircle className="h-5 w-5" />
                Hablemos por WhatsApp
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
