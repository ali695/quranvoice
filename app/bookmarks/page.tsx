'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { listBookmarks, removeBookmark } from '@/lib/services/bookmarkService';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import type { Bookmark } from '@/lib/types/user';

type SortMode = 'recent' | 'surah';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortMode>('recent');

  useEffect(() => setBookmarks(listBookmarks()), []);

  const onRemove = (id: string) => {
    removeBookmark(id);
    setBookmarks(listBookmarks());
  };

  const filtered = bookmarks
    .filter((b) => !q || b.verseKey.includes(q) || (b.note ?? '').toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'surah') {
        if (a.surah !== b.surah) return a.surah - b.surah;
        return a.ayah - b.ayah;
      }
      return a.createdAt < b.createdAt ? 1 : -1;
    });

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="My Bookmarks"
        description="Verses you’ve saved. Stored locally on this device until sync is connected."
      />
      <AppShell>
        <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px]">
          <Input placeholder="Search bookmarks…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            options={[
              { value: 'recent', label: 'Most recent' },
              { value: 'surah', label: 'By surah' },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="bookmark"
            title="No bookmarks yet"
            description="Open a surah and tap the bookmark icon on any ayah to save it here."
            action={
              <Button href="/quran" size="md">
                Read Quran
              </Button>
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((b) => {
              const meta = getSurahByNumber(b.surah);
              return (
                <Card key={b.id} as="li" variant="elevated" className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-cream-200/45">
                        Surah {b.surah} · Ayah {b.ayah}
                      </p>
                      <p className="mt-1 font-display text-base text-cream-50">
                        {meta?.transliteration ?? 'Surah'}{' '}
                        <span className="arabic ml-1 text-lg text-gold-200" dir="rtl" lang="ar">
                          {meta?.arabic}
                        </span>
                      </p>
                      {b.note && (
                        <p className="mt-2 line-clamp-2 text-xs text-cream-200/65">{b.note}</p>
                      )}
                    </div>
                    <button
                      onClick={() => onRemove(b.id)}
                      className="text-cream-200/55 hover:text-red-300"
                      aria-label="Remove bookmark"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/quran/${b.surah}/${b.ayah}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-gold-300 hover:text-gold-200"
                    >
                      Open
                      <Icon name="arrow-right" size={12} />
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
