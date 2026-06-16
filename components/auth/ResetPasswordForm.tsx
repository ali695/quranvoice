'use client';

import { useEffect, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { updateUserPassword } from '@/lib/supabase/auth';

/**
 * Sets a new password after the user follows the reset link from their email.
 * Supabase parses the recovery token from the URL and establishes a temporary
 * session; we then call updateUser({ password }).
 */
export function ResetPasswordForm() {
  const sb = getSupabaseBrowser();
  const enabled = Boolean(sb);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'info' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!sb) return;
    // The recovery session arrives via the URL hash. Mark ready once Supabase
    // has a session (or fires the PASSWORD_RECOVERY event).
    sb.auth.getSession().then((res: { data: { session: Session | null } }) => {
      if (res.data.session) setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  if (!enabled) {
    return (
      <div className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-3 text-xs text-cream-100/85">
        Account sync is configured at the deployment level. Add your Supabase project URL and anon
        key to <code className="font-mono">.env.local</code> to enable password reset.
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    if (password.length < 8) {
      setMsg({ kind: 'error', text: 'Use at least 8 characters.' });
      return;
    }
    if (password !== confirm) {
      setMsg({ kind: 'error', text: 'The two passwords don’t match.' });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await updateUserPassword(sb, password);
    setBusy(false);
    if (res.ok) {
      setMsg({ kind: 'info', text: 'Password updated. Redirecting…' });
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1200);
    } else {
      setMsg({ kind: 'error', text: res.error ?? 'Could not update the password.' });
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {!ready && (
        <p className="rounded-xl border border-ink-600/60 bg-ink-800/50 p-3 text-xs text-cream-200/70">
          Open this page from the reset link in your email. If you got here directly, request a new
          link from the sign-in page.
        </p>
      )}
      <Input
        label="New password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        placeholder="At least 8 characters"
      />
      <Input
        label="Confirm new password"
        type="password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
      />
      <Button type="submit" disabled={busy || !password || !confirm}>
        {busy ? 'Updating…' : 'Update password'}
      </Button>
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
    </form>
  );
}
