import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';
import {
  fetchArchiveMetadataForShanENuzool,
  getShanENuzoolStats,
} from '@/lib/services/shanENuzool.service';

export const metadata: Metadata = {
  title: 'Shan-e-Nuzool source disclosure',
  description: 'How QuranVoice handles Shan-e-Nuzool content: review-only workflow, source attribution, no auto-import.',
};

export const revalidate = 600;

export default async function ShanENuzoolSourcePage() {
  const [stats, archive] = await Promise.all([
    getShanENuzoolStats(),
    fetchArchiveMetadataForShanENuzool(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Source disclosure"
        title="Shan-e-Nuzool — how it works"
        description="QuranVoice only displays Shan-e-Nuzool entries after a human reviewer approves them. No OCR text is shown to readers without review."
      />
      <AppShell>
        <Card variant="feature" className="p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
            <Icon name="scroll" size={13} />
            Reference source
          </div>
          <h2 className="mt-2 font-display text-2xl text-cream-50">
            {archive?.title ?? 'Ayaat Qurani Kay Shan E Nuzool'}
          </h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-cream-200/45">Listed author</dt>
              <dd className="mt-0.5 text-cream-100">{archive?.creator ?? 'Allama Abul Hasan Ali Al Nishapuri'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-cream-200/45">Language</dt>
              <dd className="mt-0.5 text-cream-100">{archive?.language ?? 'Urdu'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-cream-200/45">Archive identifier</dt>
              <dd className="mt-0.5 font-mono text-cream-100">AyaatQuraniKayShanENuzool</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-cream-200/45">Archive URL</dt>
              <dd className="mt-0.5">
                <a
                  href="https://archive.org/details/AyaatQuraniKayShanENuzool"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="break-all text-gold-300 hover:text-gold-200"
                >
                  archive.org/details/AyaatQuraniKayShanENuzool
                </a>
              </dd>
            </div>
          </dl>
        </Card>

        <div className="mt-8">
          <Prose>
            <h2>How QuranVoice uses this source</h2>
            <p>
              QuranVoice only shows Shan-e-Nuzool after source review. We do not auto-generate
              Shan-e-Nuzool, and we do not attach unreviewed OCR text to ayahs.
            </p>
            <p>
              When you open an ayah, the Shan-e-Nuzool drawer reads from our Supabase database.
              Only entries with <code>status = &apos;approved&apos;</code> are visible to
              readers. Pending and rejected entries are private to administrators.
            </p>

            <h2>The review workflow</h2>
            <ol>
              <li>An entry is extracted from a registered source (e.g. the Archive.org item above).</li>
              <li>A reviewer attaches it to specific ayah(s) and writes the page reference.</li>
              <li>
                The reviewer marks the authenticity status (<code>sahih</code>, <code>hasan</code>,
                <code>weak</code>, <code>unknown</code>, or <code>multiple_reports</code>).
              </li>
              <li>Only then is it approved and shown publicly with full source attribution.</li>
            </ol>

            <h2>Current status</h2>
            <ul>
              <li>
                Approved entries visible to readers: <strong>{stats.approvedCount}</strong>
              </li>
              <li>
                Pending entries (admin-only): <strong>{stats.pendingCount}</strong>
              </li>
              <li>
                Registered sources: <strong>{stats.sources.length}</strong>
              </li>
            </ul>
            {stats.approvedCount === 0 && (
              <p>
                There are currently no reviewed Shan-e-Nuzool entries available for readers.
                When you open an ayah’s Shan-e-Nuzool panel, QuranVoice will show:
                <em> &ldquo;No reviewed Shan-e-Nuzool entry is available for this Ayah yet.&rdquo;</em>
              </p>
            )}
          </Prose>
        </div>
      </AppShell>
    </>
  );
}
