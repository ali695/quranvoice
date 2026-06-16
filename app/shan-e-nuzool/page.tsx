import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { getShanENuzoolStats } from '@/lib/services/shanENuzool.service';

export const metadata: Metadata = {
  title: 'Shan-e-Nuzool — Occasions of Revelation',
  description:
    'Shan-e-Nuzool explained: the Urdu and Persian name for the occasions of revelation. Reviewed, source-attributed entries appear here when registered.',
};

export const revalidate = 600;

export default async function ShanENuzoolIndex() {
  const stats = await getShanENuzoolStats();
  return (
    <>
      <PageHeader
        eyebrow="Quranic sciences"
        title="Shan-e-Nuzool"
        description="The occasion behind a verse — the circumstances in which it was revealed."
        actions={
          <Link
            href="/sources/shan-e-nuzool"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-600/70 bg-ink-800/40 px-3 py-2 text-xs text-cream-200/80 hover:border-gold-500/40"
          >
            <Icon name="scroll" size={13} />
            Source disclosure
          </Link>
        }
      />
      <AppShell>
        <Card variant="elevated" className="p-6">
          <h2 className="font-display text-lg font-medium text-cream-50">
            What Shan-e-Nuzool means
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-cream-200/75">
            <p>
              <span dir="rtl" lang="ur" className="quran-mushaf text-base text-cream-100">
                شانِ نزول
              </span>{' '}
              — <em>shān-e-nuzūl</em> — is the Urdu and Persian name for the occasion of revelation:
              the event, question, or situation in the life of the Prophet ﷺ and the early community
              that a particular verse was revealed about. It is the same Quranic science the Arabic
              tradition calls{' '}
              <Link href="/asbab-al-nuzul" className="text-gold-300 hover:underline">
                Asbab al-Nuzul
              </Link>
              .
            </p>
            <p>
              Understanding the occasion helps a reader grasp what a verse responded to and how its
              guidance applies. Because it carries that weight, QuranVoice treats it strictly: an
              entry is shown only when it comes from a registered, license-checked source and has
              passed review — never paraphrased, inferred, or generated.
            </p>
          </div>
        </Card>

        <Card variant="elevated" className="mt-6 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Reviewed entries" value={stats.approvedCount} />
            <Stat label="Pending review (admin)" value={stats.pendingCount} />
            <Stat label="Registered sources" value={stats.sources.length} />
          </div>
        </Card>

        {stats.approvedCount === 0 ? (
          <Card variant="elevated" className="mt-6 p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                <Icon name="book" size={18} />
              </span>
              <div>
                <h3 className="font-display text-base font-medium text-cream-50">
                  Reading entries inline
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cream-200/70">
                  When you open an ayah and tap <strong>Shan-e-Nuzool</strong>, any reviewed entry
                  for that verse opens in a drawer with its source and narration grade. As verified
                  entries are registered they will be listed here too — each with full attribution.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <p className="mt-6 text-sm text-cream-200/65">
            Open any ayah and tap <strong>Shan-e-Nuzool</strong> to see reviewed entries inline.
          </p>
        )}
      </AppShell>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
      <p className="text-xs uppercase tracking-wider text-cream-200/45">{label}</p>
      <p className="mt-1 font-display text-2xl text-cream-50">{value}</p>
    </div>
  );
}
