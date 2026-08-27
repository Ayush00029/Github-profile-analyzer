export default function ErrorState({ error, username, onRetry }) {
  const code = error?.code;
  const details = error?.details || {};

  let title = 'Something went wrong';
  let message = error?.message || 'An unexpected error occurred.';
  let hint = null;

  if (code === 'not_found') {
    title = 'User not found';
    message = username
      ? `We couldn't find a GitHub user named "${username}".`
      : 'That GitHub user does not exist.';
    hint = 'Double-check the spelling — GitHub usernames are case-insensitive but must match exactly.';
  } else if (code === 'rate_limited') {
    title = 'GitHub rate limit reached';
    message = error.message;
    if (details.resetAt) {
      hint = `The limit resets at ${new Date(details.resetAt).toLocaleTimeString()}. Adding a GITHUB_TOKEN to backend/.env raises it to 5,000 requests/hour.`;
    } else {
      hint = 'Add a GITHUB_TOKEN to backend/.env to raise the limit to 5,000 requests/hour.';
    }
  } else if (code === 'bad_token') {
    title = 'Invalid GitHub token';
    hint = 'Check the GITHUB_TOKEN value in backend/.env.';
  } else if (code === 'network_error') {
    title = 'Backend unreachable';
    hint = 'Start the API with "npm run dev" inside the /backend folder, then try again.';
  }

  return (
    <div
      className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto text-center space-y-4 shadow-2xl"
      role="alert"
    >
      <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mx-auto text-2xl font-bold">
        ⚠️
      </div>
      <h3 className="text-xl font-bold text-rose-300">{title}</h3>
      <p className="text-sm text-slate-300">{message}</p>
      {hint && <p className="text-xs text-rose-400/80 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50">{hint}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-all"
        >
          Try again
        </button>
      )}
    </div>
  );
}
