import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { QuranOAuthTest } from '@/components/developers/QuranOAuthTest';

export const metadata: Metadata = {
  title: 'Quran.Foundation OAuth test',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

/**
 * Development-only OAuth + user-API tester. 404s in production so it never
 * ships to end users. Never displays secrets or tokens.
 */
export default function QuranOAuthTestPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return (
    <>
      <PageHeader
        eyebrow="Developers · Dev only"
        title="Quran.Foundation OAuth test"
        description="Exercise the Sign-in-with-Quran.Foundation flow and the /api/quran-user proxy endpoints. Tokens are stored in HttpOnly cookies and are never shown here."
      />
      <AppShell>
        <QuranOAuthTest />
      </AppShell>
    </>
  );
}
