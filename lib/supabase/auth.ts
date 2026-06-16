/**
 * Supabase auth helpers — work on both client and server sides.
 * Each helper accepts an explicit client, so callers can pass the right
 * one (browser vs server) for the context.
 */

import type { SupabaseClient, User } from '@supabase/supabase-js';

export interface SignInOptions {
  /** Where to redirect after the user clicks the magic link / OAuth callback */
  redirectTo: string;
}

export async function signInWithMagicLink(
  client: SupabaseClient,
  email: string,
  opts: SignInOptions,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: opts.redirectTo },
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function signInWithGoogle(
  client: SupabaseClient,
  opts: SignInOptions,
): Promise<{ ok: boolean; error?: string; redirectUrl?: string }> {
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: opts.redirectTo },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, redirectUrl: data?.url };
}

export async function signInWithPassword(
  client: SupabaseClient,
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await client.auth.signInWithPassword({ email, password });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function signUpWithEmail(
  client: SupabaseClient,
  email: string,
  password: string,
  opts: SignInOptions,
): Promise<{ ok: boolean; error?: string; needsConfirmation?: boolean }> {
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: opts.redirectTo },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, needsConfirmation: !data.session };
}

export async function sendPasswordReset(
  client: SupabaseClient,
  email: string,
  opts: SignInOptions,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: opts.redirectTo,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function updateUserPassword(
  client: SupabaseClient,
  newPassword: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await client.auth.updateUser({ password: newPassword });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function signOut(client: SupabaseClient): Promise<void> {
  await client.auth.signOut();
}

export async function getCurrentUser(client: SupabaseClient): Promise<User | null> {
  const { data } = await client.auth.getUser();
  return data.user ?? null;
}
