import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Check,
  Info,
  MessageCircle,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import type { Recommendation } from '@/lib/recommendation';
import { buildDiagnosticMessage, whatsappUrl, type LeadContact } from '@/lib/whatsapp';
import { submitDiagnosticLead } from '@/services/lead.service';
import type { Answers } from '@/lib/recommendation';
import ServiceIcon from './ServiceIcon';

interface Props {
  recommendation: Recommendation;
  answers: Answers;
  onRestart: () => void;
}

const emptyLead: LeadContact = { fullName: '', company: '', phone: '', email: '' };

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 transition-all focus:border-gold focus:bg-white/10 focus:ring-2 focus:ring-gold/25 focus:outline-none';

/** Anillo de afinidad — el número sube mientras el usuario lee. */
function AffinityRing({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // easeOutCubic
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="7" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{display}%</span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-white/50">
          afinidad
        </span>
      </div>
    </div>
  );
}

export default function DiagnosticResult({ recommendation, answers, onRestart }: Props) {
  const { primary, complements, reasons, nextSteps, affinity } = recommendation;
  const [lead, setLead] = useState<LeadContact>(emptyLead);
  const [sent, setSent] = useState(false);

  const canSend = lead.fullName.trim() !== '' && lead.company.trim() !== '' && lead.phone.trim() !== '';

  const message = useMemo(
    () => buildDiagnosticMessage(recommendation, lead),
    [recommendation, lead]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLead((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = async () => {
    if (!canSend) return;

    // La conversión no espera al backend: primero WhatsApp, el registro va aparte.
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
    setSent(true);

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#B89146', '#D4A853', '#FFFFFF'],
    });

    void submitDiagnosticLead({
      fullName: lead.fullName,
      company: lead.company,
      phone: lead.phone,
      email: lead.email || undefined,
      answers: answers as Record<string, string>,
      recommendedService: primary.id,
      recommendedServiceName: primary.name,
      complements: complements.map((c) => c.id),
      affinity,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl"
    >
      {/* ── Encabezado del resultado ── */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-medium text-gold-light">
          <Sparkles className="h-4 w-4" />
          Tu diagnóstico está listo
        </span>
      </div>

      {/* ── Plan recomendado ── */}
      <div className="overflow-hidden rounded-3xl border border-gold/30 bg-white/[0.04] shadow-2xl backdrop-blur-sm">
        <div className="border-b border-white/10 bg-gradient-to-r from-gold/15 to-transparent px-6 py-7 sm:px-9">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <AffinityRing value={affinity} />

            <div className="flex-1">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gold-light">
                Tu plan recomendado
              </p>
              <h3 className="flex flex-wrap items-center gap-3 text-2xl font-bold text-white sm:text-3xl">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-white">
                  <ServiceIcon name={primary.icon} />
                </span>
                {primary.name}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/70 sm:text-base">
                {primary.tagline}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-9 lg:grid-cols-2">
          {/* Por qué este plan */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              Por qué este plan es el tuyo
            </h4>
            <ul className="space-y-3">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-3 text-sm leading-relaxed text-white/75">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/45">
                Inversión estimada
              </p>
              <p className="text-xl font-bold text-gold-light">{primary.price}</p>
              {primary.priceNote && (
                <p className="mt-0.5 text-xs text-white/50">{primary.priceNote}</p>
              )}
              <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/55">
                {primary.pricingModel}
              </p>
            </div>
          </div>

          {/* Qué incluye */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              Qué incluye
            </h4>
            <ul className="space-y-2.5">
              {primary.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/75">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {primary.notIncludes.length > 0 && (
              <>
                <h4 className="mt-6 mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">
                  No incluye
                </h4>
                <ul className="space-y-2">
                  {primary.notIncludes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/45">
                      <X className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Ruta de arranque */}
        <div className="border-t border-white/10 px-6 py-8 sm:px-9">
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gold-light">
            Cómo arrancamos
          </h4>
          <div className="grid gap-4 sm:grid-cols-3">
            {nextSteps.map((step, i) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold-light">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-white/70">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Complementos ── */}
      {complements.length > 0 && (
        <div className="mt-8">
          <p className="mb-4 flex items-center gap-2 text-sm text-white/55">
            <Info className="h-4 w-4 text-gold" />
            Según tus respuestas, esto le suma a tu plan:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {complements.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-gold/30"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold-light">
                    <ServiceIcon name={service.icon} className="h-5 w-5" />
                  </span>
                  <h5 className="text-sm font-bold text-white">{service.name}</h5>
                </div>
                <p className="text-sm leading-relaxed text-white/60">{service.tagline}</p>
                <p className="mt-3 text-xs font-semibold text-gold-light">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Captura del lead ── */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-9">
        <h4 className="text-xl font-bold text-white">
          {sent ? '¡Listo! Te escribo enseguida' : 'Recibe tu propuesta personalizada'}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          {sent
            ? 'Si WhatsApp no se abrió, usa el botón de abajo para reintentarlo. Tu diagnóstico ya va incluido en el mensaje.'
            : 'Déjame tus datos y te llega por WhatsApp la propuesta de tu plan, con alcance y precio cerrado para tu empresa.'}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-name" className="mb-1.5 block text-xs font-medium text-white/50">
              Nombre completo
            </label>
            <input
              id="lead-name"
              name="fullName"
              value={lead.fullName}
              onChange={handleChange}
              placeholder="Carlos Andrés Restrepo"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="lead-company" className="mb-1.5 block text-xs font-medium text-white/50">
              Empresa
            </label>
            <input
              id="lead-company"
              name="company"
              value={lead.company}
              onChange={handleChange}
              placeholder="Empresa S.A.S"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="lead-phone" className="mb-1.5 block text-xs font-medium text-white/50">
              WhatsApp
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              value={lead.phone}
              onChange={handleChange}
              placeholder="300 123 4567"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="lead-email" className="mb-1.5 block text-xs font-medium text-white/50">
              Email <span className="text-white/30">(opcional)</span>
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              value={lead.email}
              onChange={handleChange}
              placeholder="carlos@empresa.com.co"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="magnetic-btn inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:transform-none"
          >
            <MessageCircle className="h-5 w-5" />
            {sent ? 'Reabrir WhatsApp' : 'Recibir mi propuesta por WhatsApp'}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Repetir diagnóstico
          </button>

          <a
            href="#planes"
            className="inline-flex items-center justify-center gap-1.5 px-2 py-3.5 text-sm font-medium text-gold-light transition-colors hover:text-gold"
          >
            Ver los 6 servicios
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-4 text-xs text-white/35">
          {canSend
            ? 'Sin compromiso · Respuesta el mismo día · 100% confidencial'
            : 'Completa nombre, empresa y WhatsApp para recibir tu propuesta.'}
        </p>
      </div>
    </motion.div>
  );
}
