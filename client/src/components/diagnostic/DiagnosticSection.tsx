import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Compass,
  History,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { QUESTIONS } from '@/data/diagnostic';
import { SERVICES, type ServiceId } from '@/data/services';
import { computeRecommendation, isComplete, type Answers } from '@/lib/recommendation';
import {
  loadDiagnostic,
  saveDiagnostic,
  type StoredDiagnostic,
} from '@/lib/diagnosticStorage';
import { clearUrl, readAnswersFromUrl, syncUrl } from '@/lib/shareLink';
import DiagnosticResult from './DiagnosticResult';

type Phase = 'intro' | 'quiz' | 'analyzing' | 'result';

/**
 * Atajos del menú: cada frase del cliente ("Quiero aprender a licitar") responde
 * de entrada la pregunta de necesidad inmediata y arranca el cuestionario.
 */
const VOICE_SHORTCUT: Record<ServiceId, string> = {
  formacion: 'aprender',
  radar: 'ver-oportunidades',
  proceso: 'un-proceso',
  socio: 'aliado',
  'alto-valor': 'oportunidad-grande',
  rup: 'rup-listo',
};

interface InitialState {
  phase: Phase;
  answers: Answers;
  index: number;
  fromUrl: boolean;
}

/**
 * Un enlace compartido reabre el diagnóstico: completo va directo al resultado,
 * incompleto retoma en la primera pregunta pendiente.
 */
function readInitialState(): InitialState {
  const fromUrl = readAnswersFromUrl();
  if (!fromUrl) return { phase: 'intro', answers: {}, index: 0, fromUrl: false };

  if (isComplete(fromUrl)) {
    return { phase: 'result', answers: fromUrl, index: 0, fromUrl: true };
  }

  const firstPending = QUESTIONS.findIndex((q) => !fromUrl[q.id]);
  return {
    phase: 'quiz',
    answers: fromUrl,
    index: firstPending === -1 ? 0 : firstPending,
    fromUrl: true,
  };
}

const ANALYZING_STEPS = [
  'Leyendo tu perfil de contratación…',
  'Cruzando tus respuestas con los 6 servicios…',
  'Ajustando el modelo de cobro a tu caso…',
  'Preparando tu ruta de arranque…',
];

export default function DiagnosticSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [initialState] = useState(readInitialState);
  const [phase, setPhase] = useState<Phase>(initialState.phase);
  const [answers, setAnswers] = useState<Answers>(initialState.answers);
  const [index, setIndex] = useState(initialState.index);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  // Diagnóstico previo de este navegador: permite volver al plan sin repetir.
  const [saved, setSaved] = useState<StoredDiagnostic | null>(() => loadDiagnostic());

  const question = QUESTIONS[index];
  const progress = ((index + 1) / QUESTIONS.length) * 100;

  const recommendation = useMemo(
    () => (phase === 'result' ? computeRecommendation(answers) : null),
    [phase, answers]
  );

  const focusSection = useCallback(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const start = useCallback(
    (presetNecesidad?: string) => {
      setAnswers(presetNecesidad ? { necesidad: presetNecesidad } : {});
      setIndex(0);
      setPhase('quiz');
      focusSection();
    },
    [focusSection]
  );

  /** Avanza a la siguiente pregunta sin responder, o cierra el cuestionario. */
  const goForward = useCallback(
    (from: number, current: Answers) => {
      // Las preguntas ya respondidas por un atajo se saltan.
      let next = from + 1;
      while (next < QUESTIONS.length && current[QUESTIONS[next].id]) next += 1;

      if (next < QUESTIONS.length) {
        setIndex(next);
        return;
      }
      setAnalyzingStep(0);
      setPhase('analyzing');
    },
    []
  );

  const answer = useCallback(
    (value: string) => {
      const updated: Answers = { ...answers, [question.id]: value };
      setAnswers(updated);
      // Pausa corta para que se vea la selección antes de pasar.
      window.setTimeout(() => goForward(index, updated), 260);
    },
    [answers, question, index, goForward]
  );

  const goBack = useCallback(() => {
    if (index === 0) {
      setPhase('intro');
      return;
    }
    setIndex(index - 1);
  }, [index]);

  // ── Al llegar por un enlace compartido, la vista aterriza en el diagnóstico ──
  useEffect(() => {
    if (!initialState.fromUrl) return;

    // El navegador ya salta al ancla; se reafirma por el scroll suave de Lenis.
    const timer = window.setTimeout(focusSection, 300);
    return () => window.clearTimeout(timer);
  }, [initialState.fromUrl, focusSection]);

  // ── El resultado se guarda en el navegador y se refleja en la URL ──
  useEffect(() => {
    if (phase !== 'result' || !recommendation) return;

    saveDiagnostic({
      answers,
      contact: saved?.contact,
      serviceId: recommendation.primary.id,
      serviceName: recommendation.primary.name,
      affinity: recommendation.affinity,
    });
    syncUrl(answers);
  }, [phase, recommendation, answers, saved]);

  // ── Atajos de teclado: 1–6 selecciona, Backspace retrocede ──
  useEffect(() => {
    if (phase !== 'quiz') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        goBack();
        return;
      }
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= question.options.length) {
        answer(question.options[n - 1].value);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, question, answer, goBack]);

  // ── Animación de análisis antes del resultado ──
  useEffect(() => {
    if (phase !== 'analyzing') return;

    const stepTimer = window.setInterval(
      () => setAnalyzingStep((s) => Math.min(s + 1, ANALYZING_STEPS.length - 1)),
      450
    );
    const doneTimer = window.setTimeout(() => {
      setPhase('result');
      focusSection();
    }, 1900);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase, focusSection]);

  const restart = useCallback(() => {
    setAnswers({});
    setIndex(0);
    setPhase('intro');
    setSaved(null);
    clearUrl();
    focusSection();
  }, [focusSection]);

  /** Volver al plan ya calculado en este navegador. */
  const resume = useCallback(() => {
    if (!saved) return;
    setAnswers(saved.answers);
    setPhase('result');
    focusSection();
  }, [saved, focusSection]);

  return (
    <section
      id="diagnostico"
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden bg-primary py-16 sm:py-20"
    >
      {/* Fondos difusos */}
      <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-32 h-[400px] w-[400px] rounded-full bg-gold/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatePresence mode="wait">
          {/* ══════════ INTRO ══════════ */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-medium text-gold-light">
                <Compass className="h-4 w-4" />
                Diagnóstico gratuito · 6 preguntas
              </span>

              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                ¿Cuál de mis <span className="text-gold-light">6 servicios</span> es el tuyo?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 lg:text-lg">
                Respóndeme seis preguntas y te digo con cuál empezar, qué incluye, cuánto
                cuesta y cómo arrancamos. Sin llamadas de descubrimiento ni cotizaciones a
                ciegas.
              </p>

              {/* Diagnóstico anterior guardado en este navegador */}
              {saved?.serviceName && (
                <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-gold/25 bg-white/[0.04] px-6 py-5 sm:flex-row sm:justify-between sm:text-left">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-light">
                      <History className="h-4 w-4" />
                    </span>
                    <p className="text-sm text-white/70">
                      Ya tienes un diagnóstico:{' '}
                      <span className="font-semibold text-white">{saved.serviceName}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resume}
                    className="shrink-0 rounded-full bg-gold px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-gold-light"
                  >
                    Ver mi plan
                  </button>
                </div>
              )}

              <div className="mt-9 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={() => start()}
                  className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-gold px-9 py-4 text-base font-semibold text-white shadow-lg"
                >
                  {saved?.serviceName ? 'Hacer el diagnóstico de nuevo' : 'Empezar mi diagnóstico'}
                  <ArrowRight className="h-5 w-5" />
                </button>

                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/45">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Toma 45 segundos
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> Sin registro previo
                  </span>
                </div>
              </div>

              {/* Atajos: las frases del cliente del menú de servicios */}
              <div className="mt-12">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/35">
                  O ubícate directo
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {SERVICES.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => start(VOICE_SHORTCUT[service.id])}
                      className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-white sm:text-sm"
                    >
                      “{service.clientVoice}”
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════ CUESTIONARIO ══════════ */}
          {phase === 'quiz' && question && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="mx-auto max-w-3xl"
            >
              {/* Progreso */}
              <div className="mb-8">
                <div className="mb-2.5 flex items-center justify-between text-xs font-medium text-white/45">
                  <span>
                    Pregunta {index + 1} de {QUESTIONS.length}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28 }}
                  transition={{ duration: 0.28 }}
                >
                  <h3 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
                    {question.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-white/55 sm:text-base">{question.subtitle}</p>

                  <div
                    className={`mt-8 grid gap-3 ${
                      question.columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'
                    }`}
                  >
                    {question.options.map((option, i) => {
                      const selected = answers[question.id] === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => answer(option.value)}
                          className={`group flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                            selected
                              ? 'border-gold bg-gold/15 shadow-lg shadow-gold/10'
                              : 'border-white/12 bg-white/[0.03] hover:border-gold/40 hover:bg-white/[0.07]'
                          }`}
                        >
                          <span className="text-xl leading-none" aria-hidden="true">
                            {option.emoji}
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-semibold text-white sm:text-base">
                              {option.label}
                            </span>
                            {option.hint && (
                              <span className="mt-1 block text-xs leading-relaxed text-white/45">
                                {option.hint}
                              </span>
                            )}
                          </span>
                          <span
                            className={`hidden h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-semibold transition-colors sm:flex ${
                              selected
                                ? 'border-gold bg-gold text-white'
                                : 'border-white/15 text-white/35 group-hover:border-gold/40 group-hover:text-gold-light'
                            }`}
                            aria-hidden="true"
                          >
                            {i + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </button>
                <p className="hidden text-xs text-white/30 sm:block">
                  Tip: usa las teclas 1–{question.options.length} para responder más rápido
                </p>
              </div>
            </motion.div>
          )}

          {/* ══════════ ANÁLISIS ══════════ */}
          {phase === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto flex max-w-md flex-col items-center py-16 text-center"
            >
              <Loader2 className="h-10 w-10 animate-spin text-gold" strokeWidth={1.5} />
              <AnimatePresence mode="wait">
                <motion.p
                  key={analyzingStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 text-base font-medium text-white"
                >
                  {ANALYZING_STEPS[analyzingStep]}
                </motion.p>
              </AnimatePresence>
              <p className="mt-2 text-xs text-white/40">Un segundo, estoy armando tu ruta.</p>
            </motion.div>
          )}

          {/* ══════════ RESULTADO ══════════ */}
          {phase === 'result' && recommendation && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DiagnosticResult
                recommendation={recommendation}
                answers={answers}
                onRestart={restart}
                initialContact={saved?.contact}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
