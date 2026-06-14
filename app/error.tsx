'use client';

import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

/**
 * Route-level error boundary — turns an unexpected client/render error into a
 * graceful, recoverable state instead of a blank "this page couldn't load".
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for debugging without leaking anything sensitive to the UI.
    console.error('Route error:', error);
  }, [error]);

  return (
    <AppShell>
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
          <Icon name="feather" size={26} />
        </span>
        <div>
          <h1 className="font-display text-2xl text-cream-50">Something didn’t load</h1>
          <p className="mt-2 text-sm leading-relaxed text-cream-200/70">
            This section ran into a problem. You can retry, or head back to the home page — your
            data and the rest of the app are unaffected.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button size="md" onClick={() => reset()}>
            <Icon name="arrow-right" size={14} />
            Try again
          </Button>
          <Button href="/" variant="secondary" size="md">
            Go home
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
