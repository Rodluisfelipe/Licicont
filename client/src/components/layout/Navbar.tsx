import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MessageCircle, Compass, Phone, ChevronRight } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

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
  const { haptic } = useHaptics();

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

  // Con la hoja abierta, el fondo no debe desplazarse bajo el dedo.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    haptic('select');
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToDiagnostic = () => {
    haptic('step');
    setMobileOpen(false);
    document.querySelector('#diagnostico')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleMenu = () => {
    haptic(mobileOpen ? 'tick' : 'step');
    setMobileOpen((v) => !v);
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
            <span className="hidden text-[15px] font-semibold tracking-[0.14em] text-primary sm:block">
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
                  className={`relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
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
              className="btn btn-ghost hidden text-sm xl:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" />
              302 380 5967
            </a>
            <button
              onClick={goToDiagnostic}
              className="btn btn-primary"
            >
              <Compass className="h-4 w-4" />
              Diagnóstico gratis
            </button>
          </div>

          {/* Móvil: acción directa + menú */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={goToDiagnostic}
              className="btn btn-primary min-h-[40px] px-4 py-2 text-xs"
            >
              Diagnóstico gratis
            </button>
            <button
              onClick={toggleMenu}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-primary transition-colors active:bg-bg-alt"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Menú móvil: hoja inferior, al alcance del pulgar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-primary/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-label="Menú de navegación"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110 || info.velocity.y > 640) {
                  haptic('tick');
                  setMobileOpen(false);
                }
              }}
              className="pb-safe fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-white shadow-2xl md:hidden"
            >
              {/* Asa de arrastre */}
              <div className="flex justify-center pt-3 pb-1">
                <span className="h-1 w-10 rounded-full bg-border-strong" aria-hidden="true" />
              </div>

              <nav className="px-4 pt-2 pb-4">
                {NAV_LINKS.map((link) => {
                  const active = activeSection === link.href;
                  return (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className={`flex min-h-[52px] w-full items-center justify-between rounded-lg px-4 text-left text-[15px] font-medium transition-colors active:bg-bg-alt ${
                        active ? 'text-gold-dark' : 'text-text'
                      }`}
                    >
                      {link.label}
                      <ChevronRight
                        className={`h-4 w-4 ${active ? 'text-gold' : 'text-text-light'}`}
                      />
                    </button>
                  );
                })}

                <div className="my-3 h-px bg-border" />

                <div className="flex flex-col gap-2">
                  <button onClick={goToDiagnostic} className="btn btn-primary w-full py-3.5">
                    <Compass className="h-[18px] w-[18px]" />
                    Diagnóstico gratis
                  </button>
                  <button
                    onClick={() => {
                      haptic('select');
                      setMobileOpen(false);
                      onContact();
                    }}
                    className="btn btn-whatsapp w-full py-3.5"
                  >
                    <MessageCircle className="h-[18px] w-[18px]" />
                    Escríbeme por WhatsApp
                  </button>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost w-full py-3"
                  >
                    <Phone className="h-4 w-4" />
                    +57 302 380 5967
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
