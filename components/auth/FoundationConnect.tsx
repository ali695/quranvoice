'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface MeResponse {
  configured: boolean;
  signedIn: boolean;
  user?: { sub: string | null; name: string | null; email: string | null };
}

/**
 * "Sign in with Quran.Foundation" connection card.
 *
 * Shows connect / connected state by reading /api/auth/quran-foundation/me.
 * Renders nothing when the user-auth integration isn't configured, so the
 * UI stays clean on deployments that only use content credentials.
 */
export function FoundationConnect({ next = '/profile' }: { next?: string }) {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/quran-foundation/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((j: MeResponse | null) => {
        if (active) setMe(j);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Not configured → render nothing.
  if (!loading && me && !me.configured) return null;

  const loginHref = `/api/auth/quran-foundation/login?next=${encodeURIComponent(next)}`;

  return (
    <div className="rounded-2xl border border-ink-600/50 bg-ink-800/40 p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
        <Icon name="mosque" size={14} />
        Quran.Foundation account
      </div>

      {loading ? (
        <div className="mt-3 h-9 w-48 animate-pulse rounded-lg bg-ink-700/50" />
      ) : me?.signedIn ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-cream-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <Icon name="check" size={14} />
            </span>
            <span>
              Connected
              {me.user?.name ? ` as ${me.user.name}` : me.user?.email ? ` as ${me.user.email}` : ''}
            </span>
          </div>
          <a
            href="/api/auth/quran-foundation/logout"
            className="rounded-lg border border-ink-600/70 px-3 py-2 text-xs font-medium text-cream-200/80 hover:border-red-400/40 hover:text-red-300"
          >
            Disconnect
          </a>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-sm leading-relaxed text-cream-200/75">
            Connect your Quran.Foundation account to sync bookmarks, notes, and reading progress
            across apps that use the Foundation.
          </p>
          <a
            href={loginHref}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-medium text-ink-950 hover:bg-gold-400"
          >
            <Icon name="mosque" size={15} />
            Sign in with Quran.Foundation
          </a>
        </div>
      )}
    </div>
  );
}
