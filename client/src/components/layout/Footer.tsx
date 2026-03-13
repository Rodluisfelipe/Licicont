import { Mail, MapPin, Phone } from 'lucide-react';

const LINKS = {
  Servicios: [
    'Monitoreo SECOP',
    'Preparación de Propuestas',
    'Revisión Jurídica',
    'Análisis Financiero',
  ],
  'Recursos': ['Asesoría Personalizada', 'Preguntas Frecuentes', 'Términos y Condiciones', 'Política de Privacidad'],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo.jpeg" alt="LICICONT Logo" className="h-16 w-auto brightness-0 invert" loading="lazy" decoding="async" width="64" height="64" />
              <span className="text-lg font-bold tracking-wider text-white">
                LICICONT
              </span>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/60">
              Asesoría especializada en licitaciones públicas y contratación estatal en Colombia. 
              +10 años de experiencia. Andrés Beltrán Mora.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-gold" />
                Bogotá D.C., Colombia
              </div>
              <a href="mailto:licitacionesycontratas@gmail.com" className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold">
                <Mail className="h-4 w-4 text-gold" />
                licitacionesycontratas@gmail.com
              </a>
              <a href="https://wa.me/573023805967" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold">
                <Phone className="h-4 w-4 text-gold" />
                +57 302 380 5967
              </a>
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
              href="https://wa.me/573023805967"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 transition-colors hover:text-gold"
            >
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/licicont_?igsh=bHljb3B1aTB3M3p2&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 transition-colors hover:text-gold"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@licicont_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 transition-colors hover:text-gold"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
