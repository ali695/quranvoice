import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Set a new password for your QuranVoice account.',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Choose a new password"
        description="Set a new password for your QuranVoice account."
      />
      <AppShell>
        <div className="mx-auto max-w-md">
          <Card variant="elevated" className="p-6">
            <ResetPasswordForm />
            <div className="mt-5 text-xs text-cream-200/65">
              <Link href="/auth/sign-in" className="hover:text-gold-300">
                Back to sign in
              </Link>
            </div>
          </Card>
        </div>
      </AppShell>
    </>
  );
}
