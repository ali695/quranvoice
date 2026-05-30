/** Returns true when the locale is right-to-left. */
export function isRtl(lang?: string): boolean {
  if (!lang) return false;
  const code = lang.toLowerCase().slice(0, 2);
  return ['ar', 'fa', 'ur', 'he', 'sd', 'ps'].includes(code);
}
