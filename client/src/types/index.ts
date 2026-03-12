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
