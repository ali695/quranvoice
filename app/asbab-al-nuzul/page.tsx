import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { listAsbabEntries } from '@/lib/services/asbabService';

export const metadata: Metadata = {
  title: 'Asbab al-Nuzul — Occasions of Revelation',
  description:
    'What Asbab al-Nuzul means, why it matters for understanding the Quran, and the classical works that record it. Verified, source-attributed entries appear here when registered.',
};

const SOURCES = [
  {
    name: 'Asbāb al-Nuzūl',
    author: 'Abū al-Ḥasan al-Wāḥidī (d. 468 AH / 1075 CE)',
    note: 'The earliest dedicated book on the subject and the principal reference cited by later scholars.',
  },
  {
    name: 'Lubāb al-Nuqūl fī Asbāb al-Nuzūl',
    author: 'Jalāl al-Dīn al-Suyūṭī (d. 911 AH / 1505 CE)',
    note: 'A refined, isnad-conscious compilation that became a standard companion to tafsir.',
  },
];

export default async function AsbabPage() {
  const entries = await listAsbabEntries();
  return (
    <>
      <PageHeader
        eyebrow="Quranic sciences"
        title="Asbab al-Nuzul"
        description="The reported occasions of revelation — the events and questions that prompted specific verses."
      />
      <AppShell>
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card variant="elevated" className="p-6">
            <h2 className="font-display text-lg font-medium text-cream-50">
              What “Asbab al-Nuzul” means
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-cream-200/75">
              <p>
                <span dir="rtl" lang="ar" className="quran-mushaf text-base text-cream-100">
                  أسباب النزول
                </span>{' '}
                — <em>asbāb al-nuzūl</em>, “the occasions of revelation” — is the branch of Quranic
                study concerned with the circumstances under which particular verses were revealed:
                an event in the community, a question put to the Prophet ﷺ, or a situation that a
                verse addressed.
              </p>
              <p>
                Knowing a verse’s occasion can clarify its meaning, its scope, and the wisdom behind
                its ruling. Classical scholars treated it as a serious discipline of{' '}
                <em>ʿulūm al-Qur’ān</em>: a report is only accepted with a sound chain of
                transmission, not every verse has a recorded occasion, and a single verse may have
                more than one narrated cause.
              </p>
              <p className="text-cream-200/60">
                In Urdu and Persian this science is known as{' '}
                <Link href="/shan-e-nuzool" className="text-gold-300 hover:underline">
                  Shan-e-Nuzool
                </Link>
                .
              </p>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <h2 className="font-display text-lg font-medium text-cream-50">Classical sources</h2>
            <ul className="mt-3 flex flex-col gap-4">
              {SOURCES.map((s) => (
                <li key={s.name} className="border-l-2 border-gold-500/30 pl-3">
                  <p className="font-display text-sm text-cream-50">{s.name}</p>
                  <p className="text-xs text-gold-300/90">{s.author}</p>
                  <p className="mt-1 text-xs leading-relaxed text-cream-200/65">{s.note}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card variant="elevated" className="mt-6 p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
              <Icon name="scroll" size={18} />
            </span>
            <div>
              <h2 className="font-display text-base font-medium text-cream-50">
                Per-ayah entries
              </h2>
              {entries.length === 0 ? (
                <p className="mt-1.5 text-sm leading-relaxed text-cream-200/70">
                  QuranVoice displays the occasion of revelation for a specific ayah only when it is
                  sourced from a registered, license-checked book and reviewed — we never infer or
                  generate context of revelation. When a verified Asbab source is connected, each
                  ayah’s reported occasion appears inline in the reader and is listed here with full
                  attribution.
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-4">
                  {entries.map((e) => (
                    <li
                      key={e.id}
                      className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-4 text-sm text-cream-100/90"
                    >
                      <p className="text-xs uppercase tracking-wider text-gold-300/80">
                        {e.ayahRangeLabel}
                      </p>
                      {e.title && <p className="mt-1 font-medium text-cream-50">{e.title}</p>}
                      <p className="mt-1 leading-relaxed">{e.text}</p>
                      <p className="mt-2 text-xs text-cream-200/55">
                        Source: {e.sourceBook} — {e.author}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      </AppShell>
    </>
  );
}
