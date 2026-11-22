import type { SurahIntro as SurahIntroData } from '@/lib/services/surahInfoService';

interface SurahIntroProps {
  intro: SurahIntroData;
  surahName: string;
  /** Arabic-script surah name, used for the Urdu heading. */
  surahNameArabic: string;
}

/**
 * Server-rendered surah introduction. The full text is in the HTML (so it is
 * readable without JavaScript and by search engines) inside a collapsed
 * <details>, with the provider's attribution always visible.
 */
export function SurahIntro({ intro, surahName, surahNameArabic }: SurahIntroProps) {
  const heading = intro.lang === 'ur' ? `سورۃ ${surahNameArabic} کا تعارف` : `About Surah ${surahName}`;
  const more = intro.lang === 'ur' ? 'مکمل تعارف پڑھیں' : 'Read the full introduction';
  return (
    <section
      aria-labelledby="surah-intro-heading"
      lang={intro.lang}
      dir={intro.dir}
      className="rounded-2xl border border-ink-600/50 bg-ink-850/40 p-5 md:p-6"
    >
      <h2 id="surah-intro-heading" className="font-display text-lg text-cream-50">
        {heading}
      </h2>
      <details className="group mt-2">
        <summary className="cursor-pointer list-none text-sm leading-relaxed text-cream-200/80 [&::-webkit-details-marker]:hidden">
          <span>{intro.excerpt}</span>{' '}
          <span className="whitespace-nowrap text-gold-300 group-open:hidden">{more} ↓</span>
        </summary>
        <div
          className="mt-4 space-y-3 text-sm leading-relaxed text-cream-200/85 [&_h2]:mt-5 [&_h2]:font-display [&_h2]:text-base [&_h2]:text-cream-50 [&_h3]:mt-4 [&_h3]:font-display [&_h3]:text-cream-50 [&_li]:ms-5 [&_li]:list-disc"
          // Sanitized server-side by sanitizeHtml(): allowlisted tags only, no attributes.
          dangerouslySetInnerHTML={{ __html: intro.html }}
        />
      </details>
      <p className="mt-4 text-xs text-cream-200/45" dir="ltr" lang="en">
        Source: {intro.source}
      </p>
    </section>
  );
}
