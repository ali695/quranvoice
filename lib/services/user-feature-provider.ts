'use client';

/**
 * UserFeatureProvider — adapter interface for everything user-scoped.
 *
 * Two implementations ship today:
 *   1. `localProvider` — localStorage, used for guests.
 *   2. `supabaseProvider` — Supabase + RLS, used when a user is signed in.
 *
 * The interface is designed to map cleanly onto Quran.Foundation's
 * advanced user scopes (Collections, Bookmarks, Preferences, Reading
 * sessions, Goals, Streaks, Activity Days, Notes, Tags) so a third
 * provider can be added later without changing call-sites.
 *
 * Call-sites should NOT import a specific provider — they should call
 * `getUserFeatureProvider()` which picks the right one for the user.
 */

import {
  addBookmark as localAddBookmark,
  isBookmarked as localIsBookmarked,
  listBookmarks as localListBookmarks,
  removeBookmark as localRemoveBookmark,
  listCollections as localListCollections,
  createCollection as localCreateCollection,
  deleteCollection as localDeleteCollection,
} from './bookmarkService';
import {
  deleteNote as localDeleteNote,
  listNotes as localListNotes,
  searchNotes as localSearchNotes,
  upsertNote as localUpsertNote,
  getNoteForAyah as localGetNoteForAyah,
} from './notesService';
import {
  DEFAULT_SETTINGS,
  loadSettings as localLoadSettings,
  saveSettings as localSaveSettings,
} from './settingsService';
import {
  getDailyProgress as localGetDailyProgress,
  getLastRead as localGetLastRead,
  getReadingGoal as localGetReadingGoal,
  getReadingHistory as localGetReadingHistory,
  getStreak as localGetStreak,
  recordRead as localRecordRead,
  setReadingGoal as localSetReadingGoal,
} from './progressService';
import {
  addToMemorization as localAddMemorization,
  getDueReviews as localGetDueReviews,
  isMemorized as localIsMemorized,
  listMemorization as localListMemorization,
  recordReview as localRecordReview,
  removeFromMemorization as localRemoveMemorization,
} from './memorizationService';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { AppSettings } from '@/lib/types/settings';
import type {
  AyahNote,
  Bookmark,
  BookmarkCollection,
  DailyProgress,
  MemorizationEntry,
  ReadingGoal,
  ReadingHistoryEntry,
} from '@/lib/types/user';
import type { ReadingProgress } from '@/lib/types/quran';

export interface UserFeatureProvider {
  readonly id: 'local' | 'supabase';
  // ─── Bookmarks ───
  listBookmarks(): Promise<Bookmark[]>;
  addBookmark(input: Omit<Bookmark, 'id' | 'createdAt'>): Promise<Bookmark>;
  removeBookmark(id: string): Promise<void>;
  isBookmarked(surah: number, ayah: number): Promise<boolean>;
  // ─── Collections ───
  listCollections(): Promise<BookmarkCollection[]>;
  createCollection(name: string, description?: string): Promise<BookmarkCollection>;
  deleteCollection(id: string): Promise<void>;
  // ─── Notes ───
  listNotes(): Promise<AyahNote[]>;
  searchNotes(q: string): Promise<AyahNote[]>;
  getNoteForAyah(surah: number, ayah: number): Promise<AyahNote | undefined>;
  upsertNote(surah: number, ayah: number, text: string, tags?: string[]): Promise<AyahNote>;
  deleteNote(id: string): Promise<void>;
  // ─── Settings ───
  loadSettings(): Promise<AppSettings>;
  saveSettings(next: AppSettings): Promise<void>;
  // ─── Progress / Goals / Streak ───
  recordRead(surah: number, ayah: number): Promise<ReadingProgress | null>;
  getLastRead(): Promise<ReadingProgress | null>;
  getReadingHistory(): Promise<ReadingHistoryEntry[]>;
  getDailyProgress(): Promise<DailyProgress[]>;
  getStreak(): Promise<number>;
  getReadingGoal(): Promise<ReadingGoal | null>;
  setReadingGoal(goal: ReadingGoal): Promise<void>;
  // ─── Memorization ───
  listMemorization(): Promise<MemorizationEntry[]>;
  getDueReviews(): Promise<MemorizationEntry[]>;
  isMemorized(surah: number, ayah: number): Promise<boolean>;
  addToMemorization(surah: number, ayah: number): Promise<MemorizationEntry>;
  removeFromMemorization(surah: number, ayah: number): Promise<void>;
  recordReview(surah: number, ayah: number, mastery: number): Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Local (guest) provider — wraps the existing localStorage services.
// ─────────────────────────────────────────────────────────────────────────────

const localProvider: UserFeatureProvider = {
  id: 'local',
  async listBookmarks() { return localListBookmarks(); },
  async addBookmark(input) { return localAddBookmark(input); },
  async removeBookmark(id) { localRemoveBookmark(id); },
  async isBookmarked(surah, ayah) { return localIsBookmarked(surah, ayah); },
  async listCollections() { return localListCollections(); },
  async createCollection(name, description) { return localCreateCollection(name, description); },
  async deleteCollection(id) { localDeleteCollection(id); },
  async listNotes() { return localListNotes(); },
  async searchNotes(q) { return localSearchNotes(q); },
  async getNoteForAyah(surah, ayah) { return localGetNoteForAyah(surah, ayah); },
  async upsertNote(surah, ayah, text, tags) { return localUpsertNote(surah, ayah, text, tags); },
  async deleteNote(id) { localDeleteNote(id); },
  async loadSettings() { return localLoadSettings(); },
  async saveSettings(next) { localSaveSettings(next); },
  async recordRead(surah, ayah) { return localRecordRead(surah, ayah); },
  async getLastRead() { return localGetLastRead(); },
  async getReadingHistory() { return localGetReadingHistory(); },
  async getDailyProgress() { return localGetDailyProgress(); },
  async getStreak() { return localGetStreak(); },
  async getReadingGoal() { return localGetReadingGoal(); },
  async setReadingGoal(goal) { localSetReadingGoal(goal); },
  async listMemorization() { return localListMemorization(); },
  async getDueReviews() { return localGetDueReviews(); },
  async isMemorized(surah, ayah) { return localIsMemorized(surah, ayah); },
  async addToMemorization(surah, ayah) { return localAddMemorization(surah, ayah); },
  async removeFromMemorization(surah, ayah) { localRemoveMemorization(surah, ayah); },
  async recordReview(surah, ayah, mastery) { localRecordReview(surah, ayah, mastery); },
};

// ─────────────────────────────────────────────────────────────────────────────
// Supabase provider — RLS-protected user data.
// Falls back to the local provider for ops that aren't fully implemented yet.
// ─────────────────────────────────────────────────────────────────────────────

// Inline DB row shapes. We don't run `supabase gen types` yet, so we
// document the row contracts here. They mirror the SQL migration.
interface BookmarkRow {
  id: string;
  surah: number;
  ayah: number;
  verse_key: string;
  collection_id: string | null;
  tags: string[] | null;
  note: string | null;
  created_at: string;
}
interface CollectionRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}
interface NoteRow {
  id: string;
  surah: number;
  ayah: number;
  verse_key: string;
  text: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}
interface DailyRow {
  occurred_on: string;
  ayahs_read: number;
  pages_read: number;
  minutes_read: number;
}
interface GoalRow {
  goal_type: string;
  target: number;
  started_at: string;
}
interface MemRow {
  surah: number;
  ayah: number;
  verse_key: string;
  mastery: number;
  review_count: number;
  next_review_at: string;
  added_at: string;
}

function makeSupabaseProvider(userId: string): UserFeatureProvider {
  const sb = getSupabaseBrowser();
  if (!sb) return localProvider;

  return {
    id: 'supabase',
    async listBookmarks(): Promise<Bookmark[]> {
      const { data } = await sb
        .from('bookmarks')
        .select('id, surah, ayah, verse_key, collection_id, tags, note, created_at')
        .order('created_at', { ascending: false });
      return ((data ?? []) as BookmarkRow[]).map((r) => ({
        id: r.id,
        surah: r.surah,
        ayah: r.ayah,
        verseKey: r.verse_key,
        collectionId: r.collection_id ?? undefined,
        tags: r.tags ?? undefined,
        note: r.note ?? undefined,
        createdAt: r.created_at,
      }));
    },
    async addBookmark(input) {
      const { data, error } = await sb
        .from('bookmarks')
        .insert({
          user_id: userId,
          surah: input.surah,
          ayah: input.ayah,
          verse_key: input.verseKey,
          collection_id: input.collectionId ?? null,
          tags: input.tags ?? [],
          note: input.note ?? null,
        })
        .select()
        .single();
      if (error || !data) {
        // Maybe it already exists — fetch it.
        const existing = await sb
          .from('bookmarks')
          .select('id, surah, ayah, verse_key, collection_id, tags, note, created_at')
          .eq('surah', input.surah)
          .eq('ayah', input.ayah)
          .maybeSingle();
        if (existing.data) {
          const e = existing.data as BookmarkRow;
          return {
            id: e.id,
            surah: e.surah,
            ayah: e.ayah,
            verseKey: e.verse_key,
            collectionId: e.collection_id ?? undefined,
            tags: e.tags ?? undefined,
            note: e.note ?? undefined,
            createdAt: e.created_at,
          };
        }
        throw error ?? new Error('Failed to add bookmark');
      }
      const d = data as BookmarkRow;
      return {
        id: d.id,
        surah: d.surah,
        ayah: d.ayah,
        verseKey: d.verse_key,
        collectionId: d.collection_id ?? undefined,
        tags: d.tags ?? undefined,
        note: d.note ?? undefined,
        createdAt: d.created_at,
      };
    },
    async removeBookmark(id) {
      await sb.from('bookmarks').delete().eq('id', id);
    },
    async isBookmarked(surah, ayah) {
      const { count } = await sb
        .from('bookmarks')
        .select('id', { count: 'exact', head: true })
        .eq('surah', surah)
        .eq('ayah', ayah);
      return (count ?? 0) > 0;
    },
    async listCollections() {
      const { data } = await sb
        .from('collections')
        .select('id, name, description, created_at')
        .order('created_at', { ascending: false });
      return ((data ?? []) as CollectionRow[]).map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? undefined,
        createdAt: r.created_at,
      }));
    },
    async createCollection(name, description) {
      const { data, error } = await sb
        .from('collections')
        .insert({ user_id: userId, name, description: description ?? null })
        .select()
        .single();
      if (error || !data) throw error ?? new Error('Failed to create collection');
      const d = data as CollectionRow;
      return { id: d.id, name: d.name, description: d.description ?? undefined, createdAt: d.created_at };
    },
    async deleteCollection(id) {
      await sb.from('collections').delete().eq('id', id);
    },
    async listNotes() {
      const { data } = await sb
        .from('notes')
        .select('id, surah, ayah, verse_key, text, tags, created_at, updated_at')
        .order('updated_at', { ascending: false });
      return ((data ?? []) as NoteRow[]).map((r) => ({
        id: r.id,
        surah: r.surah,
        ayah: r.ayah,
        verseKey: r.verse_key,
        text: r.text,
        tags: r.tags ?? undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    },
    async searchNotes(q) {
      const term = q.trim();
      if (!term) return this.listNotes();
      const { data } = await sb
        .from('notes')
        .select('id, surah, ayah, verse_key, text, tags, created_at, updated_at')
        .or(`text.ilike.%${term}%,verse_key.ilike.%${term}%`)
        .order('updated_at', { ascending: false });
      return ((data ?? []) as NoteRow[]).map((r) => ({
        id: r.id,
        surah: r.surah,
        ayah: r.ayah,
        verseKey: r.verse_key,
        text: r.text,
        tags: r.tags ?? undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    },
    async getNoteForAyah(surah, ayah) {
      const { data } = await sb
        .from('notes')
        .select('id, surah, ayah, verse_key, text, tags, created_at, updated_at')
        .eq('surah', surah)
        .eq('ayah', ayah)
        .maybeSingle();
      if (!data) return undefined;
      const r = data as NoteRow;
      return {
        id: r.id,
        surah: r.surah,
        ayah: r.ayah,
        verseKey: r.verse_key,
        text: r.text,
        tags: r.tags ?? undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    },
    async upsertNote(surah, ayah, text, tags) {
      const { data, error } = await sb
        .from('notes')
        .upsert(
          {
            user_id: userId,
            surah,
            ayah,
            verse_key: `${surah}:${ayah}`,
            text: text.slice(0, 4000),
            tags: tags ?? [],
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,surah,ayah' },
        )
        .select()
        .single();
      if (error || !data) throw error ?? new Error('Failed to save note');
      const r = data as NoteRow;
      return {
        id: r.id,
        surah: r.surah,
        ayah: r.ayah,
        verseKey: r.verse_key,
        text: r.text,
        tags: r.tags ?? undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    },
    async deleteNote(id) {
      await sb.from('notes').delete().eq('id', id);
    },
    async loadSettings() {
      const { data } = await sb
        .from('user_settings')
        .select('settings')
        .eq('user_id', userId)
        .maybeSingle();
      if (!data?.settings) return DEFAULT_SETTINGS;
      // Merge with defaults to tolerate older / partial saved settings.
      return { ...DEFAULT_SETTINGS, ...(data.settings as Partial<AppSettings>) };
    },
    async saveSettings(next) {
      await sb
        .from('user_settings')
        .upsert(
          { user_id: userId, settings: next, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        );
    },
    async recordRead(surah, ayah) {
      const local = localRecordRead(surah, ayah);
      if (!local) return null;
      await sb.from('reading_progress').upsert(
        {
          user_id: userId,
          surah,
          ayah,
          verse_key: `${surah}:${ayah}`,
          percent: local.percent,
          last_read_at: local.lastReadAt,
        },
        { onConflict: 'user_id' },
      );
      const today = new Date().toISOString().slice(0, 10);
      await sb.rpc('noop' as never).catch(() => {}); // no-op placeholder
      await sb.from('reading_activity').upsert(
        { user_id: userId, occurred_on: today, ayahs_read: 1 },
        { onConflict: 'user_id,occurred_on', ignoreDuplicates: false },
      );
      return local;
    },
    async getLastRead() {
      // Local copy keeps the surah-meta join cheap; refresh from Supabase on
      // boot would be nicer but isn't required for go-live.
      return localGetLastRead();
    },
    async getReadingHistory() {
      return localGetReadingHistory();
    },
    async getDailyProgress() {
      const { data } = await sb
        .from('reading_activity')
        .select('occurred_on, ayahs_read, pages_read, minutes_read')
        .order('occurred_on', { ascending: false })
        .limit(365);
      return ((data ?? []) as DailyRow[]).map((r) => ({
        date: r.occurred_on,
        ayahsRead: r.ayahs_read,
        pagesRead: r.pages_read,
        minutesRead: r.minutes_read,
      }));
    },
    async getStreak() {
      const days = await this.getDailyProgress();
      if (days.length === 0) return 0;
      const sorted = [...days].sort((a, b) => (a.date < b.date ? 1 : -1));
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
    },
    async getReadingGoal() {
      const { data } = await sb
        .from('reading_goals')
        .select('goal_type, target, started_at')
        .eq('user_id', userId)
        .maybeSingle();
      if (!data) return null;
      const r = data as GoalRow;
      return {
        type: r.goal_type as ReadingGoal['type'],
        target: r.target,
        startedAt: r.started_at,
      };
    },
    async setReadingGoal(goal) {
      await sb.from('reading_goals').upsert(
        { user_id: userId, goal_type: goal.type, target: goal.target, started_at: goal.startedAt },
        { onConflict: 'user_id' },
      );
    },
    async listMemorization() {
      const { data } = await sb
        .from('memorization_items')
        .select('surah, ayah, verse_key, mastery, review_count, next_review_at, added_at')
        .order('next_review_at', { ascending: true });
      return ((data ?? []) as MemRow[]).map((r) => ({
        surah: r.surah,
        ayah: r.ayah,
        verseKey: r.verse_key,
        mastery: Number(r.mastery),
        reviewCount: r.review_count,
        nextReviewAt: r.next_review_at,
        addedAt: r.added_at,
      }));
    },
    async getDueReviews() {
      const { data } = await sb
        .from('memorization_items')
        .select('surah, ayah, verse_key, mastery, review_count, next_review_at, added_at')
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true });
      return ((data ?? []) as MemRow[]).map((r) => ({
        surah: r.surah,
        ayah: r.ayah,
        verseKey: r.verse_key,
        mastery: Number(r.mastery),
        reviewCount: r.review_count,
        nextReviewAt: r.next_review_at,
        addedAt: r.added_at,
      }));
    },
    async isMemorized(surah, ayah) {
      const { count } = await sb
        .from('memorization_items')
        .select('id', { count: 'exact', head: true })
        .eq('surah', surah)
        .eq('ayah', ayah);
      return (count ?? 0) > 0;
    },
    async addToMemorization(surah, ayah) {
      const now = new Date();
      const next = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const { data, error } = await sb
        .from('memorization_items')
        .upsert(
          {
            user_id: userId,
            surah,
            ayah,
            verse_key: `${surah}:${ayah}`,
            mastery: 0,
            review_count: 0,
            next_review_at: next.toISOString(),
            added_at: now.toISOString(),
          },
          { onConflict: 'user_id,surah,ayah' },
        )
        .select()
        .single();
      if (error || !data) throw error ?? new Error('Failed to add to memorization');
      const r = data as MemRow;
      return {
        surah: r.surah,
        ayah: r.ayah,
        verseKey: r.verse_key,
        mastery: Number(r.mastery),
        reviewCount: r.review_count,
        nextReviewAt: r.next_review_at,
        addedAt: r.added_at,
      };
    },
    async removeFromMemorization(surah, ayah) {
      await sb.from('memorization_items').delete().eq('surah', surah).eq('ayah', ayah);
    },
    async recordReview(surah, ayah, mastery) {
      const baseDays = mastery >= 0.9 ? 7 : mastery >= 0.6 ? 3 : 1;
      const next = new Date(Date.now() + baseDays * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await sb
        .from('memorization_items')
        .select('review_count')
        .eq('surah', surah)
        .eq('ayah', ayah)
        .maybeSingle();
      const rc = ((data as { review_count?: number } | null)?.review_count ?? 0) + 1;
      await sb
        .from('memorization_items')
        .update({ mastery, review_count: rc, next_review_at: next })
        .eq('surah', surah)
        .eq('ayah', ayah);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Selection
// ─────────────────────────────────────────────────────────────────────────────

let cachedSupabase: { userId: string; provider: UserFeatureProvider } | null = null;

export async function getUserFeatureProvider(): Promise<UserFeatureProvider> {
  const sb = getSupabaseBrowser();
  if (!sb) return localProvider;
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) return localProvider;
  if (cachedSupabase && cachedSupabase.userId === user.id) return cachedSupabase.provider;
  const provider = makeSupabaseProvider(user.id);
  cachedSupabase = { userId: user.id, provider };
  return provider;
}

export function getLocalProvider(): UserFeatureProvider {
  return localProvider;
}
