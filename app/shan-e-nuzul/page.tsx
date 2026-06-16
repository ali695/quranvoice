import { permanentRedirect } from 'next/navigation';

/**
 * `/shan-e-nuzul` is an alternate transliteration of `/shan-e-nuzool`.
 * Consolidate to the canonical, content-rich page with a 308 redirect so
 * there is one authoritative URL (better for users and SEO).
 */
export default function ShanENuzulAlias() {
  permanentRedirect('/shan-e-nuzool');
}
