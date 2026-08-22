import { Router } from 'express';
import * as leadController from '../controllers/lead.controller.js';
import { leadRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Público — Registrar diagnóstico (rate limited)
router.post('/', leadRateLimiter, leadController.create);

// Admin — Listar leads
router.get('/', leadController.list);

export default router;
