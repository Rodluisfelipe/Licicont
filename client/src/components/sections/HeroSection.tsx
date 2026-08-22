import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, TrendingUp, FileCheck, BarChart3, MapPin, Compass } from 'lucide-react';

const ROTATING_WORDS = ['suministros', 'obras civiles', 'tecnología', 'papelería y aseo'];

const STATS = [
  { value: '+$200K', label: 'Millones COP en procesos', icon: <BarChart3 className="h-5 w-5" /> },
  { value: '+10', label: 'Años de experiencia', icon: <TrendingUp className="h-5 w-5" /> },
  { value: '+100', label: 'Procesos participados', icon: <FileCheck className="h-5 w-5" /> },
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

export default function HeroSection({ onContact }: { onContact: () => void }) {
  const word = useRotatingWord(ROTATING_WORDS);

  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-0 sm:pt-28">
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
            className="mb-5"
          >
            <span className="eyebrow eyebrow-center">
              <span className="sm:hidden">Suministros · Obras · Tecnología</span>
              <span className="hidden sm:inline">
                Especialista en suministros, obras civiles y tecnología
              </span>
            </span>
          </motion.div>

          {/* Headline with rotating word */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="display-1 text-primary"
          >
            Transformamos
            <br />
            <span className="relative inline-grid h-[1.2em] items-center overflow-hidden">
              {/* Invisible sizer — reserves width of longest word */}
              {ROTATING_WORDS.map((w) => (
                <span key={w} className="invisible col-start-1 row-start-1 text-gold" aria-hidden="true">
                  {w}
                </span>
              ))}
              <AnimatePresence mode="wait">
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: '30%', filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: '-30%', filter: 'blur(4px)' }}
                  transition={{ duration: 0.35 }}
                  className="col-start-1 row-start-1 text-gold"
                >
                  {word}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            en contratos ganados
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lede mx-auto mt-6 max-w-xl"
          >
            Te acompaño a venderle al Estado en SECOP II: papelería, cafetería, aseo,
            tecnología y obras civiles. +10 años, análisis financiero e IA propia — y
            cobro por resultado cuando ganas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => {
                const el = document.querySelector('#diagnostico');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-lg btn-primary magnetic-btn"
            >
              <Compass className="h-[18px] w-[18px]" />
              Descubre tu plan ideal
            </button>
            <button
              onClick={onContact}
              className="btn btn-lg btn-outline"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
              Hablar con Andrés
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-5 flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-border bg-white py-1.5 pr-4 pl-1.5 shadow-xs">
              <img
                src="/andres.jpeg"
                alt="Andrés Beltrán Mora"
                className="h-7 w-7 rounded-full object-cover"
                width="28"
                height="28"
              />
              <span className="text-xs font-medium text-text-secondary">
                Te responde <strong className="text-primary">Andrés Beltrán</strong>, no un bot
              </span>
            </div>
            <p className="text-xs text-text-light">
              Respuesta el mismo día · 6 preguntas · 45 segundos · sin registro
            </p>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <div className="card grid grid-cols-2 gap-y-7 bg-white/85 p-7 backdrop-blur-md sm:p-9 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center px-2 text-center ${
                  i < STATS.length - 1 ? 'lg:border-r lg:border-border' : ''
                }`}
              >
                <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold">
                  {stat.icon}
                </div>
                <p className="tnum text-2xl font-semibold text-primary sm:text-[1.75rem]">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-xs leading-snug text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
