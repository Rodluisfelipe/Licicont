/**
 * Motor de recomendación del diagnóstico.
 *
 * Suma los pesos de cada respuesta, normaliza por el máximo alcanzable de cada
 * servicio y devuelve el plan ideal + complementos + las razones que lo
 * justifican. Es una función pura: mismas respuestas ⇒ mismo resultado.
 */

import { QUESTIONS, QUESTION_MAP, type QuestionId } from '@/data/diagnostic';
import { SERVICES, getService, type Service, type ServiceId } from '@/data/services';

export type Answers = Partial<Record<QuestionId, string>>;

export interface ScoredService {
  service: Service;
  score: number;
  affinity: number;
}

export interface Recommendation {
  primary: Service;
  complements: Service[];
  /** Afinidad del perfil con el plan recomendado (0–100). */
  affinity: number;
  reasons: string[];
  ranking: ScoredService[];
  nextSteps: string[];
  profile: { label: string; value: string }[];
}

/**
 * Desempate cuando dos servicios puntúan igual: se prefiere el de mayor
 * acompañamiento, que es el que resuelve más del problema del cliente.
 */
const TIE_BREAK: ServiceId[] = [
  'socio',
  'alto-valor',
  'proceso',
  'radar',
  'formacion',
  'rup',
];

const NEXT_STEPS: Record<ServiceId, string[]> = {
  formacion: [
    'Agendamos una llamada de 15 minutos para ubicar tu punto de partida',
    'Te reservo cupo en el próximo grupo (son reducidos y en vivo)',
    'Sales con tu primera búsqueda en SECOP II hecha por ti mismo',
  ],
  radar: [
    'Definimos tu perfil de afinidad: sector, ubicación, rango de valor',
    'Configuro la vigilancia y recibes el primer barrido de oportunidades',
    'Cada mes revisamos juntos qué procesos vale la pena atacar',
  ],
  proceso: [
    'Me envías el número del proceso o lo buscamos juntos',
    'Recibes el análisis con riesgos y señales de direccionamiento',
    'Si el pliego es ganable, estructuramos y presentamos la oferta',
  ],
  socio: [
    'Sesión de diagnóstico: capacidad, RUP, experiencia acreditable',
    'Armamos el plan de licitación de los próximos 3 meses',
    'Arranco la operación: vigilo, analizo, estructuro y presento contigo',
  ],
  'alto-valor': [
    'Validamos tu capacidad real de ejecución y respaldo financiero',
    'Te presento las oportunidades de alto valor que ya tengo detectadas',
    'Negociamos la comisión según el tamaño del proceso y arrancamos',
  ],
  rup: [
    'Reviso tu documentación y te digo exactamente qué falta',
    'Clasificamos tus códigos UNSPSC según los procesos que quieres ganar',
    'Radico el trámite y te acompaño hasta que quede en firme',
  ],
};

/** Máximo de puntos que cada servicio puede alcanzar en todo el cuestionario. */
const MAX_SCORE: Record<ServiceId, number> = SERVICES.reduce((acc, service) => {
  acc[service.id] = QUESTIONS.reduce((total, question) => {
    const best = Math.max(
      0,
      ...question.options.map((o) => o.weights[service.id] ?? 0)
    );
    return total + best;
  }, 0);
  return acc;
}, {} as Record<ServiceId, number>);

function toAffinity(score: number, serviceId: ServiceId): number {
  const max = MAX_SCORE[serviceId] || 1;
  const ratio = Math.min(1, score / max);
  if (ratio === 0) return 0;
  // 62–98: incluso el plan ideal admite matices, y el segundo nunca se ve descartado.
  return Math.min(98, Math.round(62 + ratio * 40));
}

/** ¿Contestó todas las preguntas? */
export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((q) => Boolean(answers[q.id]));
}

export function getSelectedOption(questionId: QuestionId, value?: string) {
  if (!value) return undefined;
  return QUESTION_MAP[questionId].options.find((o) => o.value === value);
}

export function computeRecommendation(answers: Answers): Recommendation {
  const scores = SERVICES.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {} as Record<ServiceId, number>);
  const reasons: string[] = [];
  const profile: { label: string; value: string }[] = [];

  for (const question of QUESTIONS) {
    const option = getSelectedOption(question.id, answers[question.id]);
    if (!option) continue;

    profile.push({ label: question.short, value: option.label });

    for (const [serviceId, weight] of Object.entries(option.weights)) {
      scores[serviceId as ServiceId] += weight ?? 0;
    }
    if (option.reason) reasons.push(option.reason);
  }

  const ranking: ScoredService[] = SERVICES.map((service) => ({
    service,
    score: scores[service.id],
    affinity: toAffinity(scores[service.id], service.id),
  })).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return TIE_BREAK.indexOf(a.service.id) - TIE_BREAK.indexOf(b.service.id);
  });

  const primary = ranking[0].service;
  const complements: Service[] = [];

  // El RUP no es opcional: sin él no se puede licitar, así que si no está
  // vigente entra siempre como complemento del plan recomendado.
  const rupAnswer = answers.rup;
  if (rupAnswer && rupAnswer !== 'vigente' && primary.id !== 'rup') {
    complements.push(getService('rup'));
  }

  for (const entry of ranking.slice(1)) {
    if (complements.length >= 2) break;
    if (entry.service.id === primary.id) continue;
    if (complements.some((c) => c.id === entry.service.id)) continue;
    // Solo se sugiere lo que realmente encaja con el perfil.
    if (entry.score < ranking[0].score * 0.35) continue;
    complements.push(entry.service);
  }

  // Un RUP recomendado como plan principal siempre necesita un siguiente paso.
  if (primary.id === 'rup' && complements.length === 0) {
    const fallback = ranking.find((r) => r.service.id !== 'rup');
    if (fallback) complements.push(fallback.service);
  }

  if (reasons.length < 2) reasons.push(primary.differentiator);

  return {
    primary,
    complements,
    affinity: ranking[0].affinity,
    reasons: reasons.slice(0, 4),
    ranking,
    nextSteps: NEXT_STEPS[primary.id],
    profile,
  };
}
