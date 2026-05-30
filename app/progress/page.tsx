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
  getDailyProgress,
  getLastRead,
  getReadingHistory,
  getStreak,
} from '@/lib/services/progressService';
import type { DailyProgress, ReadingHistoryEntry } from '@/lib/types/user';
import type { ReadingProgress } from '@/lib/types/quran';

export default function ProgressPage() {
  const [last, setLast] = useState<ReadingProgress | null>(null);
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);
  const [daily, setDaily] = useState<DailyProgress[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setLast(getLastRead());
    setHistory(getReadingHistory());
    setDaily(getDailyProgress());
    setStreak(getStreak());
  }, []);

  const last7 = daily.slice(0, 7);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Your Quran Progress"
        description="Last read, recent activity, and your reading streak."
      />
      <AppShell>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
              <Icon name="book" size={13} />
              Last read
            </div>
            {last ? (
              <>
                <h3 className="mt-3 font-display text-xl text-cream-50">
                  {last.surah.transliteration}{' '}
                  <span className="arabic ml-1 text-2xl text-gold-200" dir="rtl" lang="ar">
                    {last.surah.arabic}
                  </span>
                </h3>
                <p className="mt-1 text-sm text-cream-200/65">
                  Ayah {last.ayah} of {last.surah.ayahCount} ·{' '}
                  {new Date(last.lastReadAt).toLocaleString()}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                    style={{ width: `${Math.min(100, last.percent)}%` }}
                  />
                </div>
                <Button
                  className="mt-5"
                  size="md"
                  href={`/quran/${last.surah.number}/${last.ayah}`}
                >
                  Resume reading
                  <Icon name="arrow-right" size={14} />
                </Button>
              </>
            ) : (
              <EmptyState
                icon="book"
                title="No reading recorded yet"
                description="Open any surah to start tracking your progress."
                action={<Button href="/quran">Read Quran</Button>}
              />
            )}
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
              <Icon name="target" size={13} />
              This week
            </div>
            <p className="mt-3 font-display text-2xl text-cream-50">{streak}-day streak</p>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => {
                const idx = 6 - i;
                const dayEntry = last7[idx];
                const intensity = dayEntry ? Math.min(1, dayEntry.ayahsRead / 20) : 0;
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-md"
                    style={{
                      background: `rgba(212, 165, 116, ${0.06 + intensity * 0.6})`,
                    }}
                    title={dayEntry ? `${dayEntry.date}: ${dayEntry.ayahsRead} ayahs` : 'No reading'}
                  />
                );
              })}
            </div>
            <p className="mt-4 text-xs text-cream-200/55">
              Heatmap shows ayahs read per day over the last 7 days.
            </p>
          </Card>
        </div>

        <h2 className="mt-10 font-display text-xl text-cream-50">Recent activity</h2>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-cream-200/55">No activity yet.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {history.slice(0, 20).map((h, i) => (
              <Card key={i} as="li" variant="elevated" className="p-4">
                <Link
                  href={`/quran/${h.surah}/${h.ayah}`}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-cream-100">{h.verseKey}</p>
                    <p className="text-xs text-cream-200/55">{new Date(h.at).toLocaleString()}</p>
                  </div>
                  <Icon name="chevron-right" size={14} className="text-cream-200/40" />
                </Link>
              </Card>
            ))}
          </ul>
        )}
      </AppShell>
    </>
  );
}
