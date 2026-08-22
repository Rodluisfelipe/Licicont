import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, MessageCircle } from 'lucide-react';

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
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/90 px-4 py-3 backdrop-blur-lg md:hidden"
        >
          <div className="flex items-center gap-2">
            {!inDiagnostic && (
              <button
                onClick={() => {
                  const el = document.querySelector('#diagnostico');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
              >
                <Compass className="h-5 w-5" />
                Descubre tu plan ideal
              </button>
            )}
            <button
              onClick={onContact}
              aria-label="Escríbeme por WhatsApp"
              className={`flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white shadow-lg transition-all active:scale-[0.98] ${
                inDiagnostic
                  ? 'flex-1 py-3.5 text-sm font-semibold'
                  : 'h-[46px] w-[46px] shrink-0'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              {inDiagnostic && 'Escríbeme por WhatsApp'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
