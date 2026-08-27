import { Router } from 'express';
import { getHealth, handleClearCache } from '../controllers/healthController.js';

const router = Router();

// GET /api/health
router.get('/', getHealth);

// POST /api/cache/clear
router.post('/clear', handleClearCache);

export default router;
