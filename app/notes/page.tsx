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
import { deleteNote, listNotes, searchNotes } from '@/lib/services/notesService';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import type { AyahNote } from '@/lib/types/user';

export default function NotesPage() {
  const [notes, setNotes] = useState<AyahNote[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => setNotes(listNotes()), []);

  const filtered = q.trim() ? searchNotes(q) : notes;

  const onDelete = (id: string) => {
    deleteNote(id);
    setNotes(listNotes());
  };

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="My Notes"
        description="Private reflections you’ve written on ayahs. Stored locally on this device."
      />
      <AppShell>
        <div className="mb-6">
          <Input placeholder="Search notes…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="note"
            title="No notes yet"
            description="Open any ayah and tap the note icon to write a private reflection. Notes are never shared automatically."
            action={
              <Button href="/quran" size="md">
                Read Quran
              </Button>
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((n) => {
              const meta = getSurahByNumber(n.surah);
              return (
                <Card key={n.id} as="li" variant="elevated" className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-cream-200/45">
                        Surah {n.surah} · Ayah {n.ayah}
                      </p>
                      <p className="mt-1 font-display text-base text-cream-50">
                        {meta?.transliteration ?? 'Surah'}
                      </p>
                    </div>
                    <button
                      onClick={() => onDelete(n.id)}
                      className="text-cream-200/55 hover:text-red-300"
                      aria-label="Delete note"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-cream-100/85">
                    {n.text}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-wider text-cream-200/45">
                      {new Date(n.updatedAt).toLocaleString()}
                    </p>
                    <Link
                      href={`/quran/${n.surah}/${n.ayah}`}
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
