import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full md:w-80">
      <input
        type="text"
        name="username"
        placeholder="Search GitHub user…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="GitHub username"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        autoFocus
        className="w-full bg-slate-950/80 text-slate-100 placeholder-slate-500 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pr-24"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-xs font-medium text-white shadow-md shadow-blue-600/20 transition-all"
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>
    </form>
  );
}
