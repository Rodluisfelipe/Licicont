import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MessageCircle, Compass, Phone } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Sobre Mí', href: '#sobre-mi' },
  { label: 'Mi Plan Ideal', href: '#diagnostico' },
  { label: 'Servicios', href: '#planes' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Preguntas', href: '#faq' },
];

const WA_LINK = 'https://wa.me/573023805967';

export default function Navbar({ onContact }: { onContact: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min(window.scrollY / docH, 1) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Marca en qué sección está el visitante para que nunca se pierda.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => Boolean(el)
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToDiagnostic = () => {
    setMobileOpen(false);
    document.querySelector('#diagnostico')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 shadow-sm backdrop-blur-xl' : 'bg-white'
        }`}
      >
        {/* Progreso de lectura */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-transparent">
          <motion.div className="h-full bg-gold" style={{ width: `${scrollProgress * 100}%` }} />
        </div>

        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-6 ${
            scrolled ? 'py-2' : 'py-2.5'
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex shrink-0 items-center gap-2.5 no-underline" aria-label="LICICONT — inicio">
            <img
              src="/logo.jpeg"
              alt="LICICONT — Asesoría en Licitaciones Públicas Colombia"
              className={`w-auto transition-all duration-300 ${scrolled ? 'h-9' : 'h-11'}`}
              width="44"
              height="44"
            />
            <span className="hidden text-base font-bold tracking-wide text-primary sm:block">
              LICICONT
            </span>
          </a>

          {/* Navegación */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = activeSection === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  aria-current={active ? 'true' : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active ? 'text-primary' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Acciones */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary xl:flex"
            >
              <Phone className="h-3.5 w-3.5" />
              302 380 5967
            </a>
            <button
              onClick={goToDiagnostic}
              className="flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gold-dark hover:shadow-md"
            >
              <Compass className="h-4 w-4" />
              Diagnóstico gratis
            </button>
          </div>

          {/* Móvil: acción directa + menú */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={goToDiagnostic}
              className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white shadow-sm"
            >
              Diagnóstico gratis
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-primary transition-colors hover:bg-bg-alt"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-3 top-[68px] z-50 rounded-2xl border border-border bg-white p-4 shadow-xl md:hidden"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`rounded-xl px-4 py-2.5 text-left text-base font-medium transition-colors ${
                      activeSection === link.href
                        ? 'bg-gold/10 text-gold-dark'
                        : 'text-text hover:bg-bg-alt'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="my-2 h-px bg-border" />
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onContact();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Escríbeme por WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
