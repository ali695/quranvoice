'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { RepeatMode } from '@/lib/types/audio';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import { getSurahByNumber } from '@/lib/data/surahs';
import { activeWordPosition, type Segment } from '@/lib/audio/audio-timing';

type PlayMode = 'ayah' | 'surah' | 'range';

interface NowPlaying {
  reciterId: string;
  reciterName?: string;
  surah: number;
  /** When undefined, a full surah file is playing without ayah sync. */
  ayah?: number;
  /** "2:255" when an ayah is active. */
  verseKey?: string;
  surahLabel: string;
}

interface QueueItem {
  surah: number;
  ayah: number;
  verseKey: string;
  label: string;
}

interface AudioPlayerContextValue {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  now: NowPlaying | null;
  /** Active verse key like "2:255", or null when surah-level / idle. */
  currentVerseKey: string | null;
  mode: PlayMode;
  queue: QueueItem[];
  /** True when the active ayah is known exactly (per-ayah file or synced surah). */
  exactTimingAvailable: boolean;
  /** True when real word-level segment timing is driving the highlight. */
  exactWordTimingAvailable: boolean;
  /** Active word position (1-based) within the current ayah, or null. */
  currentWordIndex: number | null;
  /** True when a full-surah file with real ayah+word timestamps is playing. */
  syncedSurah: boolean;
  /** Auto-scroll the reader to the reciting ayah. Turns off when the reader scrolls. */
  followAlong: boolean;
  setFollowAlong: (v: boolean) => void;
  /** Transient user-facing message (e.g. exact timing unavailable). */
  notice: string | null;
  reciterId: string;
  setReciter: (id: string, name?: string) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (s: number) => void;
  repeatMode: RepeatMode;
  setRepeatMode: (m: RepeatMode) => void;
  autoPlayNextAyah: boolean;
  setAutoPlayNextAyah: (v: boolean) => void;
  /** Play one exact ayah (the clicked ayah). */
  playAyah: (surah: number, ayah: number, surahLabel: string, reciterName?: string) => void;
  /** Play from a given ayah to the end of the surah. */
  playFromHere: (surah: number, startAyah: number, surahLabel: string) => void;
  /** Play the surah (optionally from an ayah), synced when timing exists. */
  playSurah: (surah: number, surahLabel: string, ayah?: number) => void;
  /** Jump the recitation to a word of the active synced ayah. */
  seekToWord: (verseKey: string, wordPosition: number) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  next: () => void;
  previous: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

// ─── Server lookups ───────────────────────────────────────────────────────

async function resolveAyahAudio(reciterId: string, verseKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      `/api/quran/audio/${encodeURIComponent(reciterId)}/verse/${encodeURIComponent(verseKey)}`,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { url?: string } };
    return json.data?.url ?? null;
  } catch {
    return null;
  }
}

interface AyahTiming {
  url: string;
  segments: Segment[];
}

/** Per-ayah audio URL + word-level segment timing (verse-recitation reciters). */
async function resolveAyahTiming(reciterId: string, verseKey: string): Promise<AyahTiming | null> {
  try {
    const res = await fetch(
      `/api/quran/audio/${encodeURIComponent(reciterId)}/timing/${encodeURIComponent(verseKey)}`,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { url?: string; segments?: Segment[] } };
    if (!json.data?.url) return null;
    return { url: json.data.url, segments: json.data.segments ?? [] };
  } catch {
    return null;
  }
}

async function resolveSurahAudio(reciterId: string, surah: number): Promise<string | null> {
  try {
    const res = await fetch(`/api/quran/audio/${encodeURIComponent(reciterId)}/chapter/${surah}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { url?: string } };
    return json.data?.url ?? null;
  } catch {
    return null;
  }
}

/** One ayah inside a synced surah file. `segs` use the shared Segment shape. */
interface SyncedAyah {
  ayah: number;
  from: number;
  to: number;
  segs: Segment[];
}

interface SyncedSurah {
  key: string;
  reciterId: string;
  surah: number;
  url: string;
  ayahs: SyncedAyah[];
}

const syncedCache = new Map<string, Promise<SyncedSurah | null>>();

/** Full-surah file + real ayah/word timestamps. Cached per reciter+surah. */
function resolveSyncedSurah(reciterId: string, surah: number): Promise<SyncedSurah | null> {
  const key = `${reciterId}|${surah}`;
  const hit = syncedCache.get(key);
  if (hit) return hit;
  const p = (async () => {
    try {
      const res = await fetch(
        `/api/quran/audio/${encodeURIComponent(reciterId)}/surah-timing/${surah}`,
      );
      if (!res.ok) return null;
      const json = (await res.json()) as {
        data?: { url?: string; ayahs?: Array<{ ayah: number; from: number; to: number; words: [number, number, number][] }> };
      };
      const d = json.data;
      if (!d?.url || !d.ayahs?.length) return null;
      return {
        key,
        reciterId,
        surah,
        url: d.url,
        ayahs: d.ayahs.map((a) => ({
          ayah: a.ayah,
          from: a.from,
          to: a.to,
          segs: a.words.map(([pos, start, end], i) => [i, pos, start, end] as Segment),
        })),
      };
    } catch {
      return null;
    }
  })();
  syncedCache.set(key, p);
  // Don't cache failures forever (network blips).
  void p.then((v) => {
    if (!v) syncedCache.delete(key);
  });
  return p;
}

/** Index of the ayah playing at `ms` (last ayah whose start ≤ ms). */
function ayahIndexAt(ayahs: SyncedAyah[], ms: number): number {
  let lo = 0;
  let hi = ayahs.length - 1;
  let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (ayahs[mid].from <= ms) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

let reciterNamesPromise: Promise<Record<string, string>> | null = null;

/** Display names for synced reciters (id → name), fetched once. */
function loadReciterNames(): Promise<Record<string, string>> {
  reciterNamesPromise ??= fetch('/api/quran/timed-reciters')
    .then((r) => (r.ok ? r.json() : { data: [] }))
    .then((j: { data?: Array<{ id: string; name: string }> }) =>
      Object.fromEntries((j.data ?? []).map((x) => [x.id, x.name])),
    )
    .catch(() => {
      reciterNamesPromise = null;
      return {};
    });
  return reciterNamesPromise;
}

const LEGACY_RECITER_IDS: Record<string, string> = {
  'ar.alafasy': '7',
  'ar.husary': '6',
  'ar.sudais': '3',
  'ar.abdurrahmaansudais': '3',
  'ar.shaatree': '4',
  'ar.minshawi': '9',
  'ar.abdulbasitmurattal': '2',
};

// ─── Provider ─────────────────────────────────────────────────────────────

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [now, setNow] = useState<NowPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [reciterId, setReciterIdState] = useState('7');
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>('off');
  const [autoPlayNextAyah, setAutoPlayNextAyahState] = useState(true);
  const [mode, setMode] = useState<PlayMode>('ayah');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [exactTimingAvailable, setExactTimingAvailable] = useState(false);
  const [exactWordTimingAvailable, setExactWordTimingAvailable] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [syncedSurah, setSyncedSurah] = useState(false);
  const [followAlong, setFollowAlongState] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  // Word-level segments for the active ayah (empty = ayah-level only).
  const segmentsRef = useRef<Segment[]>([]);
  // Synced full-surah session (null = per-ayah or plain surah playback).
  const syncRef = useRef<SyncedSurah | null>(null);
  const activeIdxRef = useRef(-1);
  /** Synced: pause when playback reaches this ms (single ayah, no auto-next). */
  const stopAtRef = useRef<number | null>(null);
  /** Synced: where "repeat range/surah" restarts (ms). */
  const loopStartRef = useRef(0);
  /** Seek to apply once the new file's metadata is loaded (seconds). */
  const pendingSeekRef = useRef<number | null>(null);
  const lastWordRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Latest-value refs so static listeners act on current state.
  const reciterIdRef = useRef(reciterId);
  const reciterNameRef = useRef<string | undefined>(undefined);
  const nowRef = useRef<NowPlaying | null>(now);
  const modeRef = useRef<PlayMode>(mode);
  const repeatRef = useRef<RepeatMode>(repeatMode);
  const autoNextRef = useRef(autoPlayNextAyah);
  const queueRef = useRef<QueueItem[]>(queue);
  const queueIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  reciterIdRef.current = reciterId;
  nowRef.current = now;
  modeRef.current = mode;
  repeatRef.current = repeatMode;
  autoNextRef.current = autoPlayNextAyah;
  queueRef.current = queue;
  isPlayingRef.current = isPlaying;

  // Hydrate from saved settings.
  useEffect(() => {
    const s = loadSettings();
    setReciterIdState(s.audio.defaultReciterId);
    setPlaybackSpeedState(s.audio.playbackSpeed);
    setRepeatModeState(s.audio.repeatMode);
    setAutoPlayNextAyahState(s.audio.autoPlayNextAyah);
  }, []);

  // Resolve the reciter's display name so the player never shows a bare ID.
  useEffect(() => {
    let cancelled = false;
    void loadReciterNames().then((names) => {
      if (cancelled) return;
      const name = names[reciterId] ?? names[LEGACY_RECITER_IDS[reciterId] ?? ''];
      if (!name) return;
      reciterNameRef.current = name;
      setNow((p) => (p && p.reciterId === reciterId && !p.reciterName ? { ...p, reciterName: name } : p));
    });
    return () => {
      cancelled = true;
    };
  }, [reciterId]);

  const setFollowAlong = useCallback((v: boolean) => setFollowAlongState(v), []);

  /** Play a URL from `startSec`, reusing the loaded file when it's the same. */
  const playFrom = useCallback((url: string, startSec = 0) => {
    const el = audioRef.current;
    if (!el) return;
    if (el.src !== url) {
      el.src = url;
      pendingSeekRef.current = startSec > 0 ? startSec : null;
      setIsLoading(true);
    } else if (el.readyState >= 1) {
      el.currentTime = startSec;
    } else {
      pendingSeekRef.current = startSec;
    }
    lastWordRef.current = null;
    el.play().catch(() => setIsLoading(false));
  }, []);

  const leaveSync = useCallback(() => {
    syncRef.current = null;
    activeIdxRef.current = -1;
    stopAtRef.current = null;
    setSyncedSurah(false);
  }, []);

  /**
   * Start synced playback of a surah at an ayah (or from the top).
   * Returns false when no complete timing exists for this reciter+surah.
   */
  const startSynced = useCallback(
    async (
      surah: number,
      surahLabel: string,
      opts: { ayah?: number; stopAtAyahEnd?: boolean; loopFromStart?: boolean },
    ): Promise<boolean> => {
      const rid = reciterIdRef.current;
      setIsLoading(true);
      const session = await resolveSyncedSurah(rid, surah);
      // Reciter changed while loading — let the newer call win.
      if (rid !== reciterIdRef.current) return true;
      if (!session) return false;
      const idx = opts.ayah ? Math.max(0, session.ayahs.findIndex((a) => a.ayah === opts.ayah)) : 0;
      const target = session.ayahs[idx];
      syncRef.current = session;
      activeIdxRef.current = idx;
      segmentsRef.current = target.segs;
      stopAtRef.current = opts.stopAtAyahEnd ? target.to : null;
      loopStartRef.current = opts.loopFromStart === false ? target.from : opts.ayah ? target.from : 0;
      setSyncedSurah(true);
      setExactTimingAvailable(true);
      setExactWordTimingAvailable(target.segs.length > 0);
      setCurrentWordIndex(null);
      setNotice(null);
      setNow({
        reciterId: rid,
        reciterName: reciterNameRef.current,
        surah,
        ayah: target.ayah,
        verseKey: `${surah}:${target.ayah}`,
        surahLabel,
      });
      setFollowAlongState(true);
      playFrom(session.url, opts.ayah ? target.from / 1000 : 0);
      return true;
    },
    [playFrom],
  );

  // Fallback: play an exact ayah from per-ayah files (reciters without sync).
  const startAyahFile = useCallback(
    async (surah: number, ayah: number, surahLabel: string, reciterName?: string) => {
      leaveSync();
      const rid = reciterIdRef.current;
      const verseKey = `${surah}:${ayah}`;
      setNotice(null);
      setNow({ reciterId: rid, reciterName: reciterName ?? reciterNameRef.current, surah, ayah, verseKey, surahLabel });
      setIsLoading(true);
      segmentsRef.current = [];
      setCurrentWordIndex(null);

      const timing = await resolveAyahTiming(rid, verseKey);
      if (timing) {
        segmentsRef.current = timing.segments;
        setExactTimingAvailable(true);
        setExactWordTimingAvailable(timing.segments.length > 0);
        playFrom(timing.url);
        return;
      }
      const url = await resolveAyahAudio(rid, verseKey);
      if (url) {
        setExactTimingAvailable(true);
        setExactWordTimingAvailable(false);
        playFrom(url);
        return;
      }
      // No exact ayah audio — never fake a seek over a surah file.
      setExactTimingAvailable(false);
      setExactWordTimingAvailable(false);
      setIsLoading(false);
      setIsPlaying(false);
      setNotice('Exact verse audio is not available for this reciter. Choose another reciter or play the full surah.');
    },
    [playFrom, leaveSync],
  );

  /** Play an ayah: synced surah file when possible, else per-ayah file. */
  const startAyah = useCallback(
    async (surah: number, ayah: number, surahLabel: string, reciterName?: string) => {
      if (reciterName) reciterNameRef.current = reciterName;
      const single = modeRef.current === 'ayah' && !autoNextRef.current && repeatRef.current !== 'ayah';
      // Already in this surah's synced file → instant jump, no reload.
      const s = syncRef.current;
      if (s && s.surah === surah && s.reciterId === reciterIdRef.current) {
        const idx = s.ayahs.findIndex((a) => a.ayah === ayah);
        if (idx >= 0) {
          const a = s.ayahs[idx];
          activeIdxRef.current = idx;
          segmentsRef.current = a.segs;
          stopAtRef.current = single ? a.to : null;
          loopStartRef.current = a.from;
          setNow((cur) => (cur ? { ...cur, ayah, verseKey: `${surah}:${ayah}`, surahLabel } : cur));
          setCurrentWordIndex(null);
          setFollowAlongState(true);
          playFrom(s.url, a.from / 1000);
          return;
        }
      }
      const ok = await startSynced(surah, surahLabel, { ayah, stopAtAyahEnd: single });
      if (!ok) await startAyahFile(surah, ayah, surahLabel, reciterName);
    },
    [playFrom, startSynced, startAyahFile],
  );

  // Advance after a per-ayah FILE ends (queue / auto-next / repeat).
  const advanceFile = useCallback(() => {
    const cur = nowRef.current;
    if (!cur || cur.ayah === undefined) return;
    if (repeatRef.current === 'ayah') {
      void startAyahFile(cur.surah, cur.ayah, cur.surahLabel, cur.reciterName);
      return;
    }
    const q = queueRef.current;
    if (modeRef.current === 'range' && q.length > 0) {
      const nextIndex = queueIndexRef.current + 1;
      if (nextIndex < q.length) {
        queueIndexRef.current = nextIndex;
        const item = q[nextIndex];
        void startAyahFile(item.surah, item.ayah, item.label, cur.reciterName);
        return;
      }
      if (repeatRef.current === 'range') {
        queueIndexRef.current = 0;
        const item = q[0];
        void startAyahFile(item.surah, item.ayah, item.label, cur.reciterName);
      }
      return;
    }
    if (modeRef.current === 'ayah' && autoNextRef.current) {
      const lastAyah = getSurahByNumber(cur.surah)?.ayahCount ?? cur.ayah;
      if (cur.ayah < lastAyah) void startAyahFile(cur.surah, cur.ayah + 1, cur.surahLabel, cur.reciterName);
    }
  }, [startAyahFile]);
  const advanceFileRef = useRef(advanceFile);
  advanceFileRef.current = advanceFile;

  /**
   * The pointer: runs every animation frame while playing (timeupdate alone
   * is ~4 Hz — too coarse for word highlighting). Handles synced ayah changes,
   * repeat-ayah loops and single-ayah stops.
   */
  const tick = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    const ms = el.currentTime * 1000;
    const s = syncRef.current;

    if (s && el.src === s.url) {
      const cur = s.ayahs[activeIdxRef.current];
      // Repeat the current ayah.
      if (repeatRef.current === 'ayah' && cur && ms >= cur.to) {
        el.currentTime = cur.from / 1000;
        lastWordRef.current = null;
        return;
      }
      // Single ayah, no auto-next: stop at its end.
      if (stopAtRef.current !== null && ms >= stopAtRef.current) {
        stopAtRef.current = null;
        el.pause();
        return;
      }
      const idx = ayahIndexAt(s.ayahs, ms);
      if (idx !== activeIdxRef.current) {
        activeIdxRef.current = idx;
        const a = s.ayahs[idx];
        segmentsRef.current = a.segs;
        lastWordRef.current = null;
        setExactWordTimingAvailable(a.segs.length > 0);
        setCurrentWordIndex(null);
        setNow((p) => (p ? { ...p, ayah: a.ayah, verseKey: `${s.surah}:${a.ayah}` } : p));
      }
    }

    const segs = segmentsRef.current;
    if (segs.length) {
      const w = activeWordPosition(segs, ms);
      if (w !== lastWordRef.current) {
        lastWordRef.current = w;
        setCurrentWordIndex(w);
      }
    }
  }, []);
  const tickRef = useRef(tick);
  tickRef.current = tick;

  // Wire the audio element once.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Reuse the element across re-mounts (React StrictMode mounts twice in
    // dev); listeners are attached on every mount and removed on cleanup.
    const el = audioRef.current ?? new Audio();
    el.preload = 'metadata';
    audioRef.current = el;

    const loop = () => {
      tickRef.current();
      rafRef.current = window.requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    const onTime = () => {
      setCurrentTime(el.currentTime);
      // Animation frames pause in background tabs / with the screen off;
      // timeupdate keeps the ayah pointer (and lock-screen title) moving.
      tickRef.current();
    };
    const onLoadedMeta = () => {
      setDuration(el.duration || 0);
      if (pendingSeekRef.current !== null) {
        el.currentTime = pendingSeekRef.current;
        pendingSeekRef.current = null;
      }
    };
    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      stopLoop();
      rafRef.current = window.requestAnimationFrame(loop);
    };
    const onPause = () => {
      setIsPlaying(false);
      stopLoop();
      tickRef.current();
    };
    const onWait = () => setIsLoading(true);
    const onCan = () => setIsLoading(false);
    const onSeeked = () => tickRef.current();
    const onEnded = () => {
      setIsPlaying(false);
      stopLoop();
      const s = syncRef.current;
      if (s && el.src === s.url) {
        const r = repeatRef.current;
        if (r === 'surah' || r === 'range') {
          el.currentTime = (r === 'range' ? loopStartRef.current : 0) / 1000;
          el.play().catch(() => {});
        }
        return;
      }
      advanceFileRef.current();
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onLoadedMeta);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('waiting', onWait);
    el.addEventListener('canplay', onCan);
    el.addEventListener('seeked', onSeeked);
    el.addEventListener('ended', onEnded);
    return () => {
      stopLoop();
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onLoadedMeta);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('waiting', onWait);
      el.removeEventListener('canplay', onCan);
      el.removeEventListener('seeked', onSeeked);
      el.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Follow-along turns off as soon as the reader scrolls on their own.
  useEffect(() => {
    if (!isPlaying || !followAlong) return;
    const off = () => setFollowAlongState(false);
    const onKey = (e: KeyboardEvent) => {
      if (['PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 'Home', 'End', ' '].includes(e.key)) {
        const t = e.target as HTMLElement | null;
        if (!t || !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) off();
      }
    };
    window.addEventListener('wheel', off, { passive: true });
    window.addEventListener('touchmove', off, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', off);
      window.removeEventListener('touchmove', off);
      window.removeEventListener('keydown', onKey);
    };
  }, [isPlaying, followAlong]);

  const setPlaybackSpeed = useCallback((s: number) => {
    setPlaybackSpeedState(s);
    updateSettings('audio', { playbackSpeed: s });
  }, []);

  const setRepeatMode = useCallback((m: RepeatMode) => {
    setRepeatModeState(m);
    repeatRef.current = m;
    updateSettings('audio', { repeatMode: m });
  }, []);

  const setAutoPlayNextAyah = useCallback((v: boolean) => {
    setAutoPlayNextAyahState(v);
    autoNextRef.current = v;
    if (v) stopAtRef.current = null;
    updateSettings('audio', { autoPlayNextAyah: v });
  }, []);

  const playAyah = useCallback(
    (surah: number, ayah: number, surahLabel: string, reciterName?: string) => {
      setMode('ayah');
      modeRef.current = 'ayah';
      setQueue([]);
      queueRef.current = [];
      queueIndexRef.current = 0;
      void startAyah(surah, ayah, surahLabel, reciterName);
    },
    [startAyah],
  );

  const playFromHere = useCallback(
    (surah: number, fromAyah: number, surahLabel: string) => {
      const last = getSurahByNumber(surah)?.ayahCount ?? fromAyah;
      const items: QueueItem[] = [];
      for (let a = fromAyah; a <= last; a++) items.push({ surah, ayah: a, verseKey: `${surah}:${a}`, label: surahLabel });
      setMode('range');
      modeRef.current = 'range';
      setQueue(items);
      queueRef.current = items;
      queueIndexRef.current = 0;
      void (async () => {
        const ok = await startSynced(surah, surahLabel, { ayah: fromAyah, loopFromStart: false });
        if (!ok) await startAyahFile(surah, fromAyah, surahLabel);
      })();
    },
    [startSynced, startAyahFile],
  );

  const playSurah = useCallback(
    (surah: number, surahLabel: string, ayah?: number) => {
      setMode('surah');
      modeRef.current = 'surah';
      setQueue([]);
      queueRef.current = [];
      setNotice(null);
      void (async () => {
        const ok = await startSynced(surah, surahLabel, { ayah });
        if (ok) return;
        // No timing for this reciter: plain surah file, honestly unsynced.
        leaveSync();
        segmentsRef.current = [];
        setExactTimingAvailable(false);
        setExactWordTimingAvailable(false);
        setCurrentWordIndex(null);
        setNow({ reciterId: reciterIdRef.current, reciterName: reciterNameRef.current, surah, ayah: undefined, verseKey: undefined, surahLabel });
        const url = await resolveSurahAudio(reciterIdRef.current, surah);
        if (url) {
          playFrom(url);
          setNotice('This reciter has no word timing, so the live pointer is off. Pick a synced reciter to follow along.');
        } else {
          setIsLoading(false);
          setNotice('Surah audio is not available for this reciter.');
        }
      })();
    },
    [startSynced, leaveSync, playFrom],
  );

  const setReciter = useCallback(
    (id: string, name?: string) => {
      reciterIdRef.current = id; // update immediately so a following play() uses it
      reciterNameRef.current = name;
      setReciterIdState(id);
      updateSettings('audio', { defaultReciterId: id });
      const cur = nowRef.current;
      setNow((p) => (p ? { ...p, reciterId: id, reciterName: name ?? p.reciterName } : p));
      // Switch voices in place: continue from the same ayah with the new reciter.
      if (cur && isPlayingRef.current) {
        if (modeRef.current === 'surah' || modeRef.current === 'range') {
          void (async () => {
            const ok = await startSynced(cur.surah, cur.surahLabel, {
              ayah: cur.ayah,
              loopFromStart: modeRef.current === 'surah',
            });
            if (!ok && cur.ayah) await startAyahFile(cur.surah, cur.ayah, cur.surahLabel, name);
          })();
        } else if (cur.ayah) {
          syncRef.current = null;
          void startAyah(cur.surah, cur.ayah, cur.surahLabel, name);
        }
      }
    },
    [startSynced, startAyahFile, startAyah],
  );

  const seekToWord = useCallback(
    (verseKey: string, wordPosition: number) => {
      const el = audioRef.current;
      const s = syncRef.current;
      if (!el) return;
      const segs = segmentsRef.current;
      const seg = segs.find((x) => x[1] === wordPosition);
      if (!seg || nowRef.current?.verseKey !== verseKey) return;
      el.currentTime = seg[2] / 1000;
      lastWordRef.current = null;
      if (s) stopAtRef.current = null;
      if (el.paused) el.play().catch(() => {});
    },
    [],
  );

  const pause = useCallback(() => audioRef.current?.pause(), []);
  const resume = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, []);
  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, []);
  const seek = useCallback((s: number) => {
    if (audioRef.current) audioRef.current.currentTime = s;
  }, []);

  const jumpSynced = useCallback((delta: number): boolean => {
    const s = syncRef.current;
    const el = audioRef.current;
    if (!s || !el || el.src !== s.url) return false;
    const idx = Math.min(s.ayahs.length - 1, Math.max(0, activeIdxRef.current + delta));
    stopAtRef.current = null;
    el.currentTime = s.ayahs[idx].from / 1000;
    setFollowAlongState(true);
    if (el.paused) el.play().catch(() => {});
    return true;
  }, []);

  const next = useCallback(() => {
    if (!jumpSynced(1)) advanceFileRef.current();
  }, [jumpSynced]);
  const previous = useCallback(() => {
    if (jumpSynced(-1)) return;
    const cur = nowRef.current;
    if (!cur || cur.ayah === undefined || cur.ayah <= 1) return;
    void startAyahFile(cur.surah, cur.ayah - 1, cur.surahLabel, cur.reciterName);
  }, [jumpSynced, startAyahFile]);

  // Lock-screen / headset controls (Media Session API).
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !now) return;
    const ms = navigator.mediaSession;
    try {
      ms.metadata = new MediaMetadata({
        title: now.ayah ? `${now.surahLabel} · Ayah ${now.ayah}` : now.surahLabel,
        artist: now.reciterName ?? 'QuranVoice',
        album: 'QuranVoice',
      });
      ms.setActionHandler('play', () => resume());
      ms.setActionHandler('pause', () => pause());
      ms.setActionHandler('nexttrack', () => next());
      ms.setActionHandler('previoustrack', () => previous());
      ms.setActionHandler('seekto', (d) => {
        if (typeof d.seekTime === 'number') seek(d.seekTime);
      });
    } catch {
      /* unsupported action on this browser */
    }
  }, [now, resume, pause, next, previous, seek]);

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      isPlaying,
      isLoading,
      currentTime,
      duration,
      now,
      currentVerseKey: now?.verseKey ?? null,
      mode,
      queue,
      exactTimingAvailable,
      exactWordTimingAvailable,
      currentWordIndex,
      syncedSurah,
      followAlong,
      setFollowAlong,
      notice,
      reciterId,
      setReciter,
      playbackSpeed,
      setPlaybackSpeed,
      repeatMode,
      setRepeatMode,
      autoPlayNextAyah,
      setAutoPlayNextAyah,
      playAyah,
      playFromHere,
      playSurah,
      seekToWord,
      pause,
      resume,
      toggle,
      seek,
      next,
      previous,
    }),
    [
      isPlaying,
      isLoading,
      currentTime,
      duration,
      now,
      mode,
      queue,
      exactTimingAvailable,
      exactWordTimingAvailable,
      currentWordIndex,
      syncedSurah,
      followAlong,
      setFollowAlong,
      notice,
      reciterId,
      setReciter,
      playbackSpeed,
      setPlaybackSpeed,
      repeatMode,
      setRepeatMode,
      autoPlayNextAyah,
      setAutoPlayNextAyah,
      playAyah,
      playFromHere,
      playSurah,
      seekToWord,
      pause,
      resume,
      toggle,
      seek,
      next,
      previous,
    ],
  );

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used inside AudioPlayerProvider');
  return ctx;
}
