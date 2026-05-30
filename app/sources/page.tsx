import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';
import { getResourcesSummary } from '@/lib/services/resource-registry.service';
import { getShanENuzoolStats } from '@/lib/services/shanENuzool.service';

export const metadata: Metadata = {
  title: 'Sources',
  description: 'How QuranVoice sources its Quran text, translations, tafsir, recitations, and Asbab al-Nuzul.',
};

export const revalidate = 600;

export default async function SourcesPage() {
  const [summary, shan] = await Promise.all([getResourcesSummary(), getShanENuzoolStats()]);

  return (
    <>
      <PageHeader
        eyebrow="Transparency"
        title="Sources & attribution"
        description="QuranVoice never invents religious content. Every block carries source attribution. Here is exactly where each kind of content comes from."
      />
      <AppShell>
        <Prose>
          <h2>Quran text</h2>
          <p>
            <strong>Provider:</strong> {summary.registry.quranTextSourceName}.{' '}
            {summary.health.foundationConfigured
              ? 'The Uthmani text and verse metadata are fetched from the Quran.Foundation Content API.'
              : 'Until Quran.Foundation credentials are configured, the open Tanzil text served by AlQuran Cloud is used as a fallback.'}
          </p>

          <h2>Translations ({summary.counts.translations || '—'})</h2>
          <p>
            Each translation is the copyright of its original translator/publisher. QuranVoice
            acts as a reader interface — attribution appears underneath every translated ayah.{' '}
            <Link href="/translations">Browse the translations catalog →</Link>
          </p>

          <h2>Tafsir ({summary.counts.tafsirs || '—'})</h2>
          <p>
            Tafsir is shown only from registered, verified sources. QuranVoice does not generate
            or synthesize tafsir content under any circumstance. When no tafsir source is
            registered for an ayah, the UI shows an explicit unavailable state.{' '}
            <Link href="/tafsir">Browse tafsir resources →</Link>
          </p>

          <h2>Audio recitations ({summary.counts.recitations || '—'})</h2>
          <p>
            Audio is streamed from third-party CDNs (Quran.Foundation when available, otherwise
            Islamic.Network / AlQuran Cloud). Reciter cards list the source. We do not host the
            audio ourselves.{' '}
            <Link href="/reciters">Browse reciters →</Link>
          </p>

          <h2>Tajweed</h2>
          <p>
            Tajweed mode is disabled until a verified Tajweed text or font dataset is registered.
            QuranVoice does not color Quran letters using rules we infer ourselves.
          </p>

          <h2>Word by word</h2>
          <p>
            Word-by-word analysis is shown only when a verified dataset is registered. Until
            then, the reader hides the word-by-word panel and the dedicated page shows the
            unavailable state.
          </p>

          <h2>Asbab al-Nuzul</h2>
          <p>
            We display Asbab al-Nuzul entries only from registered, license-checked sources.
            QuranVoice never generates context-of-revelation content.
          </p>

          <h2>Shan-e-Nuzool</h2>
          <p>
            We use a review workflow rather than auto-importing OCR text from public scans.{' '}
            <Link href="/sources/shan-e-nuzool">Read the Shan-e-Nuzool source disclosure →</Link>
          </p>
          <ul>
            <li>
              Approved entries: <strong>{shan.approvedCount}</strong>
            </li>
            <li>
              Pending review: <strong>{shan.pendingCount}</strong>
            </li>
            <li>
              Registered sources: <strong>{shan.sources.length}</strong>
            </li>
          </ul>

          <h2>What we never do</h2>
          <ul>
            <li>No fake Quran text or fake reciters.</li>
            <li>No AI-generated tafsir, Asbab, or Shan-e-Nuzool.</li>
            <li>No fabricated Tajweed coloring.</li>
            <li>No invented 8-line / 12-line / 16-line page breaks.</li>
            <li>No unsourced religious explanations rendered as scholarship.</li>
          </ul>
        </Prose>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card variant="elevated" className="p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
              <Icon name="check" size={13} />
              API health
            </div>
            <p className="mt-2 font-display text-base text-cream-50">
              {summary.health.foundationOk ? 'Quran.Foundation OK' : summary.health.foundationConfigured ? 'Foundation configured (verify connection)' : 'AlQuran Cloud fallback'}
            </p>
            <p className="mt-1 text-xs text-cream-200/55">
              {summary.health.searchScopeEnabled ? 'Search scope: enabled' : 'Search scope: not granted'}
            </p>
          </Card>
          <Card variant="elevated" className="p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
              <Icon name="globe" size={13} />
              Languages
            </div>
            <p className="mt-2 font-display text-base text-cream-50">{summary.counts.languages || '—'} listed</p>
          </Card>
          <Card variant="elevated" className="p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
              <Icon name="feather" size={13} />
              Defaults
            </div>
            <p className="mt-2 text-sm text-cream-100">
              Translation: {summary.defaults.translation ?? '—'}
              <br />
              Tafsir: {summary.defaults.tafsir ?? '—'}
            </p>
          </Card>
        </div>
      </AppShell>
    </>
  );
}
