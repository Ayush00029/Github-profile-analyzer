import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

let client;

/**
 * Lazily-created, memoized Axios instance pointed at the GitHub REST API.
 */
export function githubClient() {
  if (client) return client;

  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'github-profile-analyzer',
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token && token !== 'your_token_here') {
    headers.Authorization = `Bearer ${token}`;
  }

  client = axios.create({
    baseURL: GITHUB_API,
    headers,
    timeout: 15000,
  });

  return client;
}

export function hasToken() {
  const token = process.env.GITHUB_TOKEN?.trim();
  return Boolean(token && token !== 'your_token_here');
}
