import { useState, useCallback } from 'react';
import { fetchProfile, fetchRepos, fetchCommits } from './api/client.js';
import SearchBar from './components/SearchBar.jsx';
import ProfileCard from './components/ProfileCard.jsx';
import LanguageChart from './components/LanguageChart.jsx';
import CommitHeatmap from './components/CommitHeatmap.jsx';
import RepoList from './components/RepoList.jsx';
import Loader from './components/Loader.jsx';
import ErrorState from './components/ErrorState.jsx';

const EMPTY = {
  loading: false,
  error: null,
  profile: null,
  repos: null,
  commits: null,
  reposError: null,
  commitsError: null,
};

export default function App() {
  const [username, setUsername] = useState(null);
  const [state, setState] = useState(EMPTY);

  const search = useCallback(async (name) => {
    setUsername(name);
    setState({ ...EMPTY, loading: true });

    const [profileR, reposR, commitsR] = await Promise.allSettled([
      fetchProfile(name),
      fetchRepos(name),
      fetchCommits(name),
    ]);

    if (profileR.status === 'rejected') {
      setState({ ...EMPTY, error: profileR.reason });
      return;
    }

    setState({
      loading: false,
      error: null,
      profile: profileR.value,
      repos: reposR.status === 'fulfilled' ? reposR.value : null,
      reposError: reposR.status === 'rejected' ? reposR.reason : null,
      commits: commitsR.status === 'fulfilled' ? commitsR.value : null,
      commitsError: commitsR.status === 'rejected' ? commitsR.reason : null,
    });
  }, []);

  const { loading, error, profile, repos, commits, reposError, commitsError } = state;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-xl font-bold text-white">
              📊
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                GitHub Profile Analyzer
              </h1>
              <p className="text-xs text-slate-400">
                Stats, language breakdown, commit activity, and top repos
              </p>
            </div>
          </div>
          <SearchBar onSearch={search} loading={loading} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {loading && <Loader label={`Analyzing @${username}…`} />}

        {!loading && error && (
          <ErrorState error={error} username={username} onRetry={() => search(username)} />
        )}

        {!loading && !error && !profile && (
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              🔍
            </div>
            <h2 className="text-2xl font-semibold text-slate-100">Analyze Any GitHub Profile</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Enter a GitHub username in the search bar above to generate an instant report including
              repository stats, code language breakdown, commit history heatmaps, and top projects.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs text-slate-500">Try searching:</span>
              {['torvalds', 'gaearon', 'sindresorhus'].map((user) => (
                <button
                  key={user}
                  onClick={() => search(user)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-mono transition-colors border border-slate-700/60"
                >
                  @{user}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && profile && (
          <div className="space-y-6 animate-fadeIn">
            {/* Profile Overview */}
            <ProfileCard profile={profile} />

            {/* Language Chart & Commit Heatmap Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {repos ? (
                <LanguageChart languages={repos.languages} sampledFrom={repos.languagesSampledFrom} />
              ) : (
                <ErrorPanel title="Language breakdown" error={reposError} />
              )}

              {commits ? (
                <CommitHeatmap data={commits} />
              ) : (
                <ErrorPanel title="Commit activity" error={commitsError} />
              )}
            </div>

            {/* Top Repositories */}
            {repos ? (
              <RepoList repos={repos.repos} />
            ) : (
              <ErrorPanel title="Top repositories" error={reposError} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        Data provided by the GitHub REST API · Cached in-memory per user
      </footer>
    </div>
  );
}

function ErrorPanel({ title, error }) {
  return (
    <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-base font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 italic">
        {error?.message || 'Could not load this section.'}
      </p>
    </section>
  );
}
