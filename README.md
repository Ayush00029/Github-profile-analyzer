# GitHub Profile Analyzer

Analyze any GitHub user: profile stats, language breakdown, a 12-month commit
heatmap, and their most notable repositories. Express API + React (Vite) frontend.

```
.
├── backend/    Express API (GitHub proxy + in-memory cache)
└── frontend/   React app (SearchBar, ProfileCard, LanguageChart, CommitHeatmap, RepoList)
```

> **Note on the "M" in MERN:** the spec only calls for *in-memory* caching per
> username, so there's no MongoDB here — the cache lives in
> [`backend/services/cacheService.js`](backend/services/cacheService.js). Swapping it for a
> Mongo-backed store later means changing only that one module.

## Prerequisites

- Node.js 18.11+ (uses `node --watch` and native ESM)
- A GitHub personal access token (optional but recommended — raises the rate
  limit from 60 to 5,000 requests/hour). Create one at
  https://github.com/settings/tokens; no scopes are needed for public data.

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then edit .env and paste your GITHUB_TOKEN
npm run dev                 # http://localhost:5000  (npm start for no-watch)
```

Verify it works (no token needed for a quick test, but you'll hit 60/hr):

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/profile/torvalds
curl http://localhost:5000/api/repos/torvalds
curl http://localhost:5000/api/commits/torvalds
```

### API

| Route                     | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| `GET /api/profile/:user`  | Core user data (avatar, bio, followers, repo count, …)             |
| `GET /api/repos/:user`    | Repo list **plus** language usage aggregated across top repos      |
| `GET /api/commits/:user`  | Daily commit counts (last ~52 weeks) from the user's top repos     |
| `GET /api/health`         | `{ ok, tokenConfigured, cache }`                                   |
| `POST /api/cache/clear`   | Clears the in-memory cache                                         |

Responses are cached in memory per username for `CACHE_TTL` seconds (default 600).
Cached responses include `"cached": true`.

## 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`, so run the
backend first. For a production build set `VITE_API_BASE` to your backend origin
and run `npm run build`.

## How the data maps to the UI

- **ProfileCard** ← `/api/profile/:user`
- **LanguageChart** (recharts horizontal bars, top 8 + "Other") ← `languages` from `/api/repos/:user`
- **RepoList** (sortable by stars / recent activity) ← `repos` from `/api/repos/:user`
- **CommitHeatmap** (`react-calendar-heatmap`) ← `heatmap` from `/api/commits/:user`

Loading, "user not found", rate-limit, and backend-unreachable states are all
handled in the UI.
