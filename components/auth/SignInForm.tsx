'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import {
  signInWithGoogle,
  signInWithMagicLink,
  signInWithPassword,
} from '@/lib/supabase/auth';

export function SignInForm() {
  const sb = getSupabaseBrowser();
  const enabled = Boolean(sb);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'info' | 'error'; text: string } | null>(null);

  if (!enabled) {
    return (
      <div className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-3 text-xs text-cream-100/85">
        Account sync is configured at the deployment level. Add your Supabase project URL and anon
        key to <code className="font-mono">.env.local</code> to enable sign-in.
      </div>
    );
  }

  const redirectTo =
    (process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')) +
    '/auth/callback';

  async function onMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    const res = await signInWithMagicLink(sb, email, { redirectTo });
    setBusy(false);
    setMsg(
      res.ok
        ? { kind: 'info', text: 'Check your inbox for a sign-in link.' }
        : { kind: 'error', text: res.error ?? 'Could not send magic link.' },
    );
  }

  async function onPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    const res = await signInWithPassword(sb, email, password);
    setBusy(false);
    if (res.ok) {
      window.location.href = '/profile';
    } else {
      setMsg({ kind: 'error', text: res.error ?? 'Sign-in failed.' });
    }
  }

  async function onGoogle() {
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    const res = await signInWithGoogle(sb, { redirectTo });
    setBusy(false);
    if (res.ok && res.redirectUrl) window.location.href = res.redirectUrl;
    else setMsg({ kind: 'error', text: res.error ?? 'Google sign-in failed.' });
  }

  return (
    <div className="flex flex-col gap-5">
      <Tabs
        items={[
          {
            id: 'magic',
            label: 'Magic link',
            content: (
              <form onSubmit={onMagicLink} className="flex flex-col gap-4">
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <Button type="submit" disabled={busy || !email}>
                  {busy ? 'Sending…' : 'Send magic link'}
                </Button>
              </form>
            ),
          },
          {
            id: 'password',
            label: 'Password',
            content: (
              <form onSubmit={onPassword} className="flex flex-col gap-4">
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <Button type="submit" disabled={busy || !email || !password}>
                  {busy ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            ),
          },
        ]}
      />

      <button
        type="button"
        onClick={onGoogle}
        disabled={busy}
        className="flex items-center justify-center gap-2 rounded-xl border border-ink-600/70 bg-ink-800/60 px-4 py-2.5 text-sm text-cream-100 hover:border-gold-500/40 disabled:opacity-50"
      >
        <Icon name="globe" size={14} />
        Continue with Google
      </button>

      {msg && (
        <p
          className={`rounded-xl border p-3 text-xs ${
            msg.kind === 'info'
              ? 'border-gold-500/30 bg-gold-500/5 text-gold-100'
              : 'border-red-500/30 bg-red-500/5 text-red-200'
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
