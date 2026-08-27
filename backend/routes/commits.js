import { Router } from 'express';
import { getCommits } from '../controllers/commitsController.js';

const router = Router();

// GET /api/commits/:username
router.get('/:username', getCommits);

export default router;
