import { Request, Response } from 'express';
import * as leadService from '../services/lead.service.js';

/**
 * POST /api/leads
 * Registrar un lead generado por el diagnóstico interactivo.
 */
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const {
      fullName,
      company,
      phone,
      email,
      answers,
      recommendedService,
      recommendedServiceName,
      complements,
      affinity,
    } = req.body;

    if (!fullName || !company || !phone || !recommendedService) {
      res.status(400).json({
        success: false,
        message: 'Nombre, empresa, teléfono y servicio recomendado son requeridos',
      });
      return;
    }

    const lead = await leadService.createLead({
      fullName,
      company,
      phone,
      email,
      answers: answers && typeof answers === 'object' ? answers : {},
      recommendedService,
      recommendedServiceName: recommendedServiceName || recommendedService,
      complements: Array.isArray(complements) ? complements : [],
      affinity: typeof affinity === 'number' ? affinity : 0,
    });

    res.status(201).json({
      success: true,
      message: 'Diagnóstico registrado',
      data: {
        id: lead._id,
        recommendedService: lead.recommendedService,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Error al registrar el diagnóstico' });
  }
}

/**
 * GET /api/leads
 * Listar leads del diagnóstico (admin).
 */
export async function list(_req: Request, res: Response): Promise<void> {
  try {
    const leads = await leadService.listLeads();
    res.json({ success: true, data: leads });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener leads' });
  }
}
