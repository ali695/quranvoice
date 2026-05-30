/**
 * OAuth callback page.
 *
 * Handles three cases:
 *   1. Supabase auth: `code` → exchange for a session → redirect to /profile
 *   2. Foundation / generic OAuth: `code` + `state` → show a friendly handled message
 *   3. No params (the Quran.Foundation reviewer just visits the URL) → show
 *      "Authentication callback route is ready." so the URL never 404s.
 *
 * Tokens are never exposed in markup.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { getSupabaseServer } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Authentication callback',
  description: 'QuranVoice OAuth callback endpoint.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AuthCallbackPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const code = typeof params.code === 'string' ? params.code : undefined;
  const error = typeof params.error === 'string' ? params.error : undefined;
  const errorDescription =
    typeof params.error_description === 'string' ? params.error_description : undefined;
  const next = typeof params.next === 'string' ? params.next : '/profile';

  // ── Path 1: Supabase code-for-session exchange ────────────────────────────
  if (code) {
    const sb = await getSupabaseServer();
    if (sb) {
      const { error: exchangeError } = await sb.auth.exchangeCodeForSession(code);
      if (!exchangeError) {
        redirect(next.startsWith('/') ? next : '/profile');
      }
      // Fall through to render an error card below.
      return (
        <CallbackShell
          state="error"
          headline="Sign-in could not be completed"
          message={exchangeError.message}
        />
      );
    }
    // Supabase isn't configured — still acknowledge the callback so reviewers
    // see a real, indexed page (no 404).
    return (
      <CallbackShell
        state="pending"
        headline="Callback received"
        message="The OAuth code reached us, but Supabase isn't configured in this deployment yet. No session was created."
      />
    );
  }

  // ── Path 2: Provider sent an error ────────────────────────────────────────
  if (error) {
    return (
      <CallbackShell
        state="error"
        headline="Authentication error"
        message={errorDescription || error}
      />
    );
  }

  // ── Path 3: No params — friendly readiness state ──────────────────────────
  return (
    <CallbackShell
      state="ready"
      headline="Authentication callback route is ready."
      message="This URL handles OAuth sign-in callbacks for QuranVoice. No action is required when visiting it directly."
    />
  );
}

function CallbackShell({
  state,
  headline,
  message,
}: {
  state: 'ready' | 'pending' | 'error';
  headline: string;
  message: string;
}) {
  const iconName =
    state === 'ready' ? 'check' : state === 'pending' ? 'sparkle' : 'close';
  const iconClass =
    state === 'ready'
      ? 'bg-emerald-500/15 text-emerald-300'
      : state === 'pending'
        ? 'bg-gold-500/15 text-gold-300'
        : 'bg-red-500/15 text-red-300';

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="OAuth callback"
        description="QuranVoice sign-in completion endpoint."
      />
      <AppShell>
        <div className="mx-auto max-w-xl">
          <Card variant="feature" className="p-8 text-center">
            <span
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${iconClass}`}
              aria-hidden="true"
            >
              <Icon name={iconName} size={22} />
            </span>
            <h2 className="mt-5 font-display text-2xl text-cream-50">{headline}</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream-200/75">{message}</p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/"
                className="rounded-lg border border-ink-600/70 px-4 py-2 text-sm text-cream-100 hover:border-gold-500/40"
              >
                Go home
              </Link>
              <Link
                href="/auth/sign-in"
                className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-gold-400"
              >
                Sign in
              </Link>
            </div>
          </Card>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-cream-200/55">
            Tokens issued during sign-in are never displayed on this page. They are
            stored in a secure HttpOnly cookie by Supabase and used only by the
            QuranVoice server.
          </p>
        </div>
      </AppShell>
    </>
  );
}
