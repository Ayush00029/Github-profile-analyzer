import { githubClient } from '../config/githubClient.js';

const MAX_REPOS_FOR_LANGUAGES = 40;
const CONCURRENCY = 6;
const TOP_REPOS_FOR_COMMITS = 5;

// Helper: Run an async fn over items with a bounded number of workers.
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

// Helper: GitHub computes /stats/commit_activity asynchronously and returns 202.
async function getCommitActivity(gh, fullName, { retries = 2, delayMs = 1500 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const resp = await gh.get(`/repos/${fullName}/stats/commit_activity`, {
      validateStatus: (s) => s === 200 || s === 202 || s === 204,
    });
    if (resp.status === 200 && Array.isArray(resp.data)) return resp.data;
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return [];
}

function ymd(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

/**
 * Model: GitHub User Profile
 */
export async function fetchProfile(username) {
  const gh = githubClient();
  const { data } = await gh.get(`/users/${encodeURIComponent(username)}`);

  return {
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    company: data.company,
    location: data.location,
    blog: data.blog,
    twitter: data.twitter_username,
    htmlUrl: data.html_url,
    publicRepos: data.public_repos,
    publicGists: data.public_gists,
    followers: data.followers,
    following: data.following,
    hireable: data.hireable,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Model: GitHub Repositories & Language Breakdown
 */
export async function fetchRepos(username) {
  const gh = githubClient();

  const { data: rawRepos } = await gh.get(`/users/${encodeURIComponent(username)}/repos`, {
    params: { per_page: 100, sort: 'updated', type: 'owner' },
  });

  const repos = rawRepos.map((r) => ({
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    htmlUrl: r.html_url,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    watchers: r.watchers_count,
    openIssues: r.open_issues_count,
    isFork: r.fork,
    isArchived: r.archived,
    pushedAt: r.pushed_at,
    updatedAt: r.updated_at,
    createdAt: r.created_at,
    topics: r.topics || [],
  }));

  // Aggregate languages from top non-fork repos by stars
  const sampled = repos
    .filter((r) => !r.isFork)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, MAX_REPOS_FOR_LANGUAGES);

  const languageMaps = await mapWithConcurrency(sampled, CONCURRENCY, async (repo) => {
    try {
      const { data } = await gh.get(`/repos/${repo.fullName}/languages`);
      return data;
    } catch {
      return {};
    }
  });

  const languages = {};
  for (const map of languageMaps) {
    for (const [lang, bytes] of Object.entries(map)) {
      languages[lang] = (languages[lang] || 0) + bytes;
    }
  }

  return {
    count: repos.length,
    totalStars: repos.reduce((sum, r) => sum + r.stars, 0),
    totalForks: repos.reduce((sum, r) => sum + r.forks, 0),
    languagesSampledFrom: sampled.length,
    languages,
    repos,
  };
}

/**
 * Model: GitHub Commit Activity Heatmap
 */
export async function fetchCommits(username) {
  const gh = githubClient();

  const { data: rawRepos } = await gh.get(`/users/${encodeURIComponent(username)}/repos`, {
    params: { per_page: 100, sort: 'pushed', type: 'owner' },
  });

  const topRepos = rawRepos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, TOP_REPOS_FOR_COMMITS);

  const activities = await Promise.all(
    topRepos.map((r) => getCommitActivity(gh, r.full_name).catch(() => []))
  );

  const dayCounts = new Map();
  let totalCommits = 0;

  for (const weeks of activities) {
    for (const week of weeks) {
      if (!week || !Array.isArray(week.days)) continue;
      for (let d = 0; d < week.days.length; d++) {
        const count = week.days[d];
        if (!count) continue;
        const date = new Date((week.week + d * 86400) * 1000);
        const key = ymd(date);
        dayCounts.set(key, (dayCounts.get(key) || 0) + count);
        totalCommits += count;
      }
    }
  }

  const heatmap = [...dayCounts.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return {
    totalCommits,
    reposAnalyzed: topRepos.map((r) => r.full_name),
    complete: activities.every((a) => a.length > 0) || topRepos.length === 0,
    heatmap,
  };
}
