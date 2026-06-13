'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface TestResult {
  label: string;
  status: number;
  body: unknown;
}

/**
 * Dev OAuth/user-API tester. Calls the proxy endpoints and shows the safe,
 * normalized envelopes. These endpoints never return tokens, so nothing
 * sensitive is displayed. Login/logout navigate (they set HttpOnly cookies).
 */
export function QuranOAuthTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async (label: string, url: string, init?: RequestInit) => {
    setBusy(true);
    try {
      const res = await fetch(url, init);
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = '(no JSON body)';
      }
      setResults((prev) => [{ label, status: res.status, body }, ...prev].slice(0, 12));
    } catch (e) {
      setResults((prev) =>
        [{ label, status: 0, body: { error: String(e) } }, ...prev].slice(0, 12),
      );
    } finally {
      setBusy(false);
    }
  };

  const go = (url: string) => {
    window.location.href = url;
  };

  const tests: Array<{ label: string; fn: () => void }> = [
    { label: 'Login (redirect)', fn: () => go('/api/auth/quran-foundation/login?next=/developers/quran-oauth-test') },
    { label: 'Session / token refresh', fn: () => run('Session / token refresh', '/api/auth/quran-foundation/me') },
    { label: 'Profile', fn: () => run('Profile', '/api/quran-user/profile') },
    { label: 'Bookmarks', fn: () => run('Bookmarks', '/api/quran-user/bookmarks') },
    { label: 'Notes', fn: () => run('Notes', '/api/quran-user/notes') },
    { label: 'Preferences', fn: () => run('Preferences', '/api/quran-user/preferences') },
    { label: 'Collections', fn: () => run('Collections', '/api/quran-user/collections') },
    { label: 'Reading sessions', fn: () => run('Reading sessions', '/api/quran-user/reading-sessions') },
    { label: 'Logout (redirect)', fn: () => go('/api/auth/quran-foundation/logout') },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {tests.map((t) => (
          <Button key={t.label} size="sm" variant="secondary" onClick={t.fn} disabled={busy}>
            {t.label}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={() => setResults([])} disabled={busy}>
          Clear
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {results.length === 0 ? (
          <p className="text-sm text-cream-200/55">
            Run a test above. Start with <strong>Login</strong>, then <strong>Profile</strong>.
            Results show the safe envelopes — tokens are never returned.
          </p>
        ) : (
          results.map((r, i) => (
            <div key={i} className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-cream-50">{r.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    r.status >= 200 && r.status < 300
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-red-500/15 text-red-300'
                  }`}
                >
                  HTTP {r.status}
                </span>
              </div>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-[11px] leading-relaxed text-cream-100/85">
                {JSON.stringify(r.body, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
