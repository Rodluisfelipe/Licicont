import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, TrendingUp, FileCheck, Users, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onRequestAccess: () => void;
}

const ROTATING_WORDS = ['licitaciones', 'adjudicaciones', 'subastas', 'concursos de méritos'];

const STATS = [
  { value: '+350', label: 'Contratos adjudicados', icon: <FileCheck className="h-5 w-5" /> },
  { value: '78%', label: 'Tasa de éxito', icon: <TrendingUp className="h-5 w-5" /> },
  { value: '+140', label: 'Empresas confían en nosotros', icon: <Users className="h-5 w-5" /> },
  { value: '32', label: 'Departamentos cubiertos', icon: <MapPin className="h-5 w-5" /> },
];

function useRotatingWord(words: string[], interval = 2800) {
  const [index, setIndex] = useState(0);
  const next = useCallback(() => setIndex((i) => (i + 1) % words.length), [words.length]);
  useEffect(() => {
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [next, interval]);
  return words[index];
}

export default function HeroSection({ onRequestAccess }: HeroSectionProps) {
  const word = useRotatingWord(ROTATING_WORDS);

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-0">
      {/* Background blurs */}
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
              Bróker de Licitaciones N.°1 en Colombia
            </span>
          </motion.div>

          {/* Headline with rotating word */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold leading-tight text-primary sm:text-5xl lg:text-6xl"
          >
            Transformamos{' '}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35 }}
                  className="inline-block text-gold"
                >
                  {word}
                </motion.span>
              </AnimatePresence>
            </span>
            <br className="hidden sm:block" />
            {' '}en contratos ganados
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary"
          >
            Monitoreamos, preparamos y acompañamos cada propuesta desde el análisis 
            hasta la adjudicación. Su empresa compite — nosotros nos aseguramos de que gane.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onRequestAccess}
              className="magnetic-btn group flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-gold/25 transition-all hover:bg-gold-dark hover:shadow-xl hover:shadow-gold/30 hover:scale-[1.03]"
            >
              Solicitar Acceso
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => {
                const el = document.querySelector('#proceso');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full border border-border px-8 py-3.5 text-base font-semibold text-primary transition-all hover:border-gold/50 hover:bg-bg-alt"
            >
              ¿Cómo funciona?
            </button>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-white/80 p-6 shadow-lg backdrop-blur-md sm:p-8 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center ${
                  i < STATS.length - 1 ? 'lg:border-r lg:border-border' : ''
                }`}
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-primary sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-text-secondary sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
