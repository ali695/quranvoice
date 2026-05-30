export interface Bookmark {
  id: string;
  surah: number;
  ayah: number;
  verseKey: string;
  collectionId?: string;
  tags?: string[];
  note?: string;
  createdAt: string;
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface AyahNote {
  id: string;
  surah: number;
  ayah: number;
  verseKey: string;
  text: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReadingGoal {
  /** "pages-per-day" | "ayahs-per-day" | "minutes-per-day" */
  type: 'pages' | 'ayahs' | 'minutes';
  target: number;
  startedAt: string;
}

export interface ReadingHistoryEntry {
  surah: number;
  ayah: number;
  verseKey: string;
  pagesRead?: number;
  durationMs?: number;
  at: string;
}

export interface DailyProgress {
  /** YYYY-MM-DD */
  date: string;
  pagesRead: number;
  ayahsRead: number;
  minutesRead: number;
}

export interface MemorizationEntry {
  surah: number;
  ayah: number;
  verseKey: string;
  /** Recent self-rated mastery 0-1 */
  mastery: number;
  /** Next review due date (ISO) */
  nextReviewAt: string;
  /** Number of times reviewed */
  reviewCount: number;
  addedAt: string;
}

export interface UserProfile {
  id?: string;
  email?: string;
  displayName?: string;
  isSignedIn: boolean;
}
