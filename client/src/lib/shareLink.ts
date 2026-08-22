/**
 * Enlace compartible del diagnóstico — sin backend.
 *
 * Las respuestas viajan codificadas en la propia URL, así que un resultado se
 * puede guardar, reenviar o retomar desde otro dispositivo sin base de datos.
 * Se usan claves de texto (no índices) para que un enlace antiguo siga siendo
 * válido aunque cambie el orden de las preguntas.
 */

import { QUESTION_MAP, QUESTIONS, type QuestionId } from '@/data/diagnostic';
import type { Answers } from '@/lib/recommendation';

export const SHARE_PARAM = 'd';

const PAIR_SEPARATOR = '~';
const KEY_SEPARATOR = '.';

export function encodeAnswers(answers: Answers): string {
  return QUESTIONS.filter((q) => answers[q.id])
    .map((q) => `${q.id}${KEY_SEPARATOR}${answers[q.id]}`)
    .join(PAIR_SEPARATOR);
}

/** Descarta cualquier par que no exista hoy en el cuestionario. */
export function decodeAnswers(encoded: string): Answers {
  const answers: Answers = {};

  for (const pair of encoded.split(PAIR_SEPARATOR)) {
    const separatorAt = pair.indexOf(KEY_SEPARATOR);
    if (separatorAt < 1) continue;

    const key = pair.slice(0, separatorAt) as QuestionId;
    const value = pair.slice(separatorAt + 1);

    const question = QUESTION_MAP[key];
    if (!question) continue;
    if (!question.options.some((o) => o.value === value)) continue;

    answers[key] = value;
  }

  return answers;
}

/** URL absoluta al diagnóstico ya resuelto. */
export function buildShareUrl(answers: Answers): string {
  const url = new URL(window.location.origin);
  url.searchParams.set(SHARE_PARAM, encodeAnswers(answers));
  url.hash = 'diagnostico';
  return url.toString();
}

/** Lee las respuestas de la URL actual, si vienen. */
export function readAnswersFromUrl(): Answers | null {
  try {
    const encoded = new URLSearchParams(window.location.search).get(SHARE_PARAM);
    if (!encoded) return null;

    const answers = decodeAnswers(encoded);
    return Object.keys(answers).length > 0 ? answers : null;
  } catch {
    return null;
  }
}

/** Refleja el resultado en la barra de direcciones sin recargar ni navegar. */
export function syncUrl(answers: Answers): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set(SHARE_PARAM, encodeAnswers(answers));
    window.history.replaceState(null, '', url.toString());
  } catch {
    /* si el navegador lo impide, el diagnóstico sigue visible en pantalla */
  }
}

export function clearUrl(): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete(SHARE_PARAM);
    window.history.replaceState(null, '', url.toString());
  } catch {
    /* sin efecto */
  }
}
