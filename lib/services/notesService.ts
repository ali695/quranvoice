'use client';

import { readJSON, writeJSON } from '@/lib/utils/storage';
import type { AyahNote } from '@/lib/types/user';

const KEY = 'notes';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/** Sanitize free-text note input to plain text without HTML. */
function sanitize(text: string): string {
  return text.replace(/<[^>]*>/g, '').slice(0, 4000);
}

export function listNotes(): AyahNote[] {
  return readJSON<AyahNote[]>(KEY, []);
}

export function getNoteForAyah(surah: number, ayah: number): AyahNote | undefined {
  return listNotes().find((n) => n.surah === surah && n.ayah === ayah);
}

export function upsertNote(
  surah: number,
  ayah: number,
  text: string,
  tags?: string[],
): AyahNote {
  const all = listNotes();
  const now = new Date().toISOString();
  const clean = sanitize(text);
  const existing = all.find((n) => n.surah === surah && n.ayah === ayah);
  if (existing) {
    const updated: AyahNote = { ...existing, text: clean, tags, updatedAt: now };
    writeJSON(
      KEY,
      all.map((n) => (n.id === existing.id ? updated : n)),
    );
    return updated;
  }
  const next: AyahNote = {
    id: uid(),
    surah,
    ayah,
    verseKey: `${surah}:${ayah}`,
    text: clean,
    tags,
    createdAt: now,
    updatedAt: now,
  };
  writeJSON(KEY, [next, ...all]);
  return next;
}

export function deleteNote(id: string): void {
  writeJSON(KEY, listNotes().filter((n) => n.id !== id));
}

export function searchNotes(query: string): AyahNote[] {
  const q = query.trim().toLowerCase();
  if (!q) return listNotes();
  return listNotes().filter(
    (n) =>
      n.text.toLowerCase().includes(q) ||
      n.verseKey.includes(q) ||
      (n.tags ?? []).some((t) => t.toLowerCase().includes(q)),
  );
}

export function exportNotes(): string {
  return JSON.stringify(listNotes(), null, 2);
}
