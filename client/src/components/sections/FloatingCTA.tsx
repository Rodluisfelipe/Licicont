import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send } from 'lucide-react';

interface FloatingCTAProps {
  onRequestAccess: () => void;
}

export default function FloatingCTA({ onRequestAccess }: FloatingCTAProps) {
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
          <button
            onClick={onRequestAccess}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
          >
            <Send className="h-4 w-4" />
            Solicitar Acceso Exclusivo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
