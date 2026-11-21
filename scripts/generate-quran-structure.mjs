#!/usr/bin/env node
/**
 * Generates lib/data/quranStructure.ts from the Tanzil Quran metadata file.
 *
 * Source: https://tanzil.net/res/text/metadata/quran-data.xml
 * License: Creative Commons Attribution 3.0 — (C) Tanzil Project, tanzil.net
 *
 * Only structural boundaries are extracted (surah lengths, juz, hizb quarters,
 * manzils, rukus, Madani mushaf page starts, sajdah positions). No Quran text
 * is read or written by this script.
 *
 * Usage: node scripts/generate-quran-structure.mjs <path-to-quran-data.xml>
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/generate-quran-structure.mjs <quran-data.xml>');
  process.exit(1);
}
const xml = readFileSync(src, 'utf8');

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/(\w+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}
function all(name) {
  return [...xml.matchAll(new RegExp(`<${name}\\s[^>]*?/>`, 'g'))].map((m) => attrs(m[0]));
}
const key = (a) => [Number(a.sura), Number(a.aya)];

const suras = all('sura');
const juzs = all('juz').map(key);
const quarters = all('quarter').map(key);
const manzils = all('manzil').map(key);
const rukus = all('ruku').map(key);
const pages = all('page').map(key);
const sajdas = all('sajda').map((a) => [Number(a.sura), Number(a.aya), a.type]);

const expect = { suras: [suras.length, 114], juzs: [juzs.length, 30], quarters: [quarters.length, 240], manzils: [manzils.length, 7], pages: [pages.length, 604], sajdas: [sajdas.length, 15] };
for (const [name, [got, want]] of Object.entries(expect)) {
  if (got !== want) {
    console.error(`Unexpected ${name} count: ${got} (expected ${want})`);
    process.exit(1);
  }
}
const ayahTotal = suras.reduce((n, s) => n + Number(s.ayas), 0);
if (ayahTotal !== 6236) {
  console.error(`Unexpected ayah total: ${ayahTotal}`);
  process.exit(1);
}

const j = (v) => JSON.stringify(v);
const body = `/**
 * Quran structural boundaries — GENERATED FILE, do not edit by hand.
 * Regenerate with: node scripts/generate-quran-structure.mjs <quran-data.xml>
 *
 * Source: Tanzil Quran metadata (https://tanzil.net/res/text/metadata/quran-data.xml)
 * License: Creative Commons Attribution 3.0 — (C) Tanzil Project, tanzil.net
 *
 * Positions are [surah, ayah] pairs. Page starts follow the 604-page Madani mushaf.
 * Contains no Quran text.
 */

export type VersePos = readonly [surah: number, ayah: number];

export const STRUCTURE_SOURCE = {
  name: 'Tanzil Project',
  url: 'https://tanzil.net',
  license: 'CC BY 3.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
} as const;

/** Ayah count per surah, index 0 = Surah 1. */
export const SURAH_AYAH_COUNTS: readonly number[] = ${j(suras.map((s) => Number(s.ayas)))};

/** Ruku count per surah, index 0 = Surah 1. */
export const SURAH_RUKU_COUNTS: readonly number[] = ${j(suras.map((s) => Number(s.rukus)))};

/** Start of each juz (30). */
export const JUZ_STARTS: readonly VersePos[] = ${j(juzs)};

/** Start of each hizb quarter (240): 8 per juz, 4 per hizb. */
export const HIZB_QUARTER_STARTS: readonly VersePos[] = ${j(quarters)};

/** Start of each manzil (7). */
export const MANZIL_STARTS: readonly VersePos[] = ${j(manzils)};

/** Start of each ruku (${rukus.length}). */
export const RUKU_STARTS: readonly VersePos[] = ${j(rukus)};

/** Start of each Madani mushaf page (604). */
export const PAGE_STARTS: readonly VersePos[] = ${j(pages)};

/** Sajdah (prostration) verses (15), with Tanzil's classification. */
export const SAJDAHS: ReadonlyArray<readonly [surah: number, ayah: number, type: string]> = ${j(sajdas)};
`;

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'lib', 'data', 'quranStructure.ts');
writeFileSync(out, body);
console.log(`Wrote ${out}: ${suras.length} surahs, ${ayahTotal} ayahs, ${quarters.length} quarters, ${rukus.length} rukus, ${pages.length} pages, ${sajdas.length} sajdahs`);
