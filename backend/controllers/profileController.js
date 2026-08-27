import { fetchProfile } from '../models/githubModel.js';
import { getCache, setCache } from '../services/cacheService.js';
import { normalizeGithubError } from '../services/githubErrors.js';

/**
 * Controller: Get GitHub user profile
 */
export async function getProfile(req, res) {
  const { username } = req.params;
  const cacheKey = `profile:${username.toLowerCase()}`;

  const cached = getCache(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  try {
    const profile = await fetchProfile(username);
    setCache(cacheKey, profile);
    return res.json({ ...profile, cached: false });
  } catch (err) {
    const e = normalizeGithubError(err, { username });
    return res.status(e.status).json(e);
  }
}
