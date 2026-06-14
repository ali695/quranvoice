/**
 * Word-level recitation timing (client + server safe).
 *
 * Quran.Foundation returns per-verse segment timing on the `audio` object when
 * a verse is fetched with `?audio={reciterId}`:
 *   segments: [[segmentIndex, wordPosition, startMs, endMs], ...]
 *
 * We NEVER synthesize timing — if segments are absent, callers fall back to
 * ayah-level highlighting.
 */

/** A single segment: [segmentIndex, wordPosition (1-based), startMs, endMs]. */
export type Segment = [number, number, number, number];

export interface AyahTiming {
  /** Audio URL these segments are timed against (must be the one played). */
  url: string;
  segments: Segment[];
}

function segWord(s: Segment): number {
  return s[1];
}
function segStart(s: Segment): number {
  return s[2];
}
function segEnd(s: Segment): number {
  return s[3];
}

/** Whether real per-word timing is present. */
export function hasWordTiming(timing: AyahTiming | null | undefined): boolean {
  return Boolean(timing?.segments?.length && timing.segments.some((s) => segWord(s) > 0));
}

/**
 * Active word position (1-based) for a playback time in ms — or null when no
 * segment covers it (e.g. silence/leading gap). Linear scan is fine: a verse
 * has a few dozen words at most.
 */
export function activeWordPosition(segments: Segment[], currentMs: number): number | null {
  let candidate: number | null = null;
  for (const s of segments) {
    if (currentMs >= segStart(s) && currentMs < segEnd(s)) return segWord(s);
    // Past the end of a segment — remember it so a tiny gap still highlights
    // the most-recently-finished word instead of flickering to nothing.
    if (currentMs >= segEnd(s)) candidate = segWord(s);
  }
  return candidate;
}

/** Last word position in the timing set (for completion checks). */
export function lastWordPosition(segments: Segment[]): number {
  return segments.reduce((m, s) => Math.max(m, segWord(s)), 0);
}
