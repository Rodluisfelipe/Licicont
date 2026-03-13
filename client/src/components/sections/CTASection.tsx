import { motion } from 'motion/react';
import { MessageCircle, Phone } from 'lucide-react';

const WA_URL = `https://wa.me/573023805967?text=${encodeURIComponent('Hola Andrés, quiero agendar una consultoría sobre licitaciones públicas. ¿Cuándo podemos hablar?')}`;

export default function CTASection() {
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
            ¿Listo para ganar tu próxima{' '}
            <span className="text-gold-light">licitación</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70 lg:text-lg">
            Hablemos sobre tu caso específico. Te ayudo a identificar oportunidades 
            y estructurar propuestas ganadoras con estrategia y transparencia.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-gold-light hover:shadow-xl"
            >
              <MessageCircle className="h-5 w-5" />
              Escríbeme por WhatsApp
            </a>
            <a
              href="https://wa.me/573023805967"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              <Phone className="h-4 w-4" />
              +57 302 380 5967
            </a>
          </div>

          <p className="mt-6 text-xs text-white/50">
            Sin compromiso · Respuesta rápida · 100% confidencial
          </p>
        </motion.div>
      </div>
    </section>
  );
}
