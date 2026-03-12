import { api } from '@/lib/api';
import type { InvitationRequest, ApiResponse, ValidationData } from '@/types';

export async function submitInvitation(data: InvitationRequest): Promise<ApiResponse> {
  const response = await api.post('/invitations', data);
  return response.data;
}

export async function validateAccessCode(code: string): Promise<ApiResponse<ValidationData>> {
  const response = await api.get(`/invitations/validate/${code}`);
  return response.data;
}
