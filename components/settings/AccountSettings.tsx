'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { exportBookmarks } from '@/lib/services/bookmarkService';
import { exportNotes } from '@/lib/services/notesService';
import { deleteAllLocalData, getUser, signOut } from '@/lib/services/userService';
import type { UserProfile } from '@/lib/types/user';

function downloadFile(name: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function AccountSettings() {
  const [user, setUser] = useState<UserProfile | null>(null);
  useEffect(() => setUser(getUser()), []);

  const onSignOut = () => {
    signOut();
    setUser(getUser());
  };

  const onDelete = () => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Delete all local QuranVoice data (bookmarks, notes, settings, progress)?')
    ) {
      deleteAllLocalData();
      setUser(getUser());
    }
  };

  return (
    <Card variant="elevated" className="p-6">
      <h2 className="font-display text-lg font-medium text-cream-50">Account</h2>
      <p className="mt-1 text-sm text-cream-200/65">Profile, sign-in, and local data.</p>

      <div className="mt-5 rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
        {user?.isSignedIn ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cream-50">{user.displayName ?? user.email}</p>
              <p className="text-xs text-cream-200/55">Signed in</p>
            </div>
            <Button size="sm" variant="secondary" onClick={onSignOut}>
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cream-50">Not signed in</p>
              <p className="text-xs text-cream-200/55">
                Sign in to sync bookmarks and notes (coming soon).
              </p>
            </div>
            <Button size="sm" href="/auth/sign-in">
              Sign in
            </Button>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          size="md"
          variant="secondary"
          onClick={() => downloadFile('quranvoice-bookmarks.json', exportBookmarks())}
        >
          <Icon name="bookmark" size={14} />
          Export bookmarks
        </Button>
        <Button
          size="md"
          variant="secondary"
          onClick={() => downloadFile('quranvoice-notes.json', exportNotes())}
        >
          <Icon name="note" size={14} />
          Export notes
        </Button>
      </div>

      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
        <p className="text-sm font-medium text-red-200">Danger zone</p>
        <p className="mt-1 text-xs text-cream-200/65">
          Deletes all local QuranVoice data on this device. This cannot be undone.
        </p>
        <button
          type="button"
          onClick={onDelete}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 hover:bg-red-500/20"
        >
          <Icon name="close" size={12} />
          Delete local data
        </button>
      </div>
    </Card>
  );
}
