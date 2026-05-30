'use client';

import { readJSON, writeJSON } from '@/lib/utils/storage';
import type { Bookmark, BookmarkCollection } from '@/lib/types/user';

const KEY_BOOKMARKS = 'bookmarks';
const KEY_COLLECTIONS = 'bookmark-collections';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function listBookmarks(): Bookmark[] {
  return readJSON<Bookmark[]>(KEY_BOOKMARKS, []);
}

export function isBookmarked(surah: number, ayah: number): boolean {
  return listBookmarks().some((b) => b.surah === surah && b.ayah === ayah);
}

export function addBookmark(input: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
  const all = listBookmarks();
  const existing = all.find((b) => b.surah === input.surah && b.ayah === input.ayah);
  if (existing) return existing;
  const next: Bookmark = { ...input, id: uid(), createdAt: new Date().toISOString() };
  writeJSON(KEY_BOOKMARKS, [next, ...all]);
  return next;
}

export function removeBookmark(id: string): void {
  writeJSON(KEY_BOOKMARKS, listBookmarks().filter((b) => b.id !== id));
}

export function toggleBookmark(input: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark | null {
  const all = listBookmarks();
  const existing = all.find((b) => b.surah === input.surah && b.ayah === input.ayah);
  if (existing) {
    removeBookmark(existing.id);
    return null;
  }
  return addBookmark(input);
}

export function listCollections(): BookmarkCollection[] {
  return readJSON<BookmarkCollection[]>(KEY_COLLECTIONS, []);
}

export function createCollection(name: string, description?: string): BookmarkCollection {
  const all = listCollections();
  const next: BookmarkCollection = {
    id: uid(),
    name,
    description,
    createdAt: new Date().toISOString(),
  };
  writeJSON(KEY_COLLECTIONS, [next, ...all]);
  return next;
}

export function deleteCollection(id: string): void {
  writeJSON(KEY_COLLECTIONS, listCollections().filter((c) => c.id !== id));
  // Detach bookmarks
  const updated = listBookmarks().map((b) =>
    b.collectionId === id ? { ...b, collectionId: undefined } : b,
  );
  writeJSON(KEY_BOOKMARKS, updated);
}

export function exportBookmarks(): string {
  return JSON.stringify({ bookmarks: listBookmarks(), collections: listCollections() }, null, 2);
}
