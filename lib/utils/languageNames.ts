/**
 * Friendly language display names for translation/tafsir ISO codes.
 *
 * Quran.Foundation exposes translations in ~90 languages — far more than the
 * app UI locales — so we resolve names dynamically with `Intl.DisplayNames`
 * (covers every ISO-639 code) and fall back to a small explicit map for the
 * codes the spec calls out, then to the uppercased code.
 *
 * Client-safe: no server imports.
 */

const FALLBACK: Record<string, string> = {
  en: 'English',
  ar: 'Arabic',
  ur: 'Urdu',
  hi: 'Hindi',
  bn: 'Bengali',
  id: 'Indonesian',
  tr: 'Turkish',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  ru: 'Russian',
  fa: 'Persian',
  ms: 'Malay',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  nl: 'Dutch',
  pt: 'Portuguese',
  sv: 'Swedish',
  ta: 'Tamil',
  th: 'Thai',
  sq: 'Albanian',
  az: 'Azerbaijani',
  bs: 'Bosnian',
  dv: 'Divehi',
  ha: 'Hausa',
  ku: 'Kurdish',
  ml: 'Malayalam',
  no: 'Norwegian',
  ps: 'Pashto',
  ro: 'Romanian',
  sd: 'Sindhi',
  so: 'Somali',
  sw: 'Swahili',
  tg: 'Tajik',
  tt: 'Tatar',
  ug: 'Uyghur',
  uz: 'Uzbek',
};

let displayNames: Intl.DisplayNames | null | undefined;

function getDisplayNames(): Intl.DisplayNames | null {
  if (displayNames !== undefined) return displayNames;
  try {
    displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
  } catch {
    displayNames = null;
  }
  return displayNames;
}

/** English display name for an ISO-639 language code (e.g. "ur" → "Urdu"). */
export function languageName(iso: string): string {
  const code = (iso || '').toLowerCase().trim();
  if (!code) return 'Unknown';
  const dn = getDisplayNames();
  const resolved = dn?.of(code);
  if (resolved && resolved.toLowerCase() !== code) return resolved;
  return FALLBACK[code] ?? code.toUpperCase();
}
