'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  getDueReviews,
  recordReview,
} from '@/lib/services/memorizationService';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import { loadSettings } from '@/lib/services/settingsService';
import type { MemorizationEntry } from '@/lib/types/user';
import type { Ayah } from '@/lib/types/quran';

interface QueueItem extends MemorizationEntry {
  arabic?: string;
}

export default function ReviewPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [hideTranslation, setHideTranslation] = useState(true);

  useEffect(() => {
    const s = loadSettings();
    setHideTranslation(s.memorization.hideTranslationDuringReview);
    const due = getDueReviews();
    setQueue(due);
    // Lazy-fetch arabic text per item.
    (async () => {
      const enriched = await Promise.all(
        due.map(async (e) => {
          try {
            const res = await fetch(`/api/quran/ayah/${e.surah}/${e.ayah}`);
            if (!res.ok) return e as QueueItem;
            const json = (await res.json()) as { data?: Ayah };
            return { ...e, arabic: json.data?.arabic } as QueueItem;
          } catch {
            return e as QueueItem;
          }
        }),
      );
      setQueue(enriched);
    })();
  }, []);

  const current = queue[idx];

  const rate = (m: number) => {
    if (!current) return;
    recordReview(current.surah, current.ayah, m);
    setIdx((i) => i + 1);
  };

  if (queue.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Hifz" title="Review" description="Verses due today." />
        <AppShell>
          <EmptyState
            icon="check"
            title="Nothing due right now"
            description="You’re caught up on memorization review. Add more verses from any ayah."
            action={
              <Button href="/memorization" size="md" variant="secondary">
                Memorization home
              </Button>
            }
          />
        </AppShell>
      </>
    );
  }

  if (idx >= queue.length) {
    return (
      <>
        <PageHeader eyebrow="Hifz" title="Review complete" />
        <AppShell>
          <EmptyState
            icon="check"
            title="Review session complete"
            description={`You reviewed ${queue.length} verses. Next reviews are scheduled.`}
            action={
              <Button href="/memorization" size="md">
                Back to memorization
              </Button>
            }
          />
        </AppShell>
      </>
    );
  }

  if (!current) return null;
  const meta = getSurahByNumber(current.surah);

  return (
    <>
      <PageHeader
        eyebrow="Review"
        title={`${idx + 1} / ${queue.length}`}
        description={`${meta?.transliteration} · Ayah ${current.ayah}`}
      />
      <AppShell>
        <Card variant="feature" className="overflow-hidden">
          <div className="relative p-6 md:p-10">
            <div className="absolute inset-0 pattern-ornament opacity-30" aria-hidden="true" />
            <p className="relative text-xs uppercase tracking-wider text-gold-400/80">
              {current.verseKey}
            </p>
            {current.arabic ? (
              <p
                className="arabic relative mt-6 text-right text-3xl leading-[2.1] text-cream-50 sm:text-4xl"
                dir="rtl"
                lang="ar"
              >
                {current.arabic}
              </p>
            ) : (
              <p className="relative mt-6 text-sm text-cream-200/65">
                Loading verse text from verified source…
              </p>
            )}
            {!hideTranslation && (
              <p className="relative mt-4 text-sm text-cream-200/70">
                Translation hidden during review. Toggle in settings.
              </p>
            )}
          </div>
        </Card>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button size="md" variant="ghost" onClick={() => rate(0.3)}>
            <Icon name="close" size={14} />
            Needs work
          </Button>
          <Button size="md" variant="outline" onClick={() => rate(0.65)}>
            Okay
          </Button>
          <Button size="md" onClick={() => rate(0.95)}>
            <Icon name="check" size={14} />
            Solid
          </Button>
        </div>
      </AppShell>
    </>
  );
}
