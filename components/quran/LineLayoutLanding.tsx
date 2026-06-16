import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { MushafReader } from '@/components/quran/MushafReader';

interface Fact {
  icon: IconName;
  title: string;
  body: string;
}

/**
 * Landing for printed Mushaf line-layouts that the active source does not
 * provide verified line-break data for (e.g. 8-line, 12-line). Rather than a
 * dead "locked" page, it gives genuinely useful, factual context about the
 * layout and embeds the verified page-by-page reader (15-line Madani /
 * 16-line Indo-Pak) so visitors can read a real printed-page Mushaf now. We
 * never synthesize line breaks we can't verify.
 */
export function LineLayoutLanding({
  lines,
  title,
  intro,
  facts,
}: {
  lines: number;
  title: string;
  intro: string;
  facts: Fact[];
}) {
  return (
    <>
      <PageHeader eyebrow="Mushaf · Page by page" title={title} description={intro} />
      <AppShell>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <Card key={f.title} as="li" variant="elevated" className="p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                <Icon name={f.icon} size={18} />
              </span>
              <h3 className="mt-3 font-display text-base font-medium text-cream-50">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-200/65">{f.body}</p>
            </Card>
          ))}
        </ul>

        <div className="mt-8 flex items-start gap-2 rounded-xl border border-gold-500/20 bg-gold-500/5 p-4 text-sm text-gold-100/85">
          <Icon name="feather" size={15} className="mt-0.5 shrink-0 text-gold-300" />
          <p>
            A verified {lines}-line line-break dataset isn’t published by our source, so QuranVoice
            doesn’t approximate those page breaks. Read a verified page-accurate Mushaf below — the
            15-line Madani (KFGQPC) and 16-line Indo-Pak layouts, with real printed line data.
          </p>
        </div>

        <div className="mt-6">
          <h2 className="mb-4 font-display text-lg font-medium text-cream-50">
            Read a verified printed-page Mushaf
          </h2>
          <MushafReader initialPage={1} defaultLayout="15-line" />
        </div>
      </AppShell>
    </>
  );
}
