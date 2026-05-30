export function formatReference(surah: number, ayah?: number, ayahEnd?: number): string {
  if (!ayah) return String(surah);
  if (ayahEnd && ayahEnd !== ayah) return `${surah}:${ayah}-${ayahEnd}`;
  return `${surah}:${ayah}`;
}

/** Pad a number for verse keys in API calls, e.g. 1 -> "001" */
export function padNumber(n: number, width = 3): string {
  return String(n).padStart(width, '0');
}
