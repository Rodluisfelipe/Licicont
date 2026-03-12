import { Mail, MapPin, Phone } from 'lucide-react';

const LINKS = {
  Empresa: ['Sobre Nosotros', 'Equipo', 'Carreras', 'Blog'],
  Servicios: [
    'Monitoreo SECOP',
    'Preparación de Propuestas',
    'Revisión Jurídica',
    'Formación de Consorcios',
  ],
  Recursos: ['Guía de Licitaciones', 'Preguntas Frecuentes', 'Términos y Condiciones', 'Política de Privacidad'],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo.jpeg" alt="LICICONT" className="h-16 w-auto brightness-0 invert" />
              <span className="text-lg font-bold tracking-wider text-white">
                LICICONT
              </span>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/60">
              Firma exclusiva de Bróker de Licitaciones en Colombia. 
              Gestionamos contratación pública para que su empresa gane más contratos.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-gold" />
                Bogotá D.C., Colombia
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4 text-gold" />
                contacto@licicont.com
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4 text-gold" />
                +57 300 123 4567
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/50 transition-colors hover:text-gold"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {year} LICICONT. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.tiktok.com/@licicont_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 transition-colors hover:text-gold"
            >
              TikTok
            </a>
            <a
              href="https://www.instagram.com/licicont_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 transition-colors hover:text-gold"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/licicont"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 transition-colors hover:text-gold"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
