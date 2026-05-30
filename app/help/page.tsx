import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Help Center',
  description: 'Help and FAQs for using QuranVoice.',
};

const QUESTIONS = [
  {
    q: 'How do I jump to a specific ayah?',
    a: 'You can type a reference like 2:255 into the search bar, or use the “Jump to ayah” control inside any surah page. Direct links such as /quran/2/255 also work.',
  },
  {
    q: 'Why is tafsir not showing up?',
    a: 'QuranVoice only displays tafsir from registered, verified sources. When such a source is connected through the Resource Registry, tafsir will appear inside the study panel and (optionally) under each ayah.',
  },
  {
    q: 'Where are my bookmarks stored?',
    a: 'Bookmarks and notes are stored on this device (in your browser). Account sync is in preview. You can export bookmarks and notes from the Settings page at any time.',
  },
  {
    q: 'Can I play audio from a specific ayah?',
    a: 'You can play the surah from the beginning today. Per-ayah audio jumping requires verified timestamp data — when a dataset is connected, the player will jump precisely to the selected ayah.',
  },
];

export default function HelpCenter() {
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Help Center"
        description="Common questions about QuranVoice."
      />
      <AppShell>
        <ul className="flex flex-col gap-3">
          {QUESTIONS.map((q) => (
            <Card key={q.q} as="li" variant="elevated" className="p-5">
              <details>
                <summary className="cursor-pointer text-sm font-medium text-cream-50">
                  {q.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-cream-200/80">{q.a}</p>
              </details>
            </Card>
          ))}
        </ul>
        <p className="mt-6 text-xs text-cream-200/65">
          Still stuck? <Link href="/contact" className="text-gold-300 hover:text-gold-200">Contact us</Link> or visit{' '}
          <Link href="/feedback" className="text-gold-300 hover:text-gold-200">Feedback</Link>.
        </p>
      </AppShell>
    </>
  );
}
