'use client';

import { readJSON, writeJSON } from '@/lib/utils/storage';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import type {
  DailyProgress,
  ReadingGoal,
  ReadingHistoryEntry,
} from '@/lib/types/user';
import type { ReadingProgress } from '@/lib/types/quran';

const KEY_LAST = 'last-read';
const KEY_HISTORY = 'reading-history';
const KEY_DAILY = 'daily-progress';
const KEY_GOAL = 'reading-goal';

export function getLastRead(): ReadingProgress | null {
  return readJSON<ReadingProgress | null>(KEY_LAST, null);
}

export function recordRead(surah: number, ayah: number): ReadingProgress | null {
  const meta = getSurahByNumber(surah);
  if (!meta) return null;
  const percent = Math.round((ayah / meta.ayahCount) * 100);
  const entry: ReadingProgress = {
    surah: meta,
    ayah,
    percent,
    lastReadAt: new Date().toISOString(),
  };
  writeJSON(KEY_LAST, entry);

  // History
  const history = readJSON<ReadingHistoryEntry[]>(KEY_HISTORY, []);
  const head: ReadingHistoryEntry = {
    surah,
    ayah,
    verseKey: `${surah}:${ayah}`,
    at: entry.lastReadAt,
  };
  writeJSON(KEY_HISTORY, [head, ...history].slice(0, 200));

  // Daily counter
  const today = new Date().toISOString().slice(0, 10);
  const daily = readJSON<DailyProgress[]>(KEY_DAILY, []);
  const dayIdx = daily.findIndex((d) => d.date === today);
  if (dayIdx >= 0) {
    daily[dayIdx] = { ...daily[dayIdx], ayahsRead: daily[dayIdx].ayahsRead + 1 };
  } else {
    daily.unshift({ date: today, ayahsRead: 1, pagesRead: 0, minutesRead: 0 });
  }
  writeJSON(KEY_DAILY, daily.slice(0, 365));

  return entry;
}

export function getReadingHistory(): ReadingHistoryEntry[] {
  return readJSON<ReadingHistoryEntry[]>(KEY_HISTORY, []);
}

export function getDailyProgress(): DailyProgress[] {
  return readJSON<DailyProgress[]>(KEY_DAILY, []);
}

export function getStreak(): number {
  const daily = getDailyProgress();
  if (!daily.length) return 0;
  // Walk back from today; break when a day has 0 ayahs read.
  const sorted = [...daily].sort((a, b) => (a.date < b.date ? 1 : -1));
  let streak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const entry = sorted.find((x) => x.date === iso);
    if (!entry || entry.ayahsRead === 0) break;
    streak++;
  }
  return streak;
}

export function getReadingGoal(): ReadingGoal | null {
  return readJSON<ReadingGoal | null>(KEY_GOAL, null);
}

export function setReadingGoal(goal: ReadingGoal): void {
  writeJSON(KEY_GOAL, goal);
}

export function clearReadingGoal(): void {
  writeJSON(KEY_GOAL, null);
}
