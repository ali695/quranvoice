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

const NAME_TO_ISO: Record<string, string> = Object.fromEntries(
  Object.entries(FALLBACK).map(([iso, name]) => [name.toLowerCase(), iso]),
);

/** Reverse lookup: a language name (e.g. "urdu") → ISO code ("ur"), else ''. */
export function isoFromLanguageName(name: string | undefined): string {
  const n = (name || '').toLowerCase().trim();
  if (!n) return '';
  if (NAME_TO_ISO[n]) return NAME_TO_ISO[n];
  // Already an ISO code?
  if (/^[a-z]{2,3}$/.test(n) && FALLBACK[n]) return n;
  return '';
}

function titleCase(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/**
 * English display name for a language code/name. Robust: accepts ISO codes
 * ("ur") AND full names ("urdu"), and NEVER throws — `Intl.DisplayNames.of()`
 * raises a RangeError on invalid subtags (e.g. "english"), so we only call it
 * for plausibly-valid codes and guard it with try/catch.
 */
export function languageName(input: string): string {
  const raw = (input || '').toLowerCase().trim();
  if (!raw) return 'Unknown';
  // Full name like "english" / "arabic" → ISO, else keep as-is.
  const code = NAME_TO_ISO[raw] || raw;
  if (FALLBACK[code]) return FALLBACK[code];
  // Only ask Intl for a structurally-valid language subtag.
  if (/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/.test(code)) {
    try {
      const resolved = getDisplayNames()?.of(code);
      if (resolved && resolved.toLowerCase() !== code) return resolved;
    } catch {
      /* invalid subtag — fall through */
    }
  }
  return titleCase(raw);
}
