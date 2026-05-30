import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create a QuranVoice account to sync your study across devices.',
};

export default function SignUpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Create your account"
        description="Free, no ads. We only collect what we need to sync your bookmarks, notes, and progress."
      />
      <AppShell>
        <div className="mx-auto max-w-md">
          <Card variant="elevated" className="p-6">
            <SignUpForm />
            <p className="mt-5 text-xs text-cream-200/65">
              Already have an account?{' '}
              <Link href="/auth/sign-in" className="text-gold-300 hover:text-gold-200">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </AppShell>
    </>
  );
}
