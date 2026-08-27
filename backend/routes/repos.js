import { Router } from 'express';
import { getRepos } from '../controllers/reposController.js';

const router = Router();

// GET /api/repos/:username
router.get('/:username', getRepos);

export default router;
