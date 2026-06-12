import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { SignInForm } from '@/components/auth/SignInForm';
import { FoundationConnect } from '@/components/auth/FoundationConnect';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to sync your bookmarks, notes, and progress across devices.',
};

export default function SignInPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Sign in to QuranVoice"
        description="Sync bookmarks, notes, reading goals, and memorization across your devices."
      />
      <AppShell>
        <div className="mx-auto max-w-md">
          <Card variant="elevated" className="p-6">
            <SignInForm />
            <div className="mt-5 flex items-center justify-between text-xs text-cream-200/65">
              <Link href="/auth/sign-up" className="hover:text-gold-300">
                Create account
              </Link>
              <Link href="/help" className="hover:text-gold-300">
                Need help?
              </Link>
            </div>
          </Card>

          <div className="mt-4">
            <FoundationConnect next="/profile" />
          </div>
        </div>
      </AppShell>
    </>
  );
}
