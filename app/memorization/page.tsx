'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  getDueReviews,
  listMemorization,
  removeFromMemorization,
} from '@/lib/services/memorizationService';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import type { MemorizationEntry } from '@/lib/types/user';

export default function MemorizationIndex() {
  const [items, setItems] = useState<MemorizationEntry[]>([]);
  const [due, setDue] = useState<MemorizationEntry[]>([]);

  useEffect(() => {
    setItems(listMemorization());
    setDue(getDueReviews());
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Hifz"
        title="Memorization"
        description="Track verses you’re memorizing and review them on schedule."
        actions={
          due.length > 0 && (
            <Button href="/memorization/review">
              <Icon name="brain" size={14} />
              Review {due.length} due
            </Button>
          )
        }
      />
      <AppShell>
        {items.length === 0 ? (
          <EmptyState
            icon="brain"
            title="No verses tracked yet"
            description="Open any ayah and tap “Add to Hifz” to start tracking it for review."
            action={
              <Button href="/quran" size="md">
                Read Quran
              </Button>
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((e) => {
              const meta = getSurahByNumber(e.surah);
              const isDue = Date.parse(e.nextReviewAt) <= Date.now();
              return (
                <Card key={e.verseKey} as="li" variant="elevated" className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-cream-200/45">
                        {meta?.transliteration} · Ayah {e.ayah}
                      </p>
                      <p className="mt-1 text-sm font-medium text-cream-50">{e.verseKey}</p>
                      <p className="mt-1 text-xs text-cream-200/55">
                        Reviews: {e.reviewCount} · Mastery {(e.mastery * 100).toFixed(0)}%
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeFromMemorization(e.surah, e.ayah);
                        setItems(listMemorization());
                      }}
                      aria-label="Remove from hifz"
                      className="text-cream-200/55 hover:text-red-300"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        isDue ? 'bg-gold-500/15 text-gold-200' : 'bg-ink-700/60 text-cream-200/55'
                      }`}
                    >
                      {isDue ? 'Due now' : `Next: ${new Date(e.nextReviewAt).toLocaleDateString()}`}
                    </span>
                    <Link
                      href={`/quran/${e.surah}/${e.ayah}`}
                      className="text-xs font-medium text-gold-300 hover:text-gold-200"
                    >
                      Open
                    </Link>
                  </div>
                </Card>
              );
            })}
          </ul>
        )}
      </AppShell>
    </>
  );
}
