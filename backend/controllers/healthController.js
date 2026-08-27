import { hasToken } from '../config/githubClient.js';
import { cacheStats, clearCache } from '../services/cacheService.js';

/**
 * Controller: Health status & cache debugging endpoints
 */
export function getHealth(req, res) {
  return res.json({
    ok: true,
    tokenConfigured: hasToken(),
    cache: cacheStats(),
  });
}

export function handleClearCache(req, res) {
  clearCache();
  return res.json({ ok: true, message: 'Cache cleared successfully' });
}
