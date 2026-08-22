import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, MessageCircle } from 'lucide-react';

const WA_LINK = 'https://wa.me/573023805967';

export default function FloatingCTA({ onContact }: { onContact: () => void }) {
  const [visible, setVisible] = useState(false);
  const [inDiagnostic, setInDiagnostic] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Dentro del diagnóstico el atajo sobra: se deja solo el canal de WhatsApp.
  useEffect(() => {
    const section = document.querySelector('#diagnostico');
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInDiagnostic(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 bottom-0 left-0 z-40 border-t border-border bg-white/90 px-4 py-3 backdrop-blur-lg md:hidden"
        >
          <div className="flex items-center gap-2">
            {!inDiagnostic && (
              <button
                onClick={() => {
                  const el = document.querySelector('#diagnostico');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="btn btn-primary flex-1 py-3.5"
              >
                <Compass className="h-5 w-5" />
                Descubre tu plan ideal
              </button>
            )}
            <button
              onClick={onContact}
              aria-label="Escríbeme por WhatsApp"
              className={`btn btn-whatsapp ${
                inDiagnostic ? 'flex-1 py-3.5' : 'h-[46px] w-[46px] shrink-0 gap-0 p-0'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              {inDiagnostic && 'Escríbeme por WhatsApp'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Escritorio: acceso permanente a WhatsApp sin tapar contenido */}
      {visible && (
        <motion.a
          key="wa-desktop"
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-label="Escríbeme por WhatsApp"
          className="btn btn-whatsapp group fixed right-6 bottom-6 z-40 hidden gap-0 rounded-full p-4 md:inline-flex"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:ml-2.5 group-hover:max-w-[11rem] group-hover:opacity-100">
            Escríbeme por WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
