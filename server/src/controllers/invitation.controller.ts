import { Request, Response } from 'express';
import * as invitationService from '../services/invitation.service.js';

/**
 * POST /api/invitations
 * Crear solicitud de invitación.
 */
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, email, company, nit, sector } = req.body;

    if (!fullName || !email || !company || !nit || !sector) {
      res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos',
      });
      return;
    }

    const invitation = await invitationService.createInvitation({
      fullName,
      email,
      company,
      nit,
      sector,
    });

    res.status(201).json({
      success: true,
      message: 'Solicitud recibida. Si cumple los criterios, recibirá sus credenciales.',
      data: {
        id: invitation._id,
        email: invitation.email,
        status: invitation.status,
      },
    });
  } catch (error: any) {
    if (error.message === 'DUPLICATE_EMAIL') {
      res.status(409).json({
        success: false,
        message: 'Ya existe una solicitud con este correo electrónico',
      });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al procesar solicitud' });
  }
}

/**
 * POST /api/invitations/:id/send
 * Aprobar y enviar invitación (admin).
 */
export async function send(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const invitation = await invitationService.sendInvitation(id);

    res.json({
      success: true,
      message: 'Invitación enviada exitosamente',
      data: {
        id: invitation._id,
        email: invitation.email,
        code: invitation.code,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      res.status(404).json({ success: false, message: 'Invitación no encontrada' });
      return;
    }
    if (error.message === 'ALREADY_PROCESSED') {
      res.status(400).json({ success: false, message: 'Esta invitación ya fue procesada' });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al enviar invitación' });
  }
}

/**
 * GET /api/invitations/validate/:code
 * Validar código de acceso.
 */
export async function validate(req: Request, res: Response): Promise<void> {
  try {
    const { code } = req.params;
    const result = await invitationService.validateCode(code);

    if (!result.valid) {
      res.status(403).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.json({
      success: true,
      message: result.message,
      data: { fullName: result.fullName },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Error al validar código' });
  }
}

/**
 * GET /api/invitations
 * Listar todas las invitaciones (admin).
 */
export async function list(_req: Request, res: Response): Promise<void> {
  try {
    const invitations = await invitationService.listInvitations();
    res.json({ success: true, data: invitations });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener invitaciones' });
  }
}
