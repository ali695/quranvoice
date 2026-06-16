import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { StudyJump } from '@/components/study/StudyJump';

export const metadata: Metadata = {
  title: 'Study Mode',
  description:
    'Study any ayah in depth — tafsir, word-by-word, occasions of revelation, related ayahs, memorization, and reflection. Religious commentary only from verified sources.',
};

const STUDY_LINKS: Array<{ href: string; label: string; icon: IconName; desc: string }> = [
  { href: '/translations', label: 'Translations', icon: 'globe', desc: 'Compare translations side by side across many languages and scholars.' },
  { href: '/tafsir', label: 'Tafsir', icon: 'feather', desc: 'Classical and modern commentary, shown only from registered, verified books.' },
  { href: '/word-by-word', label: 'Word by Word', icon: 'sparkle', desc: 'Per-word Arabic, transliteration, and meaning to build your own understanding.' },
  { href: '/asbab-al-nuzul', label: 'Asbab al-Nuzul', icon: 'scroll', desc: 'The reported occasions of revelation — why and when an ayah came down.' },
  { href: '/shan-e-nuzool', label: 'Shan-e-Nuzool', icon: 'scroll', desc: 'The same science in the Urdu/Persian tradition, with full attribution.' },
  { href: '/topics', label: 'Topics', icon: 'flag', desc: 'Follow a subject across the whole Quran through linked ayahs.' },
];

// Widely known ayahs that reward close study. Labels are descriptive
// references — the verified Arabic, translation, and tafsir load in the
// study view from the active source.
const FEATURED: Array<{ vk: string; title: string; note: string }> = [
  { vk: '2:255', title: 'Āyat al-Kursī', note: 'The Throne Verse — the greatest ayah of the Quran.' },
  { vk: '1:1', title: 'Al-Fātiḥah', note: 'The opening — recited in every unit of prayer.' },
  { vk: '112:1', title: 'Al-Ikhlāṣ', note: 'Pure monotheism in four concise ayahs.' },
  { vk: '24:35', title: 'Āyat an-Nūr', note: 'The Verse of Light — a profound parable.' },
  { vk: '2:286', title: 'End of Al-Baqarah', note: 'A comprehensive supplication and mercy.' },
  { vk: '59:22', title: 'Names of Allah', note: 'He is Allah — a cluster of His beautiful names.' },
  { vk: '36:1', title: 'Yā-Sīn', note: 'Often called the heart of the Quran.' },
  { vk: '18:10', title: 'Al-Kahf', note: 'The People of the Cave — a Friday tradition.' },
];

export default function StudyIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Study the Quran with depth and care"
        description="Open any ayah for tafsir, word-by-word, occasions of revelation, related ayahs, memorization, and private reflection — all in one place."
      />
      <AppShell>
        {/* Jump straight into the in-depth study view */}
        <Card variant="feature" className="relative overflow-hidden p-6 md:p-7">
          <div className="absolute inset-0 pattern-ornament opacity-20" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-display text-lg font-medium text-cream-50">Study any ayah</h2>
            <p className="mt-1 mb-4 text-sm text-cream-200/65">
              Type a reference like <span className="font-mono text-gold-300/90">2:255</span> or{' '}
              <span className="font-mono text-gold-300/90">36:9</span> to open the full study view.
            </p>
            <div className="max-w-xl">
              <StudyJump />
            </div>
          </div>
        </Card>

        {/* Featured ayahs to study */}
        <section className="mt-10">
          <h2 className="font-display text-xl text-cream-50">Start with a landmark ayah</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((f) => (
              <Card key={f.vk} as="li" variant="elevated">
                <Link href={`/study/${f.vk.replace(':', '/')}`} className="flex h-full flex-col gap-2 p-5">
                  <span className="font-mono text-xs text-gold-300/80">{f.vk}</span>
                  <h3 className="font-display text-base font-medium text-cream-50">{f.title}</h3>
                  <p className="text-xs leading-relaxed text-cream-200/65">{f.note}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-xs font-medium text-gold-300">
                    Study this ayah
                    <Icon name="arrow-right" size={12} />
                  </span>
                </Link>
              </Card>
            ))}
          </ul>
        </section>

        {/* Study tools / paths */}
        <section className="mt-12">
          <h2 className="font-display text-xl text-cream-50">Study tools</h2>
          <p className="mt-1 text-sm text-cream-200/65">
            Each tool draws on verified sources — religious commentary is never auto-generated.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>
      </AppShell>
    </>
  );
}
