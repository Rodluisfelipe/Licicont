import crypto from 'crypto';

/**
 * Genera un código alfanumérico de alta entropía.
 * Formato: XXXX-XXXX-XXXX (12 caracteres hex uppercase con guiones)
 */
export function generateAlphanumericCode(bytes: number = 6): string {
  const raw = crypto.randomBytes(bytes).toString('hex').toUpperCase();
  // Formato legible: XXXX-XXXX-XXXX
  return raw.match(/.{1,4}/g)?.join('-') || raw;
}

/**
 * Formatea fecha a string legible en español colombiano.
 */
export function formatDateCO(date: Date): string {
  return date.toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
