/** Conditional className join. Pure, no deps. */
export function cn(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ');
}
