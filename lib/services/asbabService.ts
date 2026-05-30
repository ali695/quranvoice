/**
 * AsbabService — Asbab al-Nuzul / Shan-e-Nuzul.
 *
 * No verified Asbab data source is registered yet. This service
 * always returns an empty result so the UI shows the unavailable
 * state. We never infer or generate context-of-revelation content.
 */

import type { AsbabEntry } from '@/lib/types/asbab';

export async function getAsbabForAyah(
  _surah: number,
  _ayah: number,
): Promise<AsbabEntry[]> {
  void _surah;
  void _ayah;
  return [];
}

export async function listAsbabEntries(): Promise<AsbabEntry[]> {
  return [];
}
