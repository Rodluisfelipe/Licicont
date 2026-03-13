import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';

const WA_URL = `https://wa.me/573023805967?text=${encodeURIComponent('Hola Andrés, me interesa una asesoría en licitaciones públicas. ¿Podemos hablar?')}`;

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5" />
            Escríbeme por WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
