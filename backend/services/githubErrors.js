// Translate an axios/GitHub error into a clean { status, error, message } shape
// that the frontend can render as a friendly message.
export function normalizeGithubError(err, { username } = {}) {
  if (err.response) {
    const { status, headers, data } = err.response;

    if (status === 404) {
      return {
        status: 404,
        error: 'not_found',
        message: username
          ? `GitHub user "${username}" was not found.`
          : 'The requested GitHub resource was not found.',
      };
    }

    // Primary rate limit: 403/429 with remaining === 0.
    const remaining = headers?.['x-ratelimit-remaining'];
    if ((status === 403 || status === 429) && remaining === '0') {
      const resetSec = Number(headers?.['x-ratelimit-reset']);
      return {
        status: 429,
        error: 'rate_limited',
        message:
          'GitHub API rate limit exceeded. Add a GITHUB_TOKEN to backend/.env to raise the limit to 5,000 requests/hour.',
        resetAt: Number.isFinite(resetSec) ? new Date(resetSec * 1000).toISOString() : undefined,
      };
    }

    // Secondary/abuse rate limit.
    if ((status === 403 || status === 429) && headers?.['retry-after']) {
      return {
        status: 429,
        error: 'rate_limited',
        message: 'GitHub API secondary rate limit hit. Please wait a moment and try again.',
        retryAfter: Number(headers['retry-after']),
      };
    }

    if (status === 401) {
      return {
        status: 401,
        error: 'bad_token',
        message: 'The configured GITHUB_TOKEN is invalid or expired.',
      };
    }

    return {
      status: 502,
      error: 'github_error',
      message: data?.message || `GitHub API returned status ${status}.`,
    };
  }

  if (err.code === 'ECONNABORTED') {
    return { status: 504, error: 'timeout', message: 'The request to the GitHub API timed out.' };
  }

  return { status: 500, error: 'server_error', message: err.message || 'Unexpected server error.' };
}
