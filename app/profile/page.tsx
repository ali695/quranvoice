'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { FoundationConnect } from '@/components/auth/FoundationConnect';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { signOut } from '@/lib/supabase/auth';
import { listBookmarks } from '@/lib/services/bookmarkService';
import { listNotes } from '@/lib/services/notesService';
import { listMemorization } from '@/lib/services/memorizationService';
import { getStreak } from '@/lib/services/progressService';

export default function ProfilePage() {
  const [stats, setStats] = useState({ bookmarks: 0, notes: 0, hifz: 0, streak: 0 });
  const [user, setUser] = useState<{ id?: string; email?: string; displayName?: string; isSignedIn: boolean }>({
    isSignedIn: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats({
      bookmarks: listBookmarks().length,
      notes: listNotes().length,
      hifz: listMemorization().length,
      streak: getStreak(),
    });
    (async () => {
      const sb = getSupabaseBrowser();
      if (!sb) return;
      const { data } = await sb.auth.getUser();
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? undefined,
          displayName:
            (data.user.user_metadata?.display_name as string | undefined) ?? data.user.email ?? undefined,
          isSignedIn: true,
        });
      }
    })();
  }, []);

  const onSignOut = async () => {
    const sb = getSupabaseBrowser();
    if (sb) await signOut(sb);
    setUser({ isSignedIn: false });
  };

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title={user.isSignedIn ? user.displayName ?? 'Profile' : 'Your profile'}
        description={
          user.isSignedIn
            ? `Signed in${user.email ? ` as ${user.email}` : ''}.`
            : 'You are using QuranVoice as a guest. Bookmarks, notes, and progress live on this device.'
        }
        actions={
          user.isSignedIn ? (
            <Button variant="secondary" size="md" onClick={onSignOut}>
              Sign out
            </Button>
          ) : (
            <Button href="/auth/sign-in" size="md">
              Sign in
            </Button>
          )
        }
      />
      <AppShell>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: 'bookmark' as const, label: 'Bookmarks', value: mounted ? stats.bookmarks : '—' },
            { icon: 'note' as const, label: 'Notes', value: mounted ? stats.notes : '—' },
            { icon: 'brain' as const, label: 'In hifz', value: mounted ? stats.hifz : '—' },
            { icon: 'target' as const, label: 'Streak', value: mounted ? stats.streak : '—' },
          ].map((s) => (
            <Card key={s.label} variant="elevated" className="p-5 text-center">
              <Icon name={s.icon} size={18} className="mx-auto text-gold-300" />
              <p className="mt-2 font-display text-2xl text-cream-50">{s.value}</p>
              <p className="text-xs uppercase tracking-wider text-cream-200/45">{s.label}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button href="/bookmarks" variant="secondary">
            <Icon name="bookmark" size={14} />
            My bookmarks
          </Button>
          <Button href="/notes" variant="secondary">
            <Icon name="note" size={14} />
            My notes
          </Button>
          <Button href="/goals" variant="secondary">
            <Icon name="target" size={14} />
            My goals
          </Button>
          <Button href="/settings" variant="secondary">
            <Icon name="settings" size={14} />
            Settings
          </Button>
        </div>

        <div className="mt-8">
          <FoundationConnect />
        </div>
      </AppShell>
    </>
  );
}
