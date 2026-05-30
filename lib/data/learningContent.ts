/**
 * Editorial guide content for the Learning Library.
 *
 * These bodies are reading-strategy guides — they do NOT contain
 * Quran translations, tafsir, or hadith. Any religious content in
 * an article must come from a registered source via the relevant
 * service (e.g. tafsirService, quranService).
 */

export interface LearningContent {
  slug: string;
  title: string;
  category: string;
  summary: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
}

export const LEARNING_CONTENT: Record<string, LearningContent> = {
  'beginner-quran-guide': {
    slug: 'beginner-quran-guide',
    title: 'Beginner Quran Guide',
    category: 'Guide',
    summary:
      'How the mushaf is organized, where to begin, and how to build a sustainable reading habit.',
    sections: [
      {
        heading: 'How the mushaf is organized',
        paragraphs: [
          'The Quran is one book with 114 surahs (chapters), traditionally arranged not in the order they were revealed but in a structure preserved from the time of the early companions.',
          'Each surah is made up of ayahs (verses). Lengths vary widely — the longest surah is Al-Baqarah (286 ayahs) and the shortest is Al-Kawthar (3 ayahs).',
          'Two parallel divisions make reading easier: 30 Juz (parts) for daily reading, and 604 mushaf pages for visual navigation.',
        ],
      },
      {
        heading: 'Where to begin',
        paragraphs: [
          'A common starting point is to read the surahs you already hear in prayer — Al-Fatihah, then the short surahs at the end of the mushaf.',
          'From there, many readers move to Surah Yaseen and Surah Al-Kahf, both of which are widely recited weekly.',
          'For long-form reading, a “one juz per day” plan completes the Quran in 30 days, while a “half a juz per day” plan completes it in 60 days.',
        ],
      },
      {
        heading: 'Building a habit',
        paragraphs: [
          'Pick a fixed time of day that you can protect — after Fajr or before Isha are common choices.',
          'Use the Reading Goals page in QuranVoice to set a daily target. Streaks help, but consistency matters more than volume.',
          'When you miss a day, start again the next day. The Quran is a lifelong companion, not a sprint.',
        ],
      },
    ],
  },
  'tajweed-basics': {
    slug: 'tajweed-basics',
    title: 'Tajweed Basics',
    category: 'Recitation',
    summary: 'A neutral overview of the categories of tajweed rules and how to study them.',
    sections: [
      {
        heading: 'What is tajweed?',
        paragraphs: [
          'Tajweed is the discipline of reciting the Quran accurately — pronouncing each letter from its correct place of articulation and observing the lengths and characteristics of letters as preserved through the chain of recitation.',
          'It is studied with a qualified teacher, ideally with corrective listening and oral practice.',
        ],
      },
      {
        heading: 'Major topic areas',
        paragraphs: [
          'Makhārij — the points of articulation of the Arabic letters.',
          'Sifāt — the qualitative characteristics of each letter (e.g. heaviness, leakage of sound).',
          'Madd — lengthening rules, including natural and connected lengthenings.',
          'Idghām, Ikhfā’, Iẓhār, Iqlāb — rules governing the noon sākin, tanween, and meem sākin.',
          'Waqf — the rules of stopping correctly on words at the end of phrases.',
        ],
      },
      {
        heading: 'How to study',
        paragraphs: [
          'Listen to a single reciter consistently for several weeks to internalize phrasing.',
          'Sit with a teacher who can correct your articulation in real time — this is the part that books cannot replace.',
          'Use slow recitations (Murattal) for learning and Mujawwad recordings for listening, not imitation.',
        ],
      },
    ],
  },
  'names-of-allah': {
    slug: 'names-of-allah',
    title: 'The Names of Allah',
    category: 'Aqeedah',
    summary: 'A study companion: how the names appear in the Quran and how scholars approach them.',
    sections: [
      {
        heading: 'Where the names are found',
        paragraphs: [
          'The beautiful names of Allah appear throughout the Quran. Many are concentrated at the close of ayahs (e.g. Al-Ghafur al-Rahim, Al-Aziz al-Hakim).',
          'Surah Al-Hashr (verses 22–24) lists a number of names in succession and is often used as a starting point for study.',
        ],
      },
      {
        heading: 'How scholars approach them',
        paragraphs: [
          'Classical scholars approach the names by affirming what Allah affirms for Himself without likening Him to creation and without negating His attributes.',
          'For each name, the typical study covers meaning, where it appears in the Quran and Sunnah, and what worship or behavior follows from it.',
          'Study books vary. Use a teacher or trusted resource when going deep into theological implications.',
        ],
      },
    ],
  },
  duas: {
    slug: 'duas',
    title: 'Quranic Duas',
    category: 'Worship',
    summary: 'A reading guide to selected supplications mentioned in the Book of Allah.',
    sections: [
      {
        heading: 'What counts as a Quranic dua',
        paragraphs: [
          'These are supplications attributed in the Quran to prophets, righteous people, or the believers — phrased exactly as the verses preserve them.',
          'Reciting them in their Quranic wording carries the dignity of the original text. Many of them appear at the close of surahs Al-Baqarah, Al-Imran, and elsewhere.',
        ],
      },
      {
        heading: 'How to study them',
        paragraphs: [
          'Read the supplication in its surah context — the verses before it often explain the situation in which it was made.',
          'Use a verified translation in your language to internalize meaning before memorization.',
          'Keep a small notebook of duas you return to. Personalize when and how often you recite them.',
        ],
      },
    ],
  },
  'stories-of-the-prophets': {
    slug: 'stories-of-the-prophets',
    title: 'Stories of the Prophets',
    category: 'History',
    summary: 'A reading guide to where the Quran narrates the lives of the Messengers.',
    sections: [
      {
        heading: 'How the Quran narrates',
        paragraphs: [
          'The Quran does not present prophet narratives as a single chronological history. Episodes appear in different surahs to illustrate themes — patience, calling to truth, trust in Allah.',
          'Surah Yusuf is a notable exception: a single, mostly linear narrative of one prophet.',
        ],
      },
      {
        heading: 'How to study',
        paragraphs: [
          'Read a complete prophet narrative in its primary surah first (e.g. Yusuf in Surah Yusuf, Musa in Surah Al-Qasas).',
          'Then trace cross-references in other surahs to see how each episode is framed for different audiences.',
          'Pair your reading with classical works like Qisas al-Anbiya — verifying with scholars where appropriate.',
        ],
      },
    ],
  },
  'daily-reflection': {
    slug: 'daily-reflection',
    title: 'Daily Reflection',
    category: 'Reflection',
    summary: 'A short daily reading rhythm to keep your heart close to the Quran.',
    sections: [
      {
        heading: 'A simple daily practice',
        paragraphs: [
          'Pick a short surah or a few ayahs. Read them in Arabic if you can, with a translation you trust.',
          'Pause on one phrase that strikes you. Write a sentence about why in your notes.',
          'Return to the same passage tomorrow. Compare what you noticed today with what you notice then.',
        ],
      },
      {
        heading: 'When you feel dry',
        paragraphs: [
          'Drop the volume. One ayah a day, slowly, beats ten ayahs skimmed.',
          'Read the same surah for a week. Repetition opens doors that speed closes.',
          'Listen to a reciter while resting your eyes. The ear hears what the eye sometimes misses.',
        ],
      },
    ],
  },
  articles: {
    slug: 'articles',
    title: 'Islamic Articles',
    category: 'Library',
    summary: 'Editorial pieces on Quranic themes, reading practices, and study tools.',
    sections: [
      {
        heading: 'Coming soon',
        paragraphs: [
          'We will publish longer editorial pieces here on Quran reading practices, comparative translation notes, and study workflows.',
          'Subscribe to the QuranVoice mailing list (coming soon) to be notified.',
        ],
      },
    ],
  },
};
