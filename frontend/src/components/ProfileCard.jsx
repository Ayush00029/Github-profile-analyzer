import { formatNumber, normalizeUrl } from '../utils/format.js';

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center sm:items-start p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
      <span className="text-xl font-bold text-slate-100">{formatNumber(value)}</span>
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function ProfileCard({ profile }) {
  const joined = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : null;

  return (
    <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
      <div className="relative">
        <img
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-slate-700/60 shadow-2xl object-cover"
          src={profile.avatarUrl}
          alt={`${profile.login}'s avatar`}
          loading="lazy"
        />
        <a
          href={profile.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg shadow-md transition-colors text-xs font-semibold"
          title="Open GitHub Profile"
        >
          ↗
        </a>
      </div>

      <div className="flex-1 w-full text-center sm:text-left space-y-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 justify-center sm:justify-start">
            <h2 className="text-2xl font-bold text-slate-100">{profile.name || profile.login}</h2>
            <a
              href={profile.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-blue-400 hover:underline"
            >
              @{profile.login}
            </a>
          </div>
          {profile.bio && <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">{profile.bio}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto sm:mx-0">
          <Stat label="Repositories" value={profile.publicRepos} />
          <Stat label="Followers" value={profile.followers} />
          <Stat label="Following" value={profile.following} />
        </div>

        <ul className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 text-xs text-slate-400">
          {profile.company && (
            <li className="flex items-center gap-1.5">
              <span>🏢</span> {profile.company}
            </li>
          )}
          {profile.location && (
            <li className="flex items-center gap-1.5">
              <span>📍</span> {profile.location}
            </li>
          )}
          {profile.blog && (
            <li className="flex items-center gap-1.5">
              <span>🔗</span>{' '}
              <a
                href={normalizeUrl(profile.blog)}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline truncate max-w-xs"
              >
                {profile.blog}
              </a>
            </li>
          )}
          {profile.twitter && (
            <li className="flex items-center gap-1.5">
              <span>🐦</span>{' '}
              <a
                href={`https://twitter.com/${profile.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                @{profile.twitter}
              </a>
            </li>
          )}
          {joined && (
            <li className="flex items-center gap-1.5">
              <span>📅</span> Joined {joined}
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
