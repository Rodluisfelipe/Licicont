import { Router } from 'express';
import * as invitationController from '../controllers/invitation.controller.js';
import { invitationRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Público — Solicitar credenciales (rate limited)
router.post('/', invitationRateLimiter, invitationController.create);

// Público — Validar código de acceso
router.get('/validate/:code', invitationController.validate);

// Admin — Enviar invitación
router.post('/:id/send', invitationController.send);

// Admin — Listar invitaciones
router.get('/', invitationController.list);

export default router;
