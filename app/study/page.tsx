import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Study Mode',
  description: 'Verified tafsir, translations, word-by-word, and context resources for the Quran.',
};

const STUDY_LINKS = [
  { href: '/translations', label: 'Translations', icon: 'globe', desc: 'Side-by-side translations across languages.' },
  { href: '/tafsir', label: 'Tafsir', icon: 'feather', desc: 'Tafsir from verified books, shown only when registered.' },
  { href: '/word-by-word', label: 'Word by Word', icon: 'sparkle', desc: 'Per-word meaning and grammar (when verified).' },
  { href: '/asbab-al-nuzul', label: 'Asbab al-Nuzul', icon: 'scroll', desc: 'Context of revelation, from verified sources.' },
  { href: '/shan-e-nuzul', label: 'Shan-e-Nuzul', icon: 'scroll', desc: 'Companion to Asbab — narrated context.' },
  { href: '/topics', label: 'Topics', icon: 'flag', desc: 'Ayahs grouped by theme.' },
] as const;

export default function StudyIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Study the Quran with depth and care"
        description="Pick a study path. Religious commentary is only shown from registered, verified sources."
      />
      <AppShell>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STUDY_LINKS.map((s) => (
            <Card key={s.href} as="li" variant="elevated">
              <Link href={s.href} className="flex h-full flex-col gap-3 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                  <Icon name={s.icon} size={18} />
                </span>
                <h3 className="font-display text-lg font-medium text-cream-50">{s.label}</h3>
                <p className="text-sm leading-relaxed text-cream-200/65">{s.desc}</p>
              </Link>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
