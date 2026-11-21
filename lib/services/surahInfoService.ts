/**
 * Surah introductions ("chapter info") from the Quran.Foundation Content API.
 *
 * Server-only. The text is published by Quran.Foundation with its own source
 * attribution (e.g. Tafhim al-Qur'an) and is shown verbatim, sanitized, with
 * that attribution. Nothing here is generated or paraphrased.
 */

import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { htmlToText, sanitizeHtml } from '@/lib/utils/sanitizeHtml';

interface FoundationChapterInfo {
  chapter_info?: {
    chapter_id: number;
    language_name?: string;
    short_text?: string;
    source?: string;
    text?: string;
  };
}

export interface SurahIntro {
  surah: number;
  /** BCP-47 code of the language actually returned. */
  lang: 'en' | 'ur';
  dir: 'ltr' | 'rtl';
  /** Sanitized HTML (allowlisted tags, no attributes). */
  html: string;
  /** Plain-text excerpt for previews and meta descriptions. */
  excerpt: string;
  /** Attribution string supplied by the provider. */
  source: string;
}

/** Locales with a provider introduction; everything else falls back to English. */
const SUPPORTED: Record<string, SurahIntro['lang']> = { en: 'en', ur: 'ur' };

function excerptOf(text: string, max = 220): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('۔ '));
  return (lastStop > 80 ? cut.slice(0, lastStop + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`).trim();
}

export async function getSurahIntro(surah: number, locale: string): Promise<SurahIntro | null> {
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  const wanted = SUPPORTED[locale] ?? 'en';
  // Intros change rarely; cache for 30 days.
  const res = await foundationFetch<FoundationChapterInfo>(F.chapterInfo(surah, wanted), {
    revalidate: 60 * 60 * 24 * 30,
  });
  const info = res?.chapter_info;
  if (!info?.text) return null;

  const html = sanitizeHtml(info.text);
  const text = htmlToText(info.text);
  if (text.length < 40) return null;

  // The provider may fall back to English when a language is missing, and its
  // language_name field is not always set, so detect from the script itself.
  const letters = text.replace(/[^\p{L}]/gu, '');
  const arabicScript = (letters.match(/[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/g) ?? []).length;
  const lang: SurahIntro['lang'] = wanted === 'ur' && arabicScript > letters.length * 0.5 ? 'ur' : 'en';
  // Strip the leading section label ("Name") so the excerpt reads as a sentence.
  const plainShort = info.short_text ? htmlToText(info.short_text) : '';
  const excerptSource = plainShort.length > 40 ? plainShort : text.replace(/^(Name|نام)\s*/u, '');

  return {
    surah,
    lang,
    dir: lang === 'ur' ? 'rtl' : 'ltr',
    html,
    excerpt: excerptOf(excerptSource),
    source: (info.source ?? '').trim() || 'Quran.Foundation',
  };
}
