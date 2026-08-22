import { Lead, ILead } from '../models/Lead.js';
import { CreateLeadDTO } from '../types/index.js';

/**
 * Registra un lead del diagnóstico.
 *
 * A diferencia de las invitaciones, aquí no se rechazan duplicados: una misma
 * empresa puede repetir el diagnóstico y cada intento es información comercial.
 */
export async function createLead(data: CreateLeadDTO): Promise<ILead> {
  const lead = new Lead(data);
  await lead.save();
  return lead;
}

/** Listar leads más recientes primero (admin). */
export async function listLeads() {
  return Lead.find().sort({ createdAt: -1 }).lean();
}
