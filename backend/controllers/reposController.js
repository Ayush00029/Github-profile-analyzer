import { fetchRepos } from '../models/githubModel.js';
import { getCache, setCache } from '../services/cacheService.js';
import { normalizeGithubError } from '../services/githubErrors.js';

/**
 * Controller: Get GitHub user repositories & aggregated language breakdown
 */
export async function getRepos(req, res) {
  const { username } = req.params;
  const cacheKey = `repos:${username.toLowerCase()}`;

  const cached = getCache(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  try {
    const payload = await fetchRepos(username);
    setCache(cacheKey, payload);
    return res.json({ ...payload, cached: false });
  } catch (err) {
    const e = normalizeGithubError(err, { username });
    return res.status(e.status).json(e);
  }
}
