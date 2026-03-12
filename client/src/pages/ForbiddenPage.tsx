import { motion } from 'motion/react';
import { ShieldX, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white">
      {/* Subtle red radial */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.03) 0%, transparent 50%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex h-16 w-16 items-center justify-center border border-red-200 bg-red-50 rounded-lg">
            <ShieldX className="h-7 w-7 text-red-400" strokeWidth={1} />
          </div>
        </motion.div>

        {/* 403 */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 text-5xl font-bold text-text-light"
        >
          403
        </motion.span>

        {/* Main message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-lg text-2xl font-bold leading-relaxed text-primary md:text-3xl lg:text-4xl"
        >
          Su ventana de oportunidad{' '}
          <span className="italic text-gold/60">ha cerrado.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 max-w-sm text-sm leading-relaxed text-text-secondary"
        >
          El código de acceso ha expirado, ya fue utilizado, o no es válido.
          Los privilegios de LICICONT tienen una vigencia limitada.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          onClick={() => navigate('/')}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-gold-light hover:shadow-lg"
        >
          Solicitar nuevo acceso
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </motion.button>
      </motion.div>
    </div>
  );
}
