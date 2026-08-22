export interface CreateInvitationDTO {
  fullName: string;
  email: string;
  company: string;
  nit: string;
  sector: string;
}

export interface ValidateResponse {
  valid: boolean;
  fullName?: string;
  message?: string;
}

export interface CreateLeadDTO {
  fullName: string;
  company: string;
  phone: string;
  email?: string;
  answers: Record<string, string>;
  recommendedService: string;
  recommendedServiceName: string;
  complements: string[];
  affinity: number;
}
