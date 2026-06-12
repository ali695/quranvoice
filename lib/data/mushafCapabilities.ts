/**
 * Mushaf and Tajweed capability flags.
 *
 * These flags gate the UI selectors. They are intentionally conservative:
 * a style is `enabled: true` only when QuranVoice has verified data for it.
 *
 * 8-line / 12-line / 16-line Mushaf modes require verified line-break
 * datasets per page; Tajweed mode requires a verified Tajweed text or
 * font resource. None of these are auto-generated.
 */

import type { MushafStyle, QuranScript, MushafLineStyle } from '@/lib/types/settings';
import type { Capabilities } from '@/lib/types/capability';
import { flagHelp } from '@/lib/utils/capabilityCopy';

export interface MushafStyleCapability {
  value: MushafStyle;
  label: string;
  description: string;
  enabled: boolean;
  /** Why it's disabled, if applicable. */
  reason?: string;
}

export interface QuranScriptCapability {
  value: QuranScript;
  label: string;
  description: string;
  enabled: boolean;
  reason?: string;
}

export interface LineStyleCapability {
  value: MushafLineStyle;
  label: string;
  enabled: boolean;
  reason?: string;
}

export const MUSHAF_STYLES: MushafStyleCapability[] = [
  {
    value: 'standard',
    label: 'QuranVoice Reader',
    description: 'Premium card layout with translation, tafsir, and audio per ayah.',
    enabled: true,
  },
  {
    value: 'ayah-by-ayah',
    label: 'Ayah-by-Ayah study',
    description: 'One ayah per card with study tools opened by default.',
    enabled: true,
  },
  {
    value: 'page',
    label: 'Mushaf Page',
    description: 'Page-by-page mushaf layout (flowing Uthmani).',
    enabled: true,
  },
  {
    value: 'eight-line',
    label: '8-line Mushaf',
    description: 'Classic 8-line per-page mushaf layout.',
    enabled: false,
    reason: 'This Mushaf line style needs verified line-break data before activation.',
  },
  {
    value: 'twelve-line',
    label: '12-line Mushaf',
    description: 'Classic 12-line per-page mushaf layout.',
    enabled: false,
    reason: 'This Mushaf line style needs verified line-break data before activation.',
  },
  {
    value: 'sixteen-line',
    label: '16-line Mushaf',
    description: 'Indo-Pak 16-line per-page mushaf layout.',
    enabled: false,
    reason: 'This Mushaf line style needs verified line-break data before activation.',
  },
];

export const QURAN_SCRIPTS: QuranScriptCapability[] = [
  {
    value: 'uthmani',
    label: 'Uthmani (recommended)',
    description: 'Verified Uthmani text from Quran.Foundation (or Tanzil fallback).',
    enabled: true,
  },
  {
    value: 'uthmani-simple',
    label: 'Uthmani — simplified',
    description: 'Same Uthmani text with simplified diacritics.',
    enabled: true,
  },
  {
    value: 'imlaei',
    label: 'Imlaei',
    description: 'Imlaei orthography (modern Arabic spelling).',
    enabled: true,
  },
  {
    value: 'tajweed',
    label: 'Tajweed',
    description: 'Color-coded Tajweed rules over the text.',
    enabled: false,
    reason: 'Requires verified Tajweed text or font data.',
  },
];

export interface TajweedCapability {
  enabled: boolean;
  reason?: string;
}

export const TAJWEED_CAPABILITY: TajweedCapability = {
  enabled: false,
  reason: 'Requires verified Tajweed text or font data.',
};

export const LINE_STYLES: LineStyleCapability[] = [
  { value: 'flowing', label: 'Flowing (default)', enabled: true },
  { value: '8-line', label: '8 lines per page', enabled: false, reason: 'Needs verified 8-line line-break data.' },
  { value: '12-line', label: '12 lines per page', enabled: false, reason: 'Needs verified 12-line line-break data.' },
  { value: '16-line', label: '16 lines per page', enabled: false, reason: 'Needs verified 16-line line-break data.' },
];

// ─────────────────────────────────────────────────────────────────────────
// Capability-aware builders.
//
// These merge the static option catalog with the live {@link Capabilities}
// snapshot from `/api/quran/capabilities`. A script/style is enabled only
// when the active source actually provides the data for it — never hardcoded.
// While `caps` is null (still loading) the always-available options stay on
// and conditional ones show a neutral "checking" note.
// ─────────────────────────────────────────────────────────────────────────

const CHECKING = 'Checking what the active source supports…';

function resolve(
  caps: Capabilities | null,
  available: boolean,
  flag: keyof Capabilities['flags'],
): { enabled: boolean; reason?: string } {
  if (!caps) return { enabled: false, reason: CHECKING };
  if (available) return { enabled: true };
  return { enabled: false, reason: flagHelp(caps.flags[flag]) };
}

export function buildQuranScripts(caps: Capabilities | null): QuranScriptCapability[] {
  const meta = Object.fromEntries(QURAN_SCRIPTS.map((s) => [s.value, s])) as Record<
    QuranScript,
    QuranScriptCapability
  >;
  const make = (value: QuranScript, available: boolean, flag: keyof Capabilities['flags']) => ({
    ...meta[value],
    ...resolve(caps, available, flag),
  });
  return [
    make('uthmani', caps ? caps.hasUthmaniText : true, 'uthmani'),
    make('uthmani-simple', !!caps?.hasUthmaniSimple, 'uthmaniSimple'),
    make('imlaei', !!caps?.hasImlaei, 'imlaei'),
    make('tajweed', !!caps?.hasTajweed, 'tajweed'),
  ];
}

export function buildMushafStyles(caps: Capabilities | null): MushafStyleCapability[] {
  const meta = Object.fromEntries(MUSHAF_STYLES.map((s) => [s.value, s])) as Record<
    MushafStyle,
    MushafStyleCapability
  >;
  return [
    { ...meta['standard'], enabled: true },
    { ...meta['ayah-by-ayah'], enabled: true },
    { ...meta['page'], ...resolve(caps, !!caps?.hasMushafPages, 'mushafPages') },
    { ...meta['eight-line'], ...resolve(caps, !!caps?.hasMushafLineBreaks8, 'mushafLineBreaks8') },
    { ...meta['twelve-line'], ...resolve(caps, !!caps?.hasMushafLineBreaks12, 'mushafLineBreaks12') },
    { ...meta['sixteen-line'], ...resolve(caps, !!caps?.hasMushafLineBreaks16, 'mushafLineBreaks16') },
  ];
}

export function buildLineStyles(caps: Capabilities | null): LineStyleCapability[] {
  return [
    { value: 'flowing', label: 'Flowing (default)', enabled: true },
    { value: '8-line', label: '8 lines per page', ...resolve(caps, !!caps?.hasMushafLineBreaks8, 'mushafLineBreaks8') },
    { value: '12-line', label: '12 lines per page', ...resolve(caps, !!caps?.hasMushafLineBreaks12, 'mushafLineBreaks12') },
    { value: '16-line', label: '16 lines per page', ...resolve(caps, !!caps?.hasMushafLineBreaks16, 'mushafLineBreaks16') },
  ];
}

export function buildTajweedCapability(caps: Capabilities | null): TajweedCapability {
  if (!caps) return { enabled: false, reason: CHECKING };
  if (caps.hasTajweed) return { enabled: true };
  return { enabled: false, reason: flagHelp(caps.flags.tajweed) };
}
