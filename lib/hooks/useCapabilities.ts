'use client';

/**
 * useCapabilities — client hook over `/api/quran/capabilities`.
 *
 * Fetches the live capability snapshot once per page session (module-level
 * cache + shared in-flight promise so multiple components don't each fetch)
 * and exposes it so UI can unlock features that the active provider really
 * supports. Components should render a neutral "checking availability" state
 * while `loading` is true rather than assuming locked.
 */

import { useEffect, useState } from 'react';
import { emptyCapabilities } from '@/lib/quran-foundation/capability-mappers';
import type { Capabilities } from '@/lib/types/capability';

let cached: Capabilities | null = null;
let inFlight: Promise<Capabilities> | null = null;

async function fetchCapabilities(): Promise<Capabilities> {
  if (cached) return cached;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const res = await fetch('/api/quran/capabilities');
      if (!res.ok) throw new Error(`capabilities ${res.status}`);
      const json = (await res.json()) as { data?: Capabilities };
      cached = json.data ?? emptyCapabilities();
    } catch {
      cached = emptyCapabilities();
    } finally {
      inFlight = null;
    }
    return cached;
  })();
  return inFlight;
}

export interface UseCapabilitiesResult {
  capabilities: Capabilities | null;
  loading: boolean;
}

export function useCapabilities(): UseCapabilitiesResult {
  const [capabilities, setCapabilities] = useState<Capabilities | null>(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) {
      setCapabilities(cached);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    void fetchCapabilities().then((c) => {
      if (!active) return;
      setCapabilities(c);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { capabilities, loading };
}

/** Force a refetch (e.g. after settings that may change provider config). */
export function invalidateCapabilities(): void {
  cached = null;
  inFlight = null;
}
