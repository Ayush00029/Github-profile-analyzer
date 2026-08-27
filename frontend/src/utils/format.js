// Compact number formatting: 1234 -> "1.2k", 1500000 -> "1.5M"
export function formatNumber(n) {
  if (n === null || n === undefined) return '—';
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

// Human-readable byte sizes for language tooltips.
export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

// "2 days ago" style relative time.
export function timeAgo(dateString) {
  if (!dateString) return '';
  const then = new Date(dateString).getTime();
  const seconds = Math.round((Date.now() - then) / 1000);
  const ranges = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, secs] of ranges) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

// Ensure external links have a protocol (GitHub "blog" fields are often bare hosts).
export function normalizeUrl(url) {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
