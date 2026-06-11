const BASE = import.meta.env.BASE_URL;

export function asset(path: string): string {
  if (path.startsWith('/')) return `${BASE}${path.slice(1)}`;
  return `${BASE}${path}`;
}
