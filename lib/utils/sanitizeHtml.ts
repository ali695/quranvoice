/**
 * Minimal allowlist HTML sanitizer for third-party text content
 * (surah introductions, tafsir). Works on server and client, no deps.
 *
 * - Drops <script>, <style>, <iframe>, <object>, <embed>, <template>,
 *   <noscript>, <svg>, <math> elements together with their contents.
 * - Drops comments, doctype and CDATA.
 * - Keeps only the tags in ALLOWED, re-emitted with NO attributes
 *   (so no event handlers, styles, links or URLs survive).
 * - Every other tag is removed but its text content is kept.
 * - Stray `<` / `>` that are not part of a tag are escaped.
 */

const ALLOWED = new Set([
  'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u',
  'ul', 'ol', 'li', 'blockquote', 'sup', 'sub', 'span', 'div',
]);
const VOID = new Set(['br']);
const DROP_WITH_CONTENT = /<(script|style|iframe|object|embed|template|noscript|svg|math)\b[\s\S]*?<\/\1\s*>/gi;
const DROP_OPEN_ONLY = /<(script|style|iframe|object|embed|template|noscript|svg|math)\b[^>]*>/gi;

export function sanitizeHtml(input: string): string {
  if (!input) return '';
  let s = input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
    .replace(/<!doctype[^>]*>/gi, '');
  // Repeat until stable so nested/obfuscated blocks can't survive one pass.
  let prev;
  do {
    prev = s;
    s = s.replace(DROP_WITH_CONTENT, '').replace(DROP_OPEN_ONLY, '');
  } while (s !== prev);

  return s.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^<>]*>|[<>]/g, (match, tag: string | undefined) => {
    if (!tag) return match === '<' ? '&lt;' : '&gt;';
    const name = tag.toLowerCase();
    if (!ALLOWED.has(name)) return '';
    const closing = match.startsWith('</');
    if (VOID.has(name)) return closing ? '' : `<${name}>`;
    return closing ? `</${name}>` : `<${name}>`;
  });
}

/** Strip all tags and collapse whitespace — for excerpts and meta text. */
export function htmlToText(input: string): string {
  return sanitizeHtml(input)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
