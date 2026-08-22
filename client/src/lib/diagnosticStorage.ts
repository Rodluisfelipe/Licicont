/**
 * Persistencia local del diagnóstico — sin backend.
 *
 * Todo vive en el navegador del visitante: le permite retomar donde quedó,
 * volver a ver su plan sin repetir el cuestionario y no reescribir sus datos.
 * El canal que realmente entrega el lead sigue siendo WhatsApp.
 */

import type { Answers } from '@/lib/recommendation';
import type { LeadContact } from '@/lib/whatsapp';

const STORAGE_KEY = 'licicont:diagnostico:v1';

export interface StoredDiagnostic {
  answers: Answers;
  contact?: LeadContact;
  /** Momento en que se completó el cuestionario (ISO). */
  completedAt: string;
  /** El visitante llegó a abrir WhatsApp con su diagnóstico. */
  contacted?: boolean;
  serviceId?: string;
  serviceName?: string;
  affinity?: number;
}

/** El almacenamiento puede fallar (modo privado, cookies bloqueadas): nunca debe romper la página. */
function safeRead(): StoredDiagnostic | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDiagnostic;
    if (!parsed || typeof parsed !== 'object' || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

function safeWrite(value: StoredDiagnostic): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* sin almacenamiento disponible: el diagnóstico sigue funcionando en memoria */
  }
}

export function loadDiagnostic(): StoredDiagnostic | null {
  return safeRead();
}

export function saveDiagnostic(data: Omit<StoredDiagnostic, 'completedAt'>): void {
  safeWrite({ ...data, completedAt: new Date().toISOString() });
}

/** Marca que el visitante ya abrió WhatsApp y guarda sus datos de contacto. */
export function markContacted(contact: LeadContact): void {
  const current = safeRead();
  if (!current) return;
  safeWrite({ ...current, contact, contacted: true });
}

export function clearDiagnostic(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nada que limpiar */
  }
}
