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
