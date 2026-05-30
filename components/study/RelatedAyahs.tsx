import { UnavailableState } from '@/components/ui/ErrorState';

interface RelatedAyahsProps {
  /** Same shape as a search result — but typed loosely so the component is reusable */
  related?: Array<{ verseKey: string; label: string }>;
}

export function RelatedAyahs({ related = [] }: RelatedAyahsProps) {
  if (related.length === 0) {
    return (
      <UnavailableState
        title="Related ayahs not connected"
        description="When a verified concept/topic index is connected, related verses will appear here."
      />
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {related.map((r) => (
        <li key={r.verseKey}>
          <a
            href={`/quran/${r.verseKey.replace(':', '/')}`}
            className="block rounded-xl border border-ink-700/60 bg-ink-850/60 px-4 py-3 text-sm text-cream-100 hover:border-gold-500/40 hover:text-gold-200"
          >
            {r.label}
            <span className="ml-2 text-xs text-cream-200/55">{r.verseKey}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
