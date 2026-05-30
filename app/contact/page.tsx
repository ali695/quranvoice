import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the QuranVoice team.',
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Contact us"
        description="Questions, feedback, or content reports — write to us here."
      />
      <AppShell>
        <div className="mx-auto max-w-xl">
          <Card variant="elevated" className="p-6">
            <form className="flex flex-col gap-4" action="mailto:hello@quranvoice.app" method="post" encType="text/plain">
              <Input label="Name" name="name" placeholder="Your name" />
              <Input label="Email" type="email" name="email" placeholder="you@example.com" required />
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">Message</label>
                <textarea
                  name="message"
                  rows={6}
                  className="mt-1.5 w-full resize-none rounded-xl border border-ink-600/70 bg-ink-800/70 p-4 text-sm leading-relaxed text-cream-50 focus:border-gold-500/50 focus:outline-none"
                  placeholder="How can we help?"
                />
              </div>
              <Button type="submit">Send message</Button>
            </form>
            <p className="mt-4 text-[11px] text-cream-200/55">
              You can also email us at <span className="font-mono text-cream-100">hello@quranvoice.app</span>.
            </p>
          </Card>
        </div>
      </AppShell>
    </>
  );
}
