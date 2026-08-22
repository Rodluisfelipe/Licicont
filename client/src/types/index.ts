export interface InvitationRequest {
  fullName: string;
  email: string;
  company: string;
  nit: string;
  sector: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ValidationData {
  fullName: string;
}

export interface TikTokMetric {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon?: string;
}

/**
 * Diagnóstico completado. Se guarda en el navegador del visitante y, si se
 * configura un recolector externo (VITE_LEAD_WEBHOOK_URL), se envía también ahí.
 */
export interface DiagnosticLeadPayload {
  fullName: string;
  company: string;
  phone: string;
  email?: string;
  /** Respuestas del cuestionario: { [questionId]: optionValue } */
  answers: Record<string, string>;
  recommendedService: string;
  recommendedServiceName: string;
  complements: string[];
  affinity: number;
  /** Enlace que reabre este mismo resultado. */
  shareUrl: string;
  submittedAt: string;
}
