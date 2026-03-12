import { Invitation, IInvitation } from '../models/Invitation.js';
import { INVITATION_EXPIRY_HOURS } from '../config/constants.js';
import { sendInvitationEmail } from './email.service.js';
import { CreateInvitationDTO, ValidateResponse } from '../types/index.js';

/**
 * Crear nueva solicitud de invitación (status: pending).
 */
export async function createInvitation(data: CreateInvitationDTO): Promise<IInvitation> {
  const existing = await Invitation.findOne({ email: data.email });
  if (existing) {
    throw new Error('DUPLICATE_EMAIL');
  }

  const invitation = new Invitation({
    ...data,
    code: Invitation.generateCode(),
    status: 'pending',
  });

  await invitation.save();
  return invitation;
}

/**
 * Aprobar y enviar invitación (admin action).
 * Genera expiración y envía email con código.
 */
export async function sendInvitation(invitationId: string): Promise<IInvitation> {
  const invitation = await Invitation.findById(invitationId);
  if (!invitation) {
    throw new Error('NOT_FOUND');
  }
  if (invitation.status !== 'pending') {
    throw new Error('ALREADY_PROCESSED');
  }

  // Setear expiración a 48h desde ahora
  invitation.status = 'sent';
  invitation.expiresAt = new Date(Date.now() + INVITATION_EXPIRY_HOURS * 60 * 60 * 1000);
  await invitation.save();

  // Enviar email
  await sendInvitationEmail({
    to: invitation.email,
    fullName: invitation.fullName,
    code: invitation.code,
  });

  return invitation;
}

/**
 * Validar código de acceso.
 * Retorna datos del usuario si válido; lanza error si no.
 */
export async function validateCode(code: string): Promise<ValidateResponse> {
  const invitation = await Invitation.findOne({ code: code.toUpperCase() });

  if (!invitation) {
    return { valid: false, message: 'Código no encontrado' };
  }

  if (invitation.status === 'redeemed') {
    return { valid: false, message: 'Este código ya fue utilizado' };
  }

  if (invitation.status === 'pending') {
    return { valid: false, message: 'Este código aún no ha sido activado' };
  }

  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    invitation.status = 'expired';
    await invitation.save();
    return { valid: false, message: 'Su ventana de oportunidad ha cerrado' };
  }

  // Marcar como redimido
  invitation.status = 'redeemed';
  await invitation.save();

  return {
    valid: true,
    fullName: invitation.fullName,
    message: 'Acceso concedido',
  };
}

/**
 * Listar todas las invitaciones (admin).
 */
export async function listInvitations(): Promise<IInvitation[]> {
  return Invitation.find().sort({ createdAt: -1 }).lean();
}
