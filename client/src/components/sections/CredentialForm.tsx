import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

interface CredentialFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTORS = [
  'Infraestructura & Obra Civil',
  'Tecnología & Software',
  'Consultoría & Servicios Profesionales',
  'Salud & Farmacéutica',
  'Alimentos & Suministros',
  'Seguridad & Defensa',
  'Educación & Capacitación',
  'Transporte & Logística',
  'Otro',
];

interface FormData {
  fullName: string;
  email: string;
  company: string;
  nit: string;
  sector: string;
}

const initialFormState: FormData = {
  fullName: '',
  email: '',
  company: '',
  nit: '',
  sector: '',
};

const inputClass =
  'w-full rounded-xl border border-border bg-bg-alt px-4 py-3.5 text-sm text-primary placeholder:text-text-light transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none';

const STEPS = [
  { title: '¿En qué sector licita?', subtitle: 'Seleccione su sector principal' },
  { title: '¿Cuál es su empresa?', subtitle: 'Datos de la compañía' },
  { title: '¿Con quién hablamos?', subtitle: 'Sus datos de contacto' },
];

const WA_PHONE = '573023805967';

function buildWhatsAppUrl(form: FormData): string {
  const msg = [
    `Hola Andrés, me interesa una asesoría en licitaciones públicas.`,
    ``,
    `*Mis datos:*`,
    `• Nombre: ${form.fullName}`,
    `• Email: ${form.email}`,
    `• Empresa: ${form.company}`,
    `• NIT: ${form.nit}`,
    `• Sector: ${form.sector}`,
    ``,
    `¿Podemos agendar una consulta?`,
  ].join('\n');
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
}

export default function CredentialForm({ isOpen, onClose }: CredentialFormProps) {
  const [form, setForm] = useState<FormData>(initialFormState);
  const [step, setStep] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const canAdvance = () => {
    if (step === 0) return form.sector !== '';
    if (step === 1) return form.company !== '' && form.nit !== '';
    return form.fullName !== '' && form.email !== '';
  };

  const handleSubmit = () => {
    window.open(buildWhatsAppUrl(form), '_blank', 'noopener,noreferrer');
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForm(initialFormState);
      setStep(0);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-primary/30 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-7 py-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                    <Shield className="h-4 w-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-semibold text-primary">Hablar con Andrés</span>
                </div>
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-alt hover:text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-border">
                <motion.div
                  className="h-full bg-gold"
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Body */}
              <div className="px-7 py-6">
                <AnimatePresence mode="wait">
                    <motion.div
                      key={`step-${step}`}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Step header */}
                      <div className="mb-6">
                        <p className="text-xs font-medium text-gold-dark">
                          Paso {step + 1} de {STEPS.length}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-primary">{STEPS[step].title}</h3>
                        <p className="text-sm text-text-secondary">{STEPS[step].subtitle}</p>
                      </div>

                      {/* Step 0: Sector */}
                      {step === 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {SECTORS.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setForm({ ...form, sector: s })}
                              className={`rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all ${
                                form.sector === s
                                  ? 'border-gold bg-gold/10 text-gold-dark shadow-sm'
                                  : 'border-border bg-white text-text-secondary hover:border-gold/30'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Step 1: Company */}
                      {step === 1 && (
                        <div className="space-y-4">
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Empresa</label>
                            <input type="text" name="company" value={form.company} onChange={handleChange} required placeholder="Empresa S.A.S" className={inputClass} />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">NIT</label>
                            <input type="text" name="nit" value={form.nit} onChange={handleChange} required placeholder="900.123.456-7" className={inputClass} />
                          </div>
                        </div>
                      )}

                      {/* Step 2: Contact */}
                      {step === 2 && (
                        <div className="space-y-4">
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Nombre Completo</label>
                            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Carlos Andrés Restrepo" className={inputClass} />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Email Corporativo</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="carlos@empresa.com.co" className={inputClass} />
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="mt-6 flex items-center justify-between gap-3">
                        {step > 0 ? (
                          <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-alt"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Atrás
                          </button>
                        ) : (
                          <div />
                        )}

                        {step < STEPS.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => canAdvance() && setStep(step + 1)}
                            disabled={!canAdvance()}
                            className="flex items-center gap-1.5 rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-gold-light disabled:opacity-40"
                          >
                            Siguiente
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!canAdvance()}
                            className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1ebe57] disabled:opacity-40"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Abrir WhatsApp
                          </button>
                        )}
                      </div>
                    </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="border-t border-border px-7 py-3">
                <p className="text-center text-xs text-text-light">
                  Al enviar, se abrirá WhatsApp con tus datos para contactar a Andrés directamente
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
