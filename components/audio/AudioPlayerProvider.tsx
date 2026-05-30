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

interface NowPlaying {
  reciterId: string;
  reciterName?: string;
  surah: number;
  /** When undefined, full surah is playing */
  ayah?: number;
  surahLabel: string;
}

interface AudioPlayerContextValue {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  now: NowPlaying | null;
  reciterId: string;
  setReciter: (id: string, name?: string) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (s: number) => void;
  repeatMode: RepeatMode;
  setRepeatMode: (m: RepeatMode) => void;
  /** Play surah-level audio */
  playSurah: (surah: number, surahLabel: string, ayah?: number) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

const AUDIO_CDN = (reciterId: string, surah: number, bitrate = 128) =>
  `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${encodeURIComponent(reciterId)}/${surah}.mp3`;

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

  // Hydrate from saved settings.
  useEffect(() => {
    const s = loadSettings();
    setReciterIdState(s.audio.defaultReciterId);
    setPlaybackSpeedState(s.audio.playbackSpeed);
    setRepeatModeState(s.audio.repeatMode);
  }, []);

  // Wire the audio element.
  useEffect(() => {
    if (audioRef.current) return;
    if (typeof window === 'undefined') return;
    const el = new Audio();
    el.preload = 'metadata';
    audioRef.current = el;
    const onTime = () => setCurrentTime(el.currentTime);
    const onLoadedMeta = () => setDuration(el.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWait = () => setIsLoading(true);
    const onCan = () => setIsLoading(false);
    const onEnded = () => setIsPlaying(false);
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

  const playSurah = useCallback(
    (surah: number, surahLabel: string, ayah?: number) => {
      const el = audioRef.current;
      if (!el) return;
      const url = AUDIO_CDN(reciterId, surah);
      // Surah-level audio: jumping to a specific ayah requires verified
      // timestamp data we do not synthesize. We just start from 0.
      el.src = url;
      el.currentTime = 0;
      setIsLoading(true);
      el.play().catch(() => setIsLoading(false));
      setNow({ reciterId, surah, ayah, surahLabel });
    },
    [reciterId],
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

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      isPlaying,
      isLoading,
      currentTime,
      duration,
      now,
      reciterId,
      setReciter,
      playbackSpeed,
      setPlaybackSpeed,
      repeatMode,
      setRepeatMode,
      playSurah,
      pause,
      resume,
      toggle,
      seek,
    }),
    [
      isPlaying,
      isLoading,
      currentTime,
      duration,
      now,
      reciterId,
      playbackSpeed,
      repeatMode,
      setReciter,
      setPlaybackSpeed,
      setRepeatMode,
      playSurah,
      pause,
      resume,
      toggle,
      seek,
    ],
  );

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used inside AudioPlayerProvider');
  return ctx;
}
