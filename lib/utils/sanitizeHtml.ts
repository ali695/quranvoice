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

export interface SanitizeOptions {
  /** Extra tag names to allow (e.g. 'tajweed'). */
  extraTags?: readonly string[];
  /**
   * Keep a `class` attribute when its value is only safe class-name tokens
   * ([A-Za-z0-9_-] separated by spaces). Needed for tajweed rule colouring
   * and provider styling hooks; no other attribute is ever kept.
   */
  allowClass?: boolean;
}

const SAFE_CLASS = /^[A-Za-z0-9_\- ]{1,120}$/;

function classAttr(tagBody: string): string {
  const m = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(tagBody);
  const value = (m?.[1] ?? m?.[2] ?? m?.[3] ?? '').trim();
  return value && SAFE_CLASS.test(value) ? ` class="${value}"` : '';
}

export function sanitizeHtml(input: string, opts: SanitizeOptions = {}): string {
  if (!input) return '';
  const allowed = opts.extraTags?.length ? new Set([...ALLOWED, ...opts.extraTags]) : ALLOWED;
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
    if (!allowed.has(name)) return '';
    const closing = match.startsWith('</');
    if (VOID.has(name)) return closing ? '' : `<${name}>`;
    if (closing) return `</${name}>`;
    return `<${name}${opts.allowClass ? classAttr(match) : ''}>`;
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
