/**
 * Surah alias resolver (client-safe — pure data + functions).
 *
 * Maps user input (transliterations, common spellings, Arabic names) to a
 * surah number. Built from the static catalog plus an explicit alias table
 * for the many popular spellings, so "Baqarah", "Al-Baqara", "البقرة",
 * "Yaseen", "Kahf", etc. all resolve.
 */

import { SURAHS } from '@/lib/data/surahs';

/** Normalize a name for matching: lowercase, drop articles, strip separators. */
export function normalizeName(input: string): string {
  let s = (input || '').toLowerCase().trim();
  // Normalize Arabic: strip tatweel + harakat so "البقرة"/"الْبَقَرَة" match.
  s = s.replace(/[ـً-ْٰ]/g, '');
  // Replace separators with spaces.
  s = s.replace(/[\-_'’`.]/g, ' ');
  // Drop leading Arabic article "ال".
  s = s.replace(/\bال/g, '');
  // Drop leading Latin articles / sun-letter assimilations.
  s = s.replace(/^\s*(al|an|ar|as|ash|at|az|ad|adh|el)\s+/i, '');
  // Keep latin letters, digits, and Arabic letters; drop the rest.
  s = s.replace(/[^a-z0-9ء-ي\s]/g, '');
  // Collapse whitespace.
  return s.replace(/\s+/g, ' ').trim();
}

/** Explicit aliases (normalized form already applied at lookup time). */
const EXPLICIT: Record<string, number> = {
  // Distinctive spellings that differ from the catalog transliteration.
  fatiha: 1, fatihah: 1, faatiha: 1, opening: 1,
  baqara: 2, baqarah: 2, baqra: 2, cow: 2,
  imran: 3, 'aal imran': 3, 'ali imran': 3, 'aali imran': 3, 'family of imran': 3,
  nisa: 4, 'an nisa': 4, women: 4,
  maidah: 5, maida: 5, 'table spread': 5,
  anam: 6, 'al anam': 6, cattle: 6,
  araf: 7, 'al araf': 7, heights: 7,
  anfal: 8, 'spoils of war': 8,
  tawbah: 9, taubah: 9, tawba: 9, baraah: 9, baraa: 9, repentance: 9,
  yunus: 10, jonah: 10,
  hud: 11,
  yusuf: 12, joseph: 12,
  rad: 13, 'ar rad': 13, thunder: 13,
  ibrahim: 14, abraham: 14,
  hijr: 15,
  nahl: 16, bee: 16,
  isra: 17, 'al isra': 17, 'bani israil': 17, 'bani isra il': 17, 'night journey': 17,
  kahf: 18, 'al kahf': 18, cave: 18,
  maryam: 19, mary: 19,
  taha: 20, 'ta ha': 20,
  anbiya: 21, prophets: 21,
  hajj: 22, pilgrimage: 22,
  muminun: 23, muminoon: 23, 'al muminun': 23, believers: 23,
  nur: 24, light: 24,
  furqan: 25, criterion: 25,
  shuara: 26, poets: 26,
  naml: 27, ant: 27, ants: 27,
  qasas: 28, stories: 28,
  ankabut: 29, spider: 29,
  rum: 30, romans: 30,
  luqman: 31,
  sajdah: 32, sajda: 32, prostration: 32,
  ahzab: 33, 'the clans': 33,
  saba: 34, sheba: 34,
  fatir: 35, originator: 35,
  yasin: 36, yaseen: 36, 'ya sin': 36, 'ya seen': 36,
  saffat: 37, 'those who set the ranks': 37,
  sad: 38,
  zumar: 39, 'the troops': 39,
  ghafir: 40, mumin: 40, forgiver: 40,
  fussilat: 41, 'ha mim sajdah': 41,
  shura: 42, 'ash shura': 42, consultation: 42,
  zukhruf: 43, 'ornaments of gold': 43,
  dukhan: 44, smoke: 44,
  jathiyah: 45, jathiya: 45, 'crouching': 45,
  ahqaf: 46,
  muhammad: 47,
  fath: 48, victory: 48,
  hujurat: 49, 'the rooms': 49,
  qaf: 50,
  dhariyat: 51, zariyat: 51,
  tur: 52, 'the mount': 52,
  najm: 53, star: 53,
  qamar: 54, moon: 54,
  rahman: 55, 'ar rahman': 55, 'the beneficent': 55,
  waqiah: 56, waqia: 56, 'the inevitable': 56,
  hadid: 57, iron: 57,
  mujadilah: 58, mujadila: 58, 'the pleading woman': 58,
  hashr: 59, exile: 59,
  mumtahanah: 60, mumtahina: 60,
  saff: 61, 'the ranks': 61,
  jumuah: 62, jumua: 62, friday: 62,
  munafiqun: 63, hypocrites: 63,
  taghabun: 64,
  talaq: 65, divorce: 65,
  tahrim: 66, prohibition: 66,
  mulk: 67, 'al mulk': 67, sovereignty: 67, dominion: 67,
  qalam: 68, pen: 68,
  haqqah: 69, 'the reality': 69,
  maarij: 70, 'the ascending stairways': 70,
  nuh: 71, noah: 71,
  jinn: 72,
  muzzammil: 73, 'the enshrouded one': 73,
  muddathir: 74, mudathir: 74,
  qiyamah: 75, qiyama: 75, resurrection: 75,
  insan: 76, dahr: 76, man: 76,
  mursalat: 77,
  naba: 78, 'the tidings': 78,
  naziat: 79,
  abasa: 80, 'he frowned': 80,
  takwir: 81,
  infitar: 82, 'the cleaving': 82,
  mutaffifin: 83, 'the defrauding': 83,
  inshiqaq: 84,
  buruj: 85, 'the mansions of the stars': 85,
  tariq: 86, 'the morning star': 86,
  ala: 87, 'al ala': 87, 'the most high': 87,
  ghashiyah: 88, ghashiya: 88,
  fajr: 89, dawn: 89,
  balad: 90, 'the city': 90,
  shams: 91, sun: 91,
  layl: 92, lail: 92, night: 92,
  duha: 93, 'ad duha': 93, morning: 93,
  sharh: 94, inshirah: 94, 'the relief': 94,
  tin: 95, fig: 95,
  alaq: 96, 'the clot': 96,
  qadr: 97, 'the power': 97, decree: 97,
  bayyinah: 98, bayyina: 98, 'the clear proof': 98,
  zalzalah: 99, zalzala: 99, earthquake: 99,
  adiyat: 100, 'the courser': 100,
  qariah: 101, qaria: 101, calamity: 101,
  takathur: 102, 'rivalry in world increase': 102,
  asr: 103, 'al asr': 103, 'the declining day': 103,
  humazah: 104, humaza: 104, 'the traducer': 104,
  fil: 105, elephant: 105,
  quraysh: 106, quraish: 106,
  maun: 107, 'small kindnesses': 107,
  kawthar: 108, kausar: 108, abundance: 108,
  kafirun: 109, 'the disbelievers': 109,
  nasr: 110, 'divine support': 110,
  masad: 111, lahab: 111, 'the palm fiber': 111,
  ikhlas: 112, 'al ikhlas': 112, sincerity: 112,
  falaq: 113, 'al falaq': 113, daybreak: 113,
  nas: 114, 'an nas': 114, mankind: 114,
};

/** Built once: normalized catalog names (transliteration + Arabic) → number. */
const CATALOG: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  for (const s of SURAHS) {
    const t = normalizeName(s.transliteration);
    if (t) map[t] = s.number;
    const a = normalizeName(s.arabic);
    if (a) map[a] = s.number;
  }
  return map;
})();

/** Resolve a name/spelling to a surah number, or null. */
export function resolveSurahName(input: string): number | null {
  const n = normalizeName(input);
  if (!n) return null;
  if (EXPLICIT[n] !== undefined) return EXPLICIT[n];
  if (CATALOG[n] !== undefined) return CATALOG[n];
  // Spaceless fallback ("albaqarah" / "yasin").
  const compact = n.replace(/\s+/g, '');
  if (EXPLICIT[compact] !== undefined) return EXPLICIT[compact];
  if (CATALOG[compact] !== undefined) return CATALOG[compact];
  return null;
}

/** Special, well-known verse references. */
export const SPECIAL_REFERENCES: Array<{ match: RegExp; surah: number; ayah: number; label: string }> = [
  { match: /(ayat[ul\s-]*kursi|ayatul\s*kursi|آية\s*الكرسي|آیت\s*الکرسی)/i, surah: 2, ayah: 255, label: 'Ayat al-Kursi' },
];
