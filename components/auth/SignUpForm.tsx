'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { signUpWithEmail } from '@/lib/supabase/auth';

export function SignUpForm() {
  const sb = getSupabaseBrowser();
  const enabled = Boolean(sb);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'info' | 'error'; text: string } | null>(null);

  if (!enabled) {
    return (
      <div className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-3 text-xs text-cream-100/85">
        Sign-up is configured at the deployment level. Add your Supabase project credentials to
        <code className="font-mono"> .env.local</code> to enable it.
      </div>
    );
  }

  const redirectTo =
    (process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')) +
    '/auth/callback';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    const res = await signUpWithEmail(sb, email, password, { redirectTo });
    setBusy(false);
    if (res.ok) {
      if (res.needsConfirmation) {
        setMsg({
          kind: 'info',
          text: 'Account created. Check your inbox to confirm your email.',
        });
      } else {
        window.location.href = '/profile';
      }
      // Persist display name into profile on first sign-in (best-effort).
      if (name) {
        const { data } = await sb.auth.getUser();
        if (data.user) {
          await sb.from('profiles').upsert({ id: data.user.id, display_name: name }, { onConflict: 'id' });
        }
      }
    } else {
      setMsg({ kind: 'error', text: res.error ?? 'Sign-up failed.' });
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
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
        autoComplete="new-password"
      />
      <Button type="submit" disabled={busy || !email || !password}>
        {busy ? 'Creating…' : 'Create account'}
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
