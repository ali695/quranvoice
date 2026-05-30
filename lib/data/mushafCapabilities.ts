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

import type { MushafStyle, QuranScript } from '@/lib/types/settings';

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

export const LINE_STYLES: Array<{ value: 'flowing' | '8-line' | '12-line' | '16-line'; label: string; enabled: boolean; reason?: string }> = [
  { value: 'flowing', label: 'Flowing (default)', enabled: true },
  { value: '8-line', label: '8 lines per page', enabled: false, reason: 'Needs verified 8-line line-break data.' },
  { value: '12-line', label: '12 lines per page', enabled: false, reason: 'Needs verified 12-line line-break data.' },
  { value: '16-line', label: '16 lines per page', enabled: false, reason: 'Needs verified 16-line line-break data.' },
];
