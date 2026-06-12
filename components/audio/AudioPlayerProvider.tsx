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

type PlayMode = 'ayah' | 'surah' | 'range';

interface NowPlaying {
  reciterId: string;
  reciterName?: string;
  surah: number;
  /** When undefined, a full surah file is playing. */
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
  /** True when the active audio is exact per-ayah (not a seek over surah). */
  exactTimingAvailable: boolean;
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
  /** Start an ayah queue from a given ayah to the end of the surah. */
  playFromHere: (surah: number, startAyah: number, surahLabel: string) => void;
  /** Play surah-level audio from the start. */
  playSurah: (surah: number, surahLabel: string, ayah?: number) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  next: () => void;
  previous: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

interface ResolvedAyahAudio {
  url: string;
  exact: boolean;
}

/** Resolve exact per-ayah audio via the server route. Null when unavailable. */
async function resolveAyahAudio(
  reciterId: string,
  verseKey: string,
): Promise<ResolvedAyahAudio | null> {
  try {
    const res = await fetch(
      `/api/quran/audio/${encodeURIComponent(reciterId)}/verse/${encodeURIComponent(verseKey)}`,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { url?: string } };
    if (!json.data?.url) return null;
    return { url: json.data.url, exact: true };
  } catch {
    return null;
  }
}

async function resolveSurahAudio(reciterId: string, surah: number): Promise<string | null> {
  try {
    const res = await fetch(
      `/api/quran/audio/${encodeURIComponent(reciterId)}/chapter/${surah}`,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { url?: string } };
    return json.data?.url ?? null;
  } catch {
    return null;
  }
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [now, setNow] = useState<NowPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [reciterId, setReciterIdState] = useState('ar.alafasy');
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>('off');
  const [autoPlayNextAyah, setAutoPlayNextAyahState] = useState(true);
  const [mode, setMode] = useState<PlayMode>('ayah');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [exactTimingAvailable, setExactTimingAvailable] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Latest-value refs so the static "ended" listener can advance correctly.
  const reciterIdRef = useRef(reciterId);
  const nowRef = useRef<NowPlaying | null>(now);
  const modeRef = useRef<PlayMode>(mode);
  const repeatRef = useRef<RepeatMode>(repeatMode);
  const autoNextRef = useRef(autoPlayNextAyah);
  const queueRef = useRef<QueueItem[]>(queue);
  const queueIndexRef = useRef(0);
  reciterIdRef.current = reciterId;
  nowRef.current = now;
  modeRef.current = mode;
  repeatRef.current = repeatMode;
  autoNextRef.current = autoPlayNextAyah;
  queueRef.current = queue;

  // Hydrate from saved settings.
  useEffect(() => {
    const s = loadSettings();
    setReciterIdState(s.audio.defaultReciterId);
    setPlaybackSpeedState(s.audio.playbackSpeed);
    setRepeatModeState(s.audio.repeatMode);
    setAutoPlayNextAyahState(s.audio.autoPlayNextAyah);
  }, []);

  const playUrl = useCallback((url: string) => {
    const el = audioRef.current;
    if (!el) return;
    el.src = url;
    el.currentTime = 0;
    setIsLoading(true);
    el.play().catch(() => setIsLoading(false));
  }, []);

  // Core: play an exact ayah, set the clicked ayah as active immediately.
  const startAyah = useCallback(
    async (surah: number, ayah: number, surahLabel: string, reciterName?: string) => {
      const rid = reciterIdRef.current;
      const verseKey = `${surah}:${ayah}`;
      setNotice(null);
      setNow({ reciterId: rid, reciterName, surah, ayah, verseKey, surahLabel });
      setIsLoading(true);
      const resolved = await resolveAyahAudio(rid, verseKey);
      if (resolved) {
        setExactTimingAvailable(true);
        playUrl(resolved.url);
      } else {
        // No exact ayah audio — never fake a seek over a surah file.
        setExactTimingAvailable(false);
        setIsLoading(false);
        setIsPlaying(false);
        setNotice(
          'Exact verse audio is not available for this reciter. Choose another reciter or play the full surah.',
        );
      }
    },
    [playUrl],
  );

  // Advance after an ayah ends (queue / auto-play-next / repeat).
  const advance = useCallback(() => {
    const cur = nowRef.current;
    if (!cur || cur.ayah === undefined) return;

    if (repeatRef.current === 'ayah') {
      void startAyah(cur.surah, cur.ayah, cur.surahLabel, cur.reciterName);
      return;
    }

    const q = queueRef.current;
    if (modeRef.current === 'range' && q.length > 0) {
      const nextIndex = queueIndexRef.current + 1;
      if (nextIndex < q.length) {
        queueIndexRef.current = nextIndex;
        const item = q[nextIndex];
        void startAyah(item.surah, item.ayah, item.label, cur.reciterName);
        return;
      }
      if (repeatRef.current === 'range') {
        queueIndexRef.current = 0;
        const item = q[0];
        void startAyah(item.surah, item.ayah, item.label, cur.reciterName);
        return;
      }
      return; // queue finished
    }

    // Single-ayah mode: continue to next ayah only when enabled.
    if (modeRef.current === 'ayah' && autoNextRef.current) {
      const meta = getSurahByNumber(cur.surah);
      const lastAyah = meta?.ayahCount ?? cur.ayah;
      if (cur.ayah < lastAyah) {
        void startAyah(cur.surah, cur.ayah + 1, cur.surahLabel, cur.reciterName);
      }
    }
  }, [startAyah]);

  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  // Wire the audio element once.
  useEffect(() => {
    if (audioRef.current) return;
    if (typeof window === 'undefined') return;
    const el = new Audio();
    el.preload = 'metadata';
    audioRef.current = el;
    const onTime = () => setCurrentTime(el.currentTime);
    const onLoadedMeta = () => setDuration(el.duration || 0);
    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const onPause = () => setIsPlaying(false);
    const onWait = () => setIsLoading(true);
    const onCan = () => setIsLoading(false);
    const onEnded = () => {
      setIsPlaying(false);
      advanceRef.current();
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onLoadedMeta);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('waiting', onWait);
    el.addEventListener('canplay', onCan);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onLoadedMeta);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('waiting', onWait);
      el.removeEventListener('canplay', onCan);
      el.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const setReciter = useCallback((id: string, name?: string) => {
    setReciterIdState(id);
    updateSettings('audio', { defaultReciterId: id });
    setNow((cur) => (cur ? { ...cur, reciterId: id, reciterName: name ?? cur.reciterName } : cur));
  }, []);

  const setPlaybackSpeed = useCallback((s: number) => {
    setPlaybackSpeedState(s);
    updateSettings('audio', { playbackSpeed: s });
  }, []);

  const setRepeatMode = useCallback((m: RepeatMode) => {
    setRepeatModeState(m);
    updateSettings('audio', { repeatMode: m });
  }, []);

  const setAutoPlayNextAyah = useCallback((v: boolean) => {
    setAutoPlayNextAyahState(v);
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
      const meta = getSurahByNumber(surah);
      const last = meta?.ayahCount ?? fromAyah;
      const items: QueueItem[] = [];
      for (let a = fromAyah; a <= last; a++) {
        items.push({ surah, ayah: a, verseKey: `${surah}:${a}`, label: surahLabel });
      }
      setMode('range');
      modeRef.current = 'range';
      setQueue(items);
      queueRef.current = items;
      queueIndexRef.current = 0;
      void startAyah(surah, fromAyah, surahLabel);
    },
    [startAyah],
  );

  const playSurah = useCallback(
    (surah: number, surahLabel: string) => {
      setMode('surah');
      modeRef.current = 'surah';
      setQueue([]);
      queueRef.current = [];
      setNotice(null);
      setExactTimingAvailable(false);
      setNow({ reciterId: reciterIdRef.current, surah, ayah: undefined, verseKey: undefined, surahLabel });
      setIsLoading(true);
      void resolveSurahAudio(reciterIdRef.current, surah).then((url) => {
        if (url) playUrl(url);
        else {
          setIsLoading(false);
          setNotice('Surah audio is not available for this reciter.');
        }
      });
    },
    [playUrl],
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
  const next = useCallback(() => advanceRef.current(), []);
  const previous = useCallback(() => {
    const cur = nowRef.current;
    if (!cur || cur.ayah === undefined || cur.ayah <= 1) return;
    void startAyah(cur.surah, cur.ayah - 1, cur.surahLabel, cur.reciterName);
  }, [startAyah]);

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
