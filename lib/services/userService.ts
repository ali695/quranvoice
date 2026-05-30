'use client';

import { readJSON, writeJSON, clearNamespace } from '@/lib/utils/storage';
import type { UserProfile } from '@/lib/types/user';

const KEY = 'user';

export function getUser(): UserProfile {
  return readJSON<UserProfile>(KEY, { isSignedIn: false });
}

export function setUser(profile: UserProfile): void {
  writeJSON(KEY, profile);
}

export function signOut(): void {
  setUser({ isSignedIn: false });
}

export function deleteAllLocalData(): void {
  clearNamespace();
}
