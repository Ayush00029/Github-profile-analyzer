import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';

const router = Router();

// GET /api/profile/:username
router.get('/:username', getProfile);

export default router;
