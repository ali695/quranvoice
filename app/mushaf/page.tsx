import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/mushaf',
    titleKey: 'meta.mushaf.title',
    descriptionKey: 'meta.mushaf.description',
  });
}

const STYLES = [
  {
    href: '/uthmani-quran',
    icon: 'book' as const,
    title: 'Uthmani Quran',
    body: 'Verified Uthmani script from the Quran.Foundation Content API.',
    status: 'Available',
  },
  {
    href: '/tajweed-quran',
    icon: 'sparkle' as const,
    title: 'Tajweed Quran',
    body: 'Color-coded Tajweed rules — activates only with verified data.',
    status: 'Locked',
  },
  {
    href: '/8-line-quran',
    icon: 'feather' as const,
    title: '8-line Mushaf',
    body: 'Classical 8-line per-page mushaf layout. Needs verified line-break data.',
    status: 'Locked',
  },
  {
    href: '/12-line-quran',
    icon: 'feather' as const,
    title: '12-line Mushaf',
    body: 'Classical 12-line per-page mushaf layout. Needs verified line-break data.',
    status: 'Locked',
  },
  {
    href: '/16-line-quran',
    icon: 'feather' as const,
    title: '16-line Mushaf',
    body: 'Indo-Pak 16-line per-page mushaf layout. Needs verified line-break data.',
    status: 'Locked',
  },
  {
    href: '/quran',
    icon: 'book' as const,
    title: 'QuranVoice Reader',
    body: 'Premium card reader — translation, tafsir, and audio per ayah.',
    status: 'Available',
  },
];

export default function MushafIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Mushaf"
        title="Choose how you read the Mushaf"
        description="QuranVoice supports the standard reader plus classical mushaf layouts. Layout-specific styles activate once verified line-break data is connected — we never fake page breaks."
      />
      <AppShell>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STYLES.map((s) => (
            <Card key={s.href} as="li" variant="elevated">
              <Link href={s.href} className="flex h-full flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                    <Icon name={s.icon} size={18} />
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      s.status === 'Available'
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                        : 'border-cream-200/20 bg-ink-700/40 text-cream-200/70'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <h3 className="font-display text-lg font-medium text-cream-50">{s.title}</h3>
                <p className="text-sm leading-relaxed text-cream-200/65">{s.body}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold-300">
                  Open
                  <Icon name="arrow-right" size={14} />
                </span>
              </Link>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
