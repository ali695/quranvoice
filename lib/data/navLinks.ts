export const NAV_LINKS = [
  { label: 'Quran', href: '/quran', key: 'nav.quran' },
  { label: 'Recitations', href: '/recitations', key: 'nav.recitations' },
  { label: 'Tafsir', href: '/tafsir', key: 'nav.tafsir' },
  { label: 'Translations', href: '/translations', key: 'nav.translations' },
  { label: 'Learn', href: '/learn', key: 'nav.learn' },
  { label: 'Tools', href: '/tools', key: 'nav.tools' },
] as const;

export const QURAN_SIDEBAR_LINKS = [
  { label: 'All Surahs', href: '/surahs', icon: 'book' as const },
  { label: 'Browse by Juz', href: '/juz', icon: 'scroll' as const },
  { label: 'Browse by Page', href: '/pages', icon: 'feather' as const },
  { label: 'Search', href: '/search', icon: 'search' as const },
  { label: 'Bookmarks', href: '/bookmarks', icon: 'bookmark' as const },
  { label: 'Notes', href: '/notes' as const, icon: 'note' as const },
  { label: 'Goals', href: '/goals', icon: 'target' as const },
  { label: 'Progress', href: '/progress', icon: 'chart' as const },
];
