import { motion } from 'motion/react';
import { ArrowRight, Phone } from 'lucide-react';

interface CTASectionProps {
  onRequestAccess: () => void;
}

export default function CTASection({ onRequestAccess }: CTASectionProps) {
  return (
    <section className="bg-primary py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-gold-light">
            Empiece Hoy
          </span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            ¿Listo para ganar su próxima{' '}
            <span className="text-gold-light">licitación</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70 lg:text-lg">
            Solicite acceso a nuestra plataforma y reciba una consultoría de diagnóstico gratuita. 
            Nuestro equipo le contactará en menos de 24 horas.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={onRequestAccess}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-gold-light hover:shadow-xl"
            >
              Solicitar Acceso Exclusivo
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              <Phone className="h-4 w-4" />
              Agendar Llamada
            </a>
          </div>

          <p className="mt-6 text-xs text-white/50">
            Sin compromiso · Respuesta en 24h · 100% confidencial
          </p>
        </motion.div>
      </div>
    </section>
  );
}
