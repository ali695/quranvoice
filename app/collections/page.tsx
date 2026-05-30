'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  createCollection,
  deleteCollection,
  listBookmarks,
  listCollections,
} from '@/lib/services/bookmarkService';
import type { BookmarkCollection } from '@/lib/types/user';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [name, setName] = useState('');
  const refresh = () => setCollections(listCollections());

  useEffect(refresh, []);

  const counts = (id: string) => listBookmarks().filter((b) => b.collectionId === id).length;

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Collections"
        description="Group bookmarks into named collections for focused study."
      />
      <AppShell>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = name.trim();
            if (!v) return;
            createCollection(v);
            setName('');
            refresh();
          }}
          className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]"
        >
          <Input
            label="New collection"
            placeholder="e.g. Verses on patience"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex items-end">
            <Button type="submit" size="md">
              <Icon name="plus" size={14} />
              Create
            </Button>
          </div>
        </form>

        {collections.length === 0 ? (
          <EmptyState
            icon="bookmark"
            title="No collections yet"
            description="Create your first collection above, then assign bookmarks to it from the reader."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <Card key={c.id} as="li" variant="elevated" className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-base text-cream-50">{c.name}</p>
                    <p className="mt-0.5 text-xs text-cream-200/55">{counts(c.id)} bookmarks</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteCollection(c.id);
                      refresh();
                    }}
                    aria-label="Delete collection"
                    className="text-cream-200/55 hover:text-red-300"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </ul>
        )}
      </AppShell>
    </>
  );
}
