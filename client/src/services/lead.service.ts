import { api } from '@/lib/api';
import type { ApiResponse, DiagnosticLeadRequest } from '@/types';

/**
 * Registra el lead del diagnóstico en el backend.
 *
 * La conversión real ocurre por WhatsApp, así que este guardado es
 * best-effort: si el API no está disponible el usuario no debe notar nada.
 */
export async function submitDiagnosticLead(
  data: DiagnosticLeadRequest
): Promise<ApiResponse | null> {
  try {
    const response = await api.post('/leads', data);
    return response.data;
  } catch {
    return null;
  }
}
