const BASE = import.meta.env.VITE_API_BASE || '';

async function get(path) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`);
  } catch (networkErr) {
    const err = new Error(
      'Could not reach the backend. Is the API running on port 5000? (npm run dev in /backend)'
    );
    err.code = 'network_error';
    throw err;
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const err = new Error(body?.message || `Request failed with status ${res.status}`);
    err.status = res.status;
    err.code = body?.error;
    err.details = body;
    throw err;
  }
  return body;
}

export function fetchProfile(username) {
  return get(`/api/profile/${encodeURIComponent(username)}`);
}

export function fetchRepos(username) {
  return get(`/api/repos/${encodeURIComponent(username)}`);
}

export function fetchCommits(username) {
  return get(`/api/commits/${encodeURIComponent(username)}`);
}
