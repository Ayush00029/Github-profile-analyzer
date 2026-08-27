// Tiny in-memory TTL cache, keyed by "route:username".
// Serves as the Cache Model / Service layer.

const store = new Map();

function defaultTtlMs() {
  return Number(process.env.CACHE_TTL || 600) * 1000;
}

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCache(key, value, ttlMs) {
  store.set(key, { value, expires: Date.now() + (ttlMs ?? defaultTtlMs()) });
}

export function clearCache() {
  store.clear();
}

export function cacheStats() {
  return { size: store.size, keys: [...store.keys()] };
}
