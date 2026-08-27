import { Router } from 'express';
import profileRoutes from './profile.js';
import reposRoutes from './repos.js';
import commitsRoutes from './commits.js';
import healthRoutes from './health.js';

const router = Router();

router.use('/profile', profileRoutes);
router.use('/repos', reposRoutes);
router.use('/commits', commitsRoutes);

// Health endpoints (/api/health and /api/cache/clear)
router.use('/health', healthRoutes);
router.use('/cache', healthRoutes);

export default router;
