import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MessageCircle } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Sobre Mí', href: '#sobre-mi' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Preguntas', href: '#faq' },
];

export default function Navbar({ onContact }: { onContact: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min(window.scrollY / docH, 1) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 shadow-md backdrop-blur-lg'
            : 'bg-white'
        }`}
      >
        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-transparent">
          <motion.div
            className="h-full bg-gold"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 no-underline">
            <img src="/logo.jpeg" alt="LICICONT" className="h-20 w-auto" />
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-alt hover:text-primary"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onContact}
              className="flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-gold-dark hover:shadow-lg"
            >
              <MessageCircle className="h-4 w-4" />
              Contactar
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-primary hover:bg-bg-alt md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-20 z-50 rounded-2xl border border-border bg-white p-6 shadow-xl md:hidden"
            >
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="rounded-xl px-4 py-3 text-left text-base font-medium text-text transition-colors hover:bg-bg-alt"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="my-2 h-px bg-border" />
                <button
                  onClick={() => { setMobileOpen(false); onContact(); }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gold py-3 text-center text-sm font-semibold text-white transition-all hover:bg-gold-dark"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contactar por WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
