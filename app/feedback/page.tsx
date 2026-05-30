import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Share feedback about QuranVoice.',
};

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Feedback"
        description="Tell us what to improve."
      />
      <AppShell>
        <div className="mx-auto max-w-xl">
          <Card variant="elevated" className="p-6">
            <form className="flex flex-col gap-4" action="mailto:feedback@quranvoice.app" method="post" encType="text/plain">
              <Input label="Email (optional)" type="email" name="email" />
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">Feedback</label>
                <textarea
                  name="message"
                  rows={6}
                  required
                  className="mt-1.5 w-full resize-none rounded-xl border border-ink-600/70 bg-ink-800/70 p-4 text-sm leading-relaxed text-cream-50 focus:border-gold-500/50 focus:outline-none"
                  placeholder="What worked, what didn’t, what would help…"
                />
              </div>
              <Button type="submit">Send feedback</Button>
            </form>
          </Card>
        </div>
      </AppShell>
    </>
  );
}
