'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAudioPlayer } from '@/components/audio/AudioPlayerProvider';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RECITERS as FALLBACK_RECITERS } from '@/lib/data/home';
import type { Reciter } from '@/lib/types/audio';

/** Decorative geometric reciter avatar — never a photo of a real person. */
function ReciterMark({ name, seed }: { name: string; seed: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const rotate = (seed * 41) % 360;
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold-500/30 bg-ink-900">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'conic-gradient(from var(--r), rgba(212,165,116,0.35), rgba(212,165,116,0.05), rgba(212,165,116,0.35))',
          // @ts-expect-error CSS var
          '--r': `${rotate}deg`,
        }}
        aria-hidden="true"
      />
      <span className="relative font-display text-sm font-semibold text-gold-200">{initials}</span>
    </div>
  );
}

export function FeaturedRecitations() {
  const { now, isPlaying, setReciter, playSurah, toggle } = useAudioPlayer();
  const [reciters, setReciters] = useState<Reciter[]>([]);

  // Load real reciters from the API (falls back to the static featured list).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/quran/recitations');
        if (res.ok) {
          const json = (await res.json()) as { data?: Reciter[] };
          if (!cancelled && json.data?.length) setReciters(json.data.slice(0, 6));
        }
      } catch {
        /* fall back */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = reciters.length
    ? reciters
    : (FALLBACK_RECITERS.slice(0, 6) as unknown as Reciter[]);

  const playFatiha = (r: Reciter) => {
    const playingThis = now?.surah === 1 && now?.reciterId === String(r.id);
    if (playingThis) {
      toggle();
      return;
    }
    setReciter(String(r.id), r.name);
    playSurah(1, `Surah Al-Fatihah · ${r.name}`);
  };

  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Audio"
        title="Featured Recitations"
        description="Tap a reciter to listen to Surah Al-Fatihah, streamed from a verified source."
        action={{ label: 'All reciters', href: '/reciters' }}
      />

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r, i) => {
          const playingThis = now?.surah === 1 && now?.reciterId === String(r.id);
          return (
            <Card key={String(r.id)} as="li" variant="elevated" className="flex items-center gap-4 p-4">
              <ReciterMark name={r.name} seed={i + 1} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-cream-50">{r.name}</h3>
                <p className="mt-0.5 truncate text-xs text-cream-200/60">
                  {r.style || 'Murattal'}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => playFatiha(r)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/15 text-gold-300 transition-colors hover:bg-gold-500/30"
                    aria-label={`Play Surah Al-Fatihah by ${r.name}`}
                  >
                    <Icon name={playingThis && isPlaying ? 'pause' : 'play'} size={15} />
                  </button>
                  <Link
                    href={`/reciters/${r.id}`}
                    className="text-xs font-medium text-gold-300/90 hover:text-gold-200"
                  >
                    View recitations
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </ul>
    </section>
  );
}
