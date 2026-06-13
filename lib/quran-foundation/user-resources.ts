/**
 * Quran.Foundation user-feature resource map (server-only).
 *
 * Maps each /api/quran-user/<resource> proxy to the upstream user-API path and
 * the scope it requires. Paths are overridable via env so they can be
 * corrected/confirmed against the production user API without code changes
 * (pre-live exposes these under the user content API base).
 *
 * Nothing here is faked: a proxy returns real upstream data when the call
 * succeeds, or a clean fallback envelope (so the client uses Supabase/local).
 */

export interface UserResourceDef {
  /** Upstream path under the user API base (no host). */
  path: string;
  /** OAuth scope that gates it (for messaging only). */
  scope: string;
  /** Whether writes are supported through the proxy. */
  writable: boolean;
}

/**
 * Default upstream paths. The exact production paths are confirmed per the
 * Quran.Foundation user API docs; override any of them with
 * QURAN_FOUNDATION_USER_PATH_<RESOURCE> if they differ.
 */
const DEFAULTS: Record<string, UserResourceDef> = {
  profile: { path: '/__userinfo__', scope: 'profile', writable: false }, // special: OIDC userinfo
  bookmarks: { path: '/auth/v1/bookmarks', scope: 'bookmark', writable: true },
  collections: { path: '/auth/v1/collections', scope: 'collection', writable: true },
  notes: { path: '/auth/v1/notes', scope: 'note', writable: true },
  preferences: { path: '/auth/v1/preferences', scope: 'preference', writable: true },
  goals: { path: '/auth/v1/goals', scope: 'goal', writable: true },
  streaks: { path: '/auth/v1/streaks', scope: 'streak', writable: false },
  'activity-days': { path: '/auth/v1/activity_days', scope: 'activity_day', writable: false },
  'reading-sessions': { path: '/auth/v1/reading_sessions', scope: 'reading_session', writable: true },
  tags: { path: '/auth/v1/tags', scope: 'tag', writable: true },
  sync: { path: '/auth/v1/sync', scope: 'sync', writable: true },
};

export const USER_RESOURCES = Object.keys(DEFAULTS);

export function isUserResource(name: string): boolean {
  return name in DEFAULTS;
}

export function getUserResourceDef(name: string): UserResourceDef | null {
  const base = DEFAULTS[name];
  if (!base) return null;
  const envKey = `QURAN_FOUNDATION_USER_PATH_${name.replace(/-/g, '_').toUpperCase()}`;
  const override = process.env[envKey];
  return override ? { ...base, path: override } : base;
}
