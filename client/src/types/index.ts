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

export interface DiagnosticLeadRequest {
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
}
