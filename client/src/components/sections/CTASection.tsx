import { motion } from 'motion/react';
import { Compass, MessageCircle, Phone } from 'lucide-react';

export default function CTASection({ onContact }: { onContact: () => void }) {
  return (
    <section className="relative overflow-hidden bg-primary py-16 sm:py-24">
      <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow eyebrow-center eyebrow-light mb-6">Empieza hoy</span>
          <h2 className="display-1 text-white">
            ¿Listo para ganar tu próxima{' '}
            <span className="text-gold-light">licitación</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-[1.0625rem]">
            Si no sabes por dónde empezar, haz el diagnóstico: en 45 segundos sabes qué
            servicio necesitas y cuánto cuesta. Y si prefieres, hablamos directo.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() =>
                document
                  .querySelector('#diagnostico')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className="btn btn-lg btn-primary magnetic-btn"
            >
              <Compass className="h-5 w-5" />
              Descubre tu plan ideal
            </button>
            <button
              onClick={onContact}
              className="btn btn-lg btn-outline-invert"
            >
              <MessageCircle className="h-5 w-5" />
              Escríbeme por WhatsApp
            </button>
            <a
              href="https://wa.me/573023805967"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg text-white/70 hover:text-gold-light"
            >
              <Phone className="h-4 w-4" />
              +57 302 380 5967
            </a>
          </div>

          <p className="mt-7 text-xs text-white/45">
            Sin compromiso · Respuesta el mismo día · 100% confidencial
          </p>
        </motion.div>
      </div>
    </section>
  );
}
