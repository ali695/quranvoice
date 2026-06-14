/** Convert Western digits to Arabic-Indic numerals (e.g. 255 → ٢٥٥). */
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)] ?? d);
}
