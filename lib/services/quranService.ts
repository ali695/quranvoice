/**
 * QuranService — server-only.
 *
 * Provider chain (in order):
 *   1. Quran.Foundation Content API (when QURAN_FOUNDATION_* env is set)
 *   2. AlQuran Cloud open API (fallback, no auth)
 *   3. Static metadata catalog (structural only, no Arabic text)
 *
 * Arabic text is only returned when it came from a verified provider.
 */

import { alquranCloudFetch } from '@/lib/api/quranApiProxy';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import { FALLBACK_SURAHS, getSurahByNumber } from '@/lib/data/fallbackSurahs';
import type { Ayah, Surah } from '@/lib/types/quran';

export interface SurahWithAyahs {
  surah: Surah;
  ayahs: Ayah[];
  textResourceId: string;
  textSourceName: string;
  provider: 'foundation' | 'alquran-cloud';
}

interface FChapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name?: { name?: string };
  verses_count: number;
  revelation_place: 'makkah' | 'madinah' | string;
  revelation_order?: number;
  pages?: number[];
}

interface FoundationVerse {
  id?: number;
  verse_number: number;
  verse_key: string;
  text_uthmani?: string;
  text_uthmani_simple?: string;
  text_imlaei?: string;
  juz_number?: number;
  page_number?: number;
  hizb_number?: number;
  rub_number?: number;
  sajdah_number?: number | null;
}

interface FoundationVersesResponse {
  verses?: FoundationVerse[];
  pagination?: { total_pages?: number; total_records?: number };
}

interface AlquranCloudAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter?: number;
  sajda?: boolean | { recommended: boolean; obligatory: boolean };
}

interface AlquranCloudSurahPayload {
  data?: { number: number; ayahs: AlquranCloudAyah[] };
}

export async function listAllSurahs(): Promise<Surah[]> {
  if (isFoundationConfigured()) {
    const json = await foundationFetch<{ chapters?: FChapter[] }>(F.chapters(), {
      revalidate: 86_400,
    });
    if (json?.chapters?.length) {
      return json.chapters.map<Surah>((c) => ({
        number: c.id,
        transliteration: c.name_simple,
        arabic: c.name_arabic,
        meaning: c.translated_name?.name ?? '',
        ayahCount: c.verses_count,
        revelation: c.revelation_place === 'madinah' ? 'medinan' : 'meccan',
        pageStart: c.pages?.[0],
      }));
    }
  }
  return FALLBACK_SURAHS;
}

export async function getSurahMeta(num: number): Promise<Surah | null> {
  if (!Number.isInteger(num) || num < 1 || num > 114) return null;
  return getSurahByNumber(num) ?? null;
}

export async function getSurahWithAyahs(num: number): Promise<SurahWithAyahs | null> {
  const meta = await getSurahMeta(num);
  if (!meta) return null;

  // Provider 1: Quran.Foundation
  if (isFoundationConfigured()) {
    const json = await foundationFetch<FoundationVersesResponse>(
      F.versesByChapter(
        num,
        'per_page=300&fields=text_uthmani,juz_number,page_number,hizb_number,rub_number,sajdah_number',
      ),
    );
    if (json?.verses?.length) {
      const ayahs: Ayah[] = json.verses.map((v) => ({
        surahNumber: num,
        ayahNumber: v.verse_number,
        verseKey: v.verse_key,
        arabic: v.text_uthmani ?? v.text_uthmani_simple ?? v.text_imlaei ?? '',
        juz: v.juz_number,
        page: v.page_number,
        hizbQuarter: v.hizb_number,
        sajdah: typeof v.sajdah_number === 'number',
      }));
      return {
        surah: meta,
        ayahs,
        textResourceId: 'foundation-uthmani',
        textSourceName: 'Quran.Foundation (Uthmani)',
        provider: 'foundation',
      };
    }
  }

  // Provider 2: AlQuran Cloud
  const cloud = await alquranCloudFetch<AlquranCloudSurahPayload>(
    `/surah/${num}/quran-uthmani`,
  );
  if (cloud?.data?.ayahs?.length) {
    const ayahs: Ayah[] = cloud.data.ayahs.map((a) => ({
      surahNumber: num,
      ayahNumber: a.numberInSurah,
      verseKey: `${num}:${a.numberInSurah}`,
      arabic: a.text,
      juz: a.juz,
      page: a.page,
      hizbQuarter: a.hizbQuarter,
      sajdah: Boolean(a.sajda),
    }));
    return {
      surah: meta,
      ayahs,
      textResourceId: 'alquran-cloud-uthmani',
      textSourceName: 'Tanzil.net via AlQuran Cloud',
      provider: 'alquran-cloud',
    };
  }

  return null;
}

export async function getAyah(surah: number, ayah: number): Promise<Ayah | null> {
  if (isFoundationConfigured()) {
    const json = await foundationFetch<{ verse?: FoundationVerse }>(
      F.verseByKey(`${surah}:${ayah}`, 'fields=text_uthmani,juz_number,page_number,hizb_number,sajdah_number'),
    );
    const v = json?.verse;
    if (v) {
      return {
        surahNumber: surah,
        ayahNumber: v.verse_number,
        verseKey: v.verse_key,
        arabic: v.text_uthmani ?? '',
        juz: v.juz_number,
        page: v.page_number,
        hizbQuarter: v.hizb_number,
        sajdah: typeof v.sajdah_number === 'number',
      };
    }
  }
  const data = await getSurahWithAyahs(surah);
  if (!data) return null;
  return data.ayahs.find((a) => a.ayahNumber === ayah) ?? null;
}
