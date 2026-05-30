'use client';

import { readJSON, writeJSON } from '@/lib/utils/storage';
import type { AppSettings } from '@/lib/types/settings';

const KEY = 'settings';

export const DEFAULT_SETTINGS: AppSettings = {
  reading: {
    arabicFont: 'amiri',
    arabicFontSize: 32,
    translationFontSize: 16,
    lineHeight: 2,
    showTranslation: true,
    showTransliteration: false,
    showWordByWord: false,
    showTafsirInline: false,
    showSourceLabels: true,
    showAyahActions: true,
    autoScrollWithAudio: true,
    mode: 'reading',
    mushafStyle: 'standard',
    script: 'uthmani',
    lineStyle: 'flowing',
    tajweedMode: false,
  },
  translation: {
    defaultLanguage: 'en',
    selected: ['en.sahih'],
    displayStyle: 'stacked',
  },
  tafsir: {
    defaultTafsirId: null,
    language: 'en',
    displayMode: 'panel',
  },
  audio: {
    defaultReciterId: 'ar.alafasy',
    playbackSpeed: 1,
    repeatMode: 'off',
    autoScroll: true,
    autoPlayNextAyah: true,
    autoPlayNextSurah: false,
    showMiniPlayer: true,
    audioQuality: 'standard',
  },
  memorization: {
    repeatCount: 3,
    delayBetweenRepeatsMs: 800,
    hideTranslationDuringReview: true,
    reviewSchedule: 'daily',
  },
  appearance: {
    theme: 'dark',
    density: 'comfortable',
  },
};

export function loadSettings(): AppSettings {
  const stored = readJSON<Partial<AppSettings> | null>(KEY, null);
  if (!stored) return DEFAULT_SETTINGS;
  return {
    reading: { ...DEFAULT_SETTINGS.reading, ...stored.reading },
    translation: { ...DEFAULT_SETTINGS.translation, ...stored.translation },
    tafsir: { ...DEFAULT_SETTINGS.tafsir, ...stored.tafsir },
    audio: { ...DEFAULT_SETTINGS.audio, ...stored.audio },
    memorization: { ...DEFAULT_SETTINGS.memorization, ...stored.memorization },
    appearance: { ...DEFAULT_SETTINGS.appearance, ...stored.appearance },
  };
}

export function saveSettings(next: AppSettings): void {
  writeJSON(KEY, next);
}

export function updateSettings<K extends keyof AppSettings>(
  group: K,
  patch: Partial<AppSettings[K]>,
): AppSettings {
  const current = loadSettings();
  const next: AppSettings = { ...current, [group]: { ...current[group], ...patch } };
  saveSettings(next);
  return next;
}

export function resetSettings(): AppSettings {
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}
