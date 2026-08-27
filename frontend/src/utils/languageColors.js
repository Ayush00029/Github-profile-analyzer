// GitHub's canonical (Linguist) language colors. Users recognize these, so we keep
// them — and because every language is ALSO shown with a text label + %, identity is
// never carried by color alone (accessible even where these hues aren't CVD-distinct).
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  'Objective-C': '#438eff',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Less: '#1d365d',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Shell: '#89e051',
  PowerShell: '#012456',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  'Jupyter Notebook': '#DA5B0B',
  R: '#198CE7',
  Julia: '#a270ba',
  MATLAB: '#e16737',
  Perl: '#0298c3',
  Lua: '#000080',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Erlang: '#B83998',
  Clojure: '#db5855',
  'Emacs Lisp': '#c065db',
  OCaml: '#ef7a08',
  'F#': '#b845fc',
  Solidity: '#AA6746',
  Zig: '#ec915c',
  Nix: '#7e7eff',
  Assembly: '#6E4C13',
  TeX: '#3D6117',
  'Vim Script': '#199f4b',
  'Vim Snippet': '#199f4b',
  GDScript: '#355570',
  Groovy: '#4298b8',
  CoffeeScript: '#244776',
};

// Neutral gray for the aggregated "Other" bucket.
export const OTHER_COLOR = '#8b949e';

// Fallback hues (from a CVD-checked categorical set) for languages not in the map.
const FALLBACK = ['#4e79a7', '#f28e2b', '#59a14f', '#e15759', '#b07aa1', '#76b7b2', '#edc948'];

export function colorForLanguage(name, index = 0) {
  return LANGUAGE_COLORS[name] || FALLBACK[index % FALLBACK.length];
}
