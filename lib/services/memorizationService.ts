'use client';

import { readJSON, writeJSON } from '@/lib/utils/storage';
import type { MemorizationEntry } from '@/lib/types/user';

const KEY = 'memorization';

export function listMemorization(): MemorizationEntry[] {
  return readJSON<MemorizationEntry[]>(KEY, []);
}

export function isMemorized(surah: number, ayah: number): boolean {
  return listMemorization().some((e) => e.surah === surah && e.ayah === ayah);
}

export function addToMemorization(surah: number, ayah: number): MemorizationEntry {
  const all = listMemorization();
  const existing = all.find((e) => e.surah === surah && e.ayah === ayah);
  if (existing) return existing;
  const now = new Date();
  const next: MemorizationEntry = {
    surah,
    ayah,
    verseKey: `${surah}:${ayah}`,
    mastery: 0,
    nextReviewAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    reviewCount: 0,
    addedAt: now.toISOString(),
  };
  writeJSON(KEY, [next, ...all]);
  return next;
}

export function removeFromMemorization(surah: number, ayah: number): void {
  writeJSON(
    KEY,
    listMemorization().filter((e) => !(e.surah === surah && e.ayah === ayah)),
  );
}

export function recordReview(
  surah: number,
  ayah: number,
  /** 0-1: self-rated confidence after the review */
  mastery: number,
): void {
  const all = listMemorization();
  const idx = all.findIndex((e) => e.surah === surah && e.ayah === ayah);
  if (idx < 0) return;
  const cur = all[idx];
  // Simple spaced-repetition: better mastery → longer interval.
  const baseDays = mastery >= 0.9 ? 7 : mastery >= 0.6 ? 3 : 1;
  const next = new Date(Date.now() + baseDays * 24 * 60 * 60 * 1000).toISOString();
  all[idx] = {
    ...cur,
    mastery: Math.max(0, Math.min(1, mastery)),
    reviewCount: cur.reviewCount + 1,
    nextReviewAt: next,
  };
  writeJSON(KEY, all);
}

export function getDueReviews(): MemorizationEntry[] {
  const now = Date.now();
  return listMemorization().filter((e) => Date.parse(e.nextReviewAt) <= now);
}
