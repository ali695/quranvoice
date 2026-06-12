/**
 * Friendly OAuth callback status page.
 *
 * The /auth/callback route handler redirects here for non-session outcomes
 * (ready / pending / error) so the URL is always a real, indexed page and
 * never 404s — including when a reviewer visits the callback directly.
 *
 * Tokens are never shown here; they live only in HttpOnly cookies.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Authentication callback',
  description: 'QuranVoice OAuth callback endpoint.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CallbackStatusPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const state = (typeof params.state === 'string' ? params.state : 'ready') as
    | 'ready'
    | 'pending'
    | 'error';
  const message =
    typeof params.message === 'string'
      ? params.message
      : state === 'error'
        ? 'Authentication could not be completed.'
        : state === 'pending'
          ? 'The callback was received.'
          : 'This URL handles OAuth sign-in callbacks for QuranVoice. No action is required when visiting it directly.';

  const headline =
    state === 'ready'
      ? 'Authentication callback route is ready.'
      : state === 'pending'
        ? 'Callback received'
        : 'Sign-in could not be completed';

  const iconName = state === 'ready' ? 'check' : state === 'pending' ? 'sparkle' : 'close';
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
            Tokens issued during sign-in are never displayed on this page. They are stored in a
            secure HttpOnly cookie and used only by the QuranVoice server.
          </p>
        </div>
      </AppShell>
    </>
  );
}
