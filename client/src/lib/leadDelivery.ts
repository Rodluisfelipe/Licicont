import type { DiagnosticLeadPayload } from '@/types';

/**
 * Entrega del lead sin backend propio.
 *
 * El canal principal es WhatsApp: el visitante envía su diagnóstico y ahí queda
 * la conversación. Adicionalmente, si se configura `VITE_LEAD_WEBHOOK_URL`
 * (Formspree, Google Apps Script, Zapier, n8n…), se manda una copia del
 * diagnóstico a ese recolector. Sin la variable, no se envía nada a terceros.
 */
const WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined;

export function isCollectorConfigured(): boolean {
  return Boolean(WEBHOOK_URL);
}

/**
 * Envío best-effort: nunca bloquea ni interrumpe la conversión.
 * `keepalive` permite que el navegador termine el envío aunque la pestaña
 * cambie a WhatsApp inmediatamente después.
 */
export function deliverLead(payload: DiagnosticLeadPayload): void {
  if (!WEBHOOK_URL) return;

  try {
    void fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* el diagnóstico ya está en WhatsApp y en el navegador del visitante */
  }
}
