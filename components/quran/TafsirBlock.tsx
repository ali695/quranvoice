import { UnavailableState } from '@/components/ui/ErrorState';
import type { TafsirEntry } from '@/lib/types/tafsir';

interface TafsirBlockProps {
  entries?: TafsirEntry[] | null;
}

export function TafsirBlock({ entries }: TafsirBlockProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="mt-5">
        <UnavailableState
          title="Tafsir not available"
          description="Tafsir will appear here when a verified source is connected for this verse."
        />
      </div>
    );
  }
  return (
    <div className="mt-5 flex flex-col gap-4">
      {entries.map((t, i) => (
        <article
          key={`${t.resourceId}-${i}`}
          className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-4"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gold-400/80">
            <span>{t.book}</span>
            {t.author && <span className="text-cream-200/45">· {t.author}</span>}
          </div>
          {t.text ? (
            <p className="mt-2 text-sm leading-relaxed text-cream-100/85">{t.text}</p>
          ) : t.textHtml ? (
            <div
              className="mt-2 text-sm leading-relaxed text-cream-100/85"
              // Source has been verified through the registry before reaching this branch.
              dangerouslySetInnerHTML={{ __html: t.textHtml }}
            />
          ) : null}
          <p className="mt-3 text-[10px] uppercase tracking-wider text-cream-200/45">
            Source: {t.source.name}
          </p>
        </article>
      ))}
    </div>
  );
}
