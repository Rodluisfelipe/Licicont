import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Loader2 } from 'lucide-react';
import { validateAccessCode } from '@/services/invitation.service';
import confetti from 'canvas-confetti';

type Status = 'loading' | 'success' | 'error';

export default function AccesoPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [fullName, setFullName] = useState('');

  const fireSuccessConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#B89146', '#D4A853', '#0A192F'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        gravity: 1.5,
        scalar: 0.7,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        gravity: 1.5,
        scalar: 0.7,
        disableForReducedMotion: true,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  useEffect(() => {
    if (!codigo) {
      navigate('/forbidden');
      return;
    }

    const validate = async () => {
      try {
        const result = await validateAccessCode(codigo);
        if (result.success && result.data?.fullName) {
          setFullName(result.data.fullName);
          setStatus('success');
          setTimeout(fireSuccessConfetti, 500);
        } else {
          setStatus('error');
          setTimeout(() => navigate('/forbidden'), 1500);
        }
      } catch {
        setStatus('error');
        setTimeout(() => navigate('/forbidden'), 1500);
      }
    };

    validate();
  }, [codigo, navigate]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gold" strokeWidth={1.5} />
        <p className="mt-4 text-sm text-text-secondary">
          Verificando credenciales...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <p className="text-sm text-red-500">
          Código inválido. Redirigiendo...
        </p>
      </div>
    );
  }

  const firstName = fullName.split(' ')[0];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white">

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(184, 145, 70, 0.08) 0%, transparent 50%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        {/* Shield icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex h-16 w-16 items-center justify-center border border-gold/30 bg-gold/10 rounded-lg">
            <Shield className="h-7 w-7 text-gold" strokeWidth={1} />
          </div>
        </motion.div>

        {/* Micro label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark"
        >
          Acceso Concedido
        </motion.span>

        {/* Welcome text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-3xl font-bold text-primary md:text-4xl lg:text-5xl"
        >
          Bienvenido a la Logia,
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-2 text-3xl font-bold text-gold md:text-4xl lg:text-5xl"
        >
          {firstName}.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8 max-w-md text-sm leading-relaxed text-text-secondary"
        >
          Su acceso ha sido verificado. A partir de este momento, tiene privilegios
          para operar dentro de la plataforma LICICONT.
        </motion.p>

        {/* Code reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-10 rounded-xl border border-border bg-bg-alt px-6 py-3"
        >
          <span className="text-sm font-medium text-gold-dark">
            REF: {codigo?.toUpperCase()}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
