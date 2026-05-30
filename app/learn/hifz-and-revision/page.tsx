import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/hifz-and-revision',
    title: 'Hifz & Revision — QuranVoice',
    description:
      'Practical workflow guidance for memorizing the Quran — review queues, weak verses, audio loops, hidden-translation review.',
  });
}

const FLOWS = [
  { icon: 'brain' as const, title: 'Build a daily review queue', body: 'Every verse you add to Hifz lands in a spaced-repetition queue. Each review session walks you through the verses that are due today.' },
  { icon: 'sparkle' as const, title: 'Mark weak verses', body: 'Rate each review (Solid / Okay / Needs work). Verses you struggle with come back sooner; verses you nail get spaced out.' },
  { icon: 'volume' as const, title: 'Audio loop for memorization', body: 'In the reader, set repeat to "Ayah" and let your chosen reciter loop the verse while you echo it back.' },
  { icon: 'globe' as const, title: 'Hide-translation review', body: 'A hidden-translation mode in /memorization/review forces recall from the Arabic alone.' },
  { icon: 'check' as const, title: 'Track mistakes — privately', body: 'Notes attached to memorization items live in your personal store; nothing is shared automatically.' },
  { icon: 'target' as const, title: 'Friday Al-Kahf reminder (coming soon)', body: 'A gentle reminder to read Surah Al-Kahf on Friday — opt-in only.' },
];

export default function HifzPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Library"
        title="Build a sustainable Hifz habit"
        description="QuranVoice does not issue religious rulings on Hifz. What we offer is a practical workflow: tracked memorization, spaced review, audio loops, and a hidden-translation review mode."
        actions={
          <>
            <Button href="/memorization" size="md">
              <Icon name="brain" size={14} />
              Open my Hifz queue
            </Button>
            <Button href="/memorization/review" size="md" variant="outline">
              Start a review session
              <Icon name="arrow-right" size={14} />
            </Button>
          </>
        }
      />
      <AppShell>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FLOWS.map((f) => (
            <Card key={f.title} as="li" variant="elevated" className="p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                <Icon name={f.icon} size={18} />
              </span>
              <h3 className="mt-3 font-display text-base text-cream-50">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-200/65">{f.body}</p>
            </Card>
          ))}
        </ul>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Card variant="feature" className="p-6">
            <div className="text-xs uppercase tracking-wider text-gold-400/80">Reader integration</div>
            <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
              The reader's per-ayah <em>Memorize</em> action adds a verse to your queue. Repeat
              mode in the audio player loops the verse for as many reps as you like.
            </p>
            <Link
              href="/quran"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 hover:text-gold-200"
            >
              Open the reader
              <Icon name="arrow-right" size={13} />
            </Link>
          </Card>
          <Card variant="feature" className="p-6">
            <div className="text-xs uppercase tracking-wider text-gold-400/80">Source policy</div>
            <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
              This page is editorial app guidance — it is not a fatwa. For the religious rulings
              around Hifz, please consult a qualified teacher in your tradition.
            </p>
          </Card>
        </div>
      </AppShell>
    </>
  );
}
