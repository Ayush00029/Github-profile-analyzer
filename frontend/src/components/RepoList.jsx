import { useState } from 'react';
import { colorForLanguage } from '../utils/languageColors.js';
import { formatNumber, timeAgo } from '../utils/format.js';

const LIMIT = 8;

const SORTS = {
  stars: { label: 'Most starred', compare: (a, b) => b.stars - a.stars },
  active: {
    label: 'Recently active',
    compare: (a, b) => new Date(b.pushedAt) - new Date(a.pushedAt),
  },
};

function RepoRow({ repo }) {
  return (
    <li className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-slate-700 transition-all space-y-2 group">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="text-base font-semibold text-blue-400 group-hover:text-blue-300 transition-colors"
          >
            {repo.name}
          </a>
          {repo.isFork && (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
              fork
            </span>
          )}
          {repo.isArchived && (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
              archived
            </span>
          )}
        </div>
      </div>

      {repo.description && <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{repo.description}</p>}

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
        {repo.language && (
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: colorForLanguage(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span title="Stars" className="flex items-center gap-1">
          <span className="text-amber-400">★</span> {formatNumber(repo.stars)}
        </span>
        <span title="Forks" className="flex items-center gap-1">
          <span>⑂</span> {formatNumber(repo.forks)}
        </span>
        {repo.pushedAt && <span className="text-slate-500 ml-auto">Updated {timeAgo(repo.pushedAt)}</span>}
      </div>
    </li>
  );
}

export default function RepoList({ repos }) {
  const [sort, setSort] = useState('stars');

  if (!repos || repos.length === 0) {
    return (
      <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-semibold text-slate-100">Top Repositories</h3>
        <p className="text-sm text-slate-500 italic mt-2">This user has no public repositories.</p>
      </section>
    );
  }

  const sorted = [...repos].sort(SORTS[sort].compare).slice(0, LIMIT);

  return (
    <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-100">Top Repositories</h3>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {Object.entries(SORTS).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sort === key
                  ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((repo) => (
          <RepoRow key={repo.fullName} repo={repo} />
        ))}
      </ul>
    </section>
  );
}
