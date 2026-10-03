/**
 * LICICONT — Diagnóstico interactivo
 *
 * Traduce el enrutador del menú de servicios ("¿En qué momento está tu empresa?")
 * a un cuestionario ponderado. Cada opción reparte puntos entre los servicios;
 * el motor de `lib/recommendation.ts` los suma y devuelve el plan ideal.
 *
 * Para ajustar el enrutamiento comercial basta con mover los `weights` de aquí.
 */

import type { ServiceId } from './services';

export type QuestionId =
  | 'momento'
  | 'rup'
  | 'freno'
  | 'necesidad'
  | 'sector'
  | 'inversion';

export interface Option {
  value: string;
  label: string;
  /** Texto de apoyo bajo la opción. */
  hint?: string;
  emoji?: string;
  /** Puntos que esta respuesta aporta a cada servicio. */
  weights: Partial<Record<ServiceId, number>>;
  /** Frase en segunda persona que se muestra como justificación del resultado. */
  reason?: string;
}

export interface Question {
  id: QuestionId;
  /** Rótulo corto para el resumen de respuestas. */
  short: string;
  title: string;
  subtitle: string;
  options: Option[];
  /** Dos columnas en desktop para listas largas. */
  columns?: 1 | 2;
}

export const QUESTIONS: Question[] = [
  {
    id: 'momento',
    short: 'Momento',
    title: '¿En qué momento está tu empresa hoy?',
    subtitle: 'Sé honesto: de aquí sale el 60% de la recomendación.',
    columns: 1,
    options: [
      {
        value: 'nunca',
        emoji: '🌱',
        label: 'Nunca he presentado una oferta al Estado',
        hint: 'Quiero entrar, pero no sé por dónde empezar.',
        weights: { rup: 4, proceso: 3 },
        reason: 'Aún no has presentado ofertas: primero el terreno firme — tu RUP en regla — y luego un primer proceso bien analizado antes de gastar en él.',
      },
      {
        value: 'intentado',
        emoji: '🎯',
        label: 'Me he presentado y no he ganado',
        hint: 'Ya conozco SECOP, pero las ofertas se me caen.',
        weights: { proceso: 4, socio: 3 },
        reason: 'Ya sabes presentarte: el problema no es el acceso, es la estructuración de la oferta y elegir dónde competir.',
      },
      {
        value: 'ganado',
        emoji: '🏆',
        label: 'Ya he ganado contratos y quiero más volumen',
        hint: 'Tengo experiencia, me falta constancia.',
        weights: { socio: 5, 'alto-valor': 2 },
        reason: 'Ya ganaste antes: lo que te falta no es aprender, es un flujo constante de procesos y alguien que licite contigo mes a mes.',
      },
      {
        value: 'grandes',
        emoji: '🏗️',
        label: 'Ejecuto contratos grandes y busco procesos de alto valor',
        hint: 'Tengo capacidad operativa y financiera instalada.',
        weights: { 'alto-valor': 5, socio: 3 },
        reason: 'Tienes capacidad de ejecución instalada: tu cuello de botella es encontrar procesos grandes y ganables, no ejecutarlos.',
      },
    ],
  },
  {
    id: 'rup',
    short: 'RUP',
    title: '¿Cómo está tu RUP?',
    subtitle: 'El Registro Único de Proponentes es el filtro #1 para licitar.',
    columns: 2,
    options: [
      {
        value: 'vigente',
        emoji: '✅',
        label: 'Vigente y actualizado',
        weights: {},
      },
      {
        value: 'vencido',
        emoji: '⏳',
        label: 'Vencido o desactualizado',
        weights: { rup: 5 },
        reason: 'Con el RUP desactualizado te rechazan antes de que evalúen tu oferta: hay que ponerlo al día primero.',
      },
      {
        value: 'no-tengo',
        emoji: '📄',
        label: 'No lo tengo',
        weights: { rup: 5, proceso: 1 },
        reason: 'Sin RUP no puedes licitar: es el primer trámite, y la clasificación UNSPSC define a qué procesos podrás presentarte.',
      },
      {
        value: 'no-se',
        emoji: '🤔',
        label: 'No sé qué es',
        weights: { rup: 5, proceso: 2 },
        reason: 'Empezamos por lo básico: el RUP es lo que te habilita para licitar, y un análisis de viabilidad te evita perder plata en procesos que nunca ibas a ganar.',
      },
    ],
  },
  {
    id: 'freno',
    short: 'Freno principal',
    title: '¿Qué es lo que más te frena hoy?',
    subtitle: 'El obstáculo real, no el que se ve bonito.',
    columns: 1,
    options: [
      {
        value: 'no-se-como',
        emoji: '🧭',
        label: 'No entiendo cómo funciona el proceso',
        weights: { proceso: 4, rup: 1 },
        reason: 'Tu freno es de conocimiento: un análisis de viabilidad te explica, sobre un pliego real, qué te piden y si cumples.',
      },
      {
        value: 'sin-tiempo',
        emoji: '⏱️',
        label: 'No tengo tiempo de revisar SECOP a diario',
        weights: { socio: 5, 'alto-valor': 2 },
        reason: 'Tu freno es el tiempo: las oportunidades existen, pero nadie en tu equipo las está rastreando.',
      },
      {
        value: 'pliegos-amarrados',
        emoji: '🚩',
        label: 'Siento que los pliegos vienen amarrados',
        weights: { proceso: 5, socio: 2 },
        reason: 'Detectar direccionamiento es exactamente mi diferencial: sabrás si un pliego está amarrado ANTES de gastar en presentarte.',
      },
      {
        value: 'sin-equipo',
        emoji: '👥',
        label: 'No tengo equipo para armar las ofertas',
        weights: { socio: 5, proceso: 3 },
        reason: 'No necesitas contratar un área de licitaciones: necesitas un aliado que la opere por ti.',
      },
      {
        value: 'no-encuentro',
        emoji: '🔎',
        label: 'No encuentro procesos afines a mi tamaño',
        weights: { 'alto-valor': 4, socio: 3 },
        reason: 'El problema es de filtrado, no de oferta: hay procesos para tu perfil, pero no están saliendo en tus búsquedas.',
      },
    ],
  },
  {
    id: 'necesidad',
    short: 'Necesidad a 30 días',
    title: '¿Qué necesitas que pase en los próximos 30 días?',
    subtitle: 'Tu prioridad inmediata pesa más que la de largo plazo.',
    columns: 1,
    options: [
      {
        value: 'ver-oportunidades',
        emoji: '📡',
        label: 'Que alguien busque y filtre los procesos por mí',
        weights: { socio: 5, 'alto-valor': 3 },
      },
      {
        value: 'un-proceso',
        emoji: '📋',
        label: 'Presentarme a un proceso concreto que tengo en la mira',
        weights: { proceso: 6 },
        reason: 'Tienes un proceso concreto en la mira: no necesitas un mensual, necesitas ese pliego bien analizado y bien presentado.',
      },
      {
        value: 'aliado',
        emoji: '🤝',
        label: 'Tener un aliado que licite conmigo todos los meses',
        weights: { socio: 6 },
      },
      {
        value: 'oportunidad-grande',
        emoji: '💎',
        label: 'Que me lleguen oportunidades grandes listas para ejecutar',
        weights: { 'alto-valor': 6 },
      },
      {
        value: 'rup-listo',
        emoji: '🗂️',
        label: 'Dejar mis documentos y mi RUP en regla',
        weights: { rup: 6 },
      },
    ],
  },
  {
    id: 'sector',
    short: 'Sector',
    title: '¿En qué sector vendes?',
    subtitle: 'Define qué procesos vigilo y con qué fichas técnicas trabajo.',
    columns: 2,
    options: [
      {
        value: 'tecnologia',
        emoji: '💻',
        label: 'Tecnología y software',
        weights: { 'alto-valor': 2, socio: 1 },
        reason: 'Tecnología es uno de mis rubros fuertes: hablo el idioma técnico y sé que suelen exigir certificación de fabricante o de canal autorizado.',
      },
      {
        value: 'dotacion',
        emoji: '📦',
        label: 'Dotación y suministros',
        weights: { socio: 1, proceso: 1 },
        reason: 'Dotación y suministros es uno de mis rubros fuertes: sé dónde están los procesos y cómo se estructura el precio para ganarlos.',
      },
      {
        value: 'ferreteria',
        emoji: '🔧',
        label: 'Ferretería y materiales',
        weights: { socio: 1, proceso: 1 },
        reason: 'Ferretería y materiales es uno de los rubros que trabajo: herramientas, materiales de construcción, eléctricos e iluminación.',
      },
      {
        value: 'tiquetes',
        emoji: '✈️',
        label: 'Tiquetes aéreos y turismo',
        weights: { 'alto-valor': 1, socio: 1 },
        reason: 'En tiquetes aéreos los pliegos suelen exigir afiliación IATA, GDS y Registro Nacional de Turismo: reviso que cumplas antes de presentarte.',
      },
      {
        value: 'obras',
        emoji: '🏗️',
        label: 'Obras civiles e infraestructura',
        weights: { 'alto-valor': 2 },
      },
      {
        value: 'servicios',
        emoji: '📊',
        label: 'Servicios profesionales y consultoría',
        weights: { proceso: 1 },
      },
      {
        value: 'salud',
        emoji: '🏥',
        label: 'Salud y farmacéutica',
        weights: { proceso: 1 },
      },
      {
        value: 'otro',
        emoji: '🧩',
        label: 'Otro sector',
        weights: {},
      },
    ],
  },
  {
    id: 'inversion',
    short: 'Modelo de inversión',
    title: '¿Cómo prefieres invertir en esto?',
    subtitle: 'No hay respuesta mala: cada modelo tiene su servicio.',
    columns: 1,
    options: [
      {
        value: 'minimo',
        emoji: '🪙',
        label: 'Lo mínimo posible, quiero probar primero',
        hint: 'Un pago único, desde $150.000.',
        weights: { proceso: 4, rup: 3 },
        reason: 'Prefieres un pago único y bajo riesgo: empezamos con un análisis de viabilidad o tu RUP, que se pagan una sola vez.',
      },
      {
        value: 'por-proceso',
        emoji: '🎫',
        label: 'Solo cuando haya un proceso concreto',
        hint: 'Pago por entregable, sin permanencia.',
        weights: { proceso: 5 },
        reason: 'No quieres mensualidades: pagas por entregable, proceso a proceso.',
      },
      {
        value: 'mensual-alto',
        emoji: '🤝',
        label: 'Un aliado dedicado, con honorario mensual',
        hint: '$1.500.000 al mes + 1% solo si ganas.',
        weights: { socio: 6 },
        reason: 'Estás listo para un aliado dedicado: honorario fijo + comisión, así ambos jugamos por el mismo resultado.',
      },
      {
        value: 'por-resultado',
        emoji: '📈',
        label: 'Prefiero pagar sobre todo por resultado',
        hint: 'Honorario de arranque + 1% del valor adjudicado.',
        weights: { 'alto-valor': 5, socio: 2 },
        reason: 'Quieres pagar por resultado: el modelo de comisión por éxito alinea mi trabajo con tu adjudicación.',
      },
    ],
  },
];

export const QUESTION_MAP: Record<QuestionId, Question> = QUESTIONS.reduce(
  (acc, q) => ({ ...acc, [q.id]: q }),
  {} as Record<QuestionId, Question>
);
