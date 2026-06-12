import { UnavailableState } from '@/components/ui/ErrorState';
import type { AsbabEntry } from '@/lib/types/asbab';

interface AsbabBlockProps {
  entries: AsbabEntry[];
}

export function AsbabBlock({ entries }: AsbabBlockProps) {
  if (!entries || entries.length === 0) {
    return (
      <UnavailableState
        title="No reviewed Asbab al-Nuzul entry for this ayah yet"
        badge="Awaiting reviewed source"
        description="QuranVoice only displays Asbab / Shan-e-Nuzool after source review. A reviewed entry for this ayah has not been published yet — this is not an error, and nothing unverified is ever shown."
      />
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {entries.map((e) => (
        <article key={e.id} className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gold-400/80">
            <span>{e.sourceBook}</span>
            <span className="text-cream-200/45">· {e.author}</span>
            {e.authenticityStatus && e.authenticityStatus !== 'unknown' && (
              <span className="ml-auto rounded-full border border-gold-500/30 px-2 py-0.5 text-[10px] text-gold-300">
                {e.authenticityStatus}
              </span>
            )}
          </div>
          {e.title && (
            <h4 className="mt-2 font-display text-base font-medium text-cream-50">{e.title}</h4>
          )}
          <p className="mt-2 text-sm leading-relaxed text-cream-100/85">{e.text}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-cream-200/55">
            <span>{e.ayahRangeLabel}</span>
            <span>· {e.language.toUpperCase()}</span>
            {e.editorOrVerifier && <span>· verified by {e.editorOrVerifier}</span>}
          </div>
        </article>
      ))}
    </div>
  );
}
