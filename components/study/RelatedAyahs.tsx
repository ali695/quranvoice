import { UnavailableState } from '@/components/ui/ErrorState';

interface RelatedAyahsProps {
  /** Same shape as a search result — but typed loosely so the component is reusable */
  related?: Array<{ verseKey: string; label: string }>;
}

export function RelatedAyahs({ related = [] }: RelatedAyahsProps) {
  if (related.length === 0) {
    return (
      <UnavailableState
        title="Related ayahs"
        badge="Awaiting verified index"
        description="Related ayah mapping will appear here after a verified topic index is connected. QuranVoice does not generate related-verse links automatically."
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
