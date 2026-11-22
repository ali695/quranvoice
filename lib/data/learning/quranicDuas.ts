/**
 * Quranic duas — supplications preserved in the Quran.
 *
 * Each entry is a verse REFERENCE only. The Arabic, translations and
 * transliteration are fetched at request time from Quran.Foundation, so the
 * wording is always source-accurate. We never paste Quranic text into code.
 *
 * `speaker` and `title` are short factual labels (who makes the dua in the
 * Quran, and its theme) — not translations or commentary. `startAt` names the
 * Arabic word (simple spelling) where the dua itself begins inside the first
 * verse, so the lead-in ("and among them are those who say…") can be shown
 * dimmed and the dua's own transliteration isolated. If the word isn't found
 * the whole verse is shown.
 *
 * Built from the Quran text (Tanzil: 93 "Rabbana" verses, 66 "Rabb/Rabbi"
 * openings, 8 refuge verses) excluding verses that are not supplications to
 * recite (e.g. words of the people of the Fire, 23:106–107, 33:67, 40:11).
 * Selection should be reviewed by a qualified scholar before major changes.
 */

export type DuaGroup = 'rabbana' | 'prophets' | 'refuge' | 'fatiha';

export type DuaCategory =
  | 'forgiveness'
  | 'guidance'
  | 'patience'
  | 'protection'
  | 'family'
  | 'knowledge'
  | 'mercy'
  | 'gratitude'
  | 'difficulty'
  | 'acceptance';

export interface QuranicDua {
  slug: string;
  surah: number;
  /** First ayah of the dua. */
  from: number;
  /** Last ayah (inclusive) when the dua spans several ayahs. */
  to?: number;
  group: DuaGroup;
  category: DuaCategory;
  /** Who makes the dua in the Quran. */
  speaker: string;
  /** Short theme label. */
  title: string;
  /**
   * Simple-spelling Arabic word where the dua begins in the first ayah.
   * Append `@last` when the same word appears earlier in the ayah.
   */
  startAt?: string;
}

export const DUA_GROUPS: Array<{ slug: DuaGroup; label: string; description: string }> = [
  { slug: 'rabbana', label: 'Rabbana duas', description: 'Duas beginning “Rabbana” — “Our Lord” — said by prophets, believers and angels.' },
  { slug: 'prophets', label: 'Duas of the Prophets', description: 'Personal duas of the prophets and the righteous, most beginning “Rabbi” — “My Lord”.' },
  { slug: 'refuge', label: 'Seeking refuge', description: 'Verses seeking Allah’s protection, including Al-Falaq and An-Nas.' },
  { slug: 'fatiha', label: 'Al-Fatiha', description: 'The dua recited in every unit of prayer.' },
];

export const DUA_CATEGORIES: Array<{ slug: DuaCategory; label: string }> = [
  { slug: 'forgiveness', label: 'Forgiveness' },
  { slug: 'guidance', label: 'Guidance' },
  { slug: 'mercy', label: 'Mercy' },
  { slug: 'protection', label: 'Protection' },
  { slug: 'family', label: 'Family & children' },
  { slug: 'knowledge', label: 'Knowledge' },
  { slug: 'patience', label: 'Patience' },
  { slug: 'difficulty', label: 'Hardship' },
  { slug: 'gratitude', label: 'Gratitude' },
  { slug: 'acceptance', label: 'Acceptance' },
];

export const QURANIC_DUAS: QuranicDua[] = [
  // ── Al-Fatiha ────────────────────────────────────────────────────────
  { slug: 'dua-fatihah', surah: 1, from: 5, to: 7, group: 'fatiha', category: 'guidance', speaker: 'Every believer, in every prayer', title: 'Guide us to the straight path' },

  // ── Rabbana ──────────────────────────────────────────────────────────
  { slug: 'accept-from-us', surah: 2, from: 127, group: 'rabbana', category: 'acceptance', speaker: 'Prophets Ibrahim and Ismail, raising the Ka‘bah', title: 'Our Lord, accept this from us', startAt: 'ربنا' },
  { slug: 'make-us-submissive', surah: 2, from: 128, group: 'rabbana', category: 'guidance', speaker: 'Prophets Ibrahim and Ismail', title: 'Make us submissive to You and accept our repentance', startAt: 'ربنا' },
  { slug: 'raise-a-messenger', surah: 2, from: 129, group: 'rabbana', category: 'guidance', speaker: 'Prophets Ibrahim and Ismail', title: 'Raise among them a messenger from themselves', startAt: 'ربنا' },
  { slug: 'good-in-this-world-and-next', surah: 2, from: 201, group: 'rabbana', category: 'mercy', speaker: 'The believers', title: 'Good in this world and good in the Hereafter', startAt: 'ربنا' },
  { slug: 'pour-patience-upon-us', surah: 2, from: 250, group: 'rabbana', category: 'patience', speaker: 'Talut’s army, facing Jalut', title: 'Pour patience upon us and make our steps firm', startAt: 'ربنا' },
  { slug: 'your-forgiveness-our-lord', surah: 2, from: 285, group: 'rabbana', category: 'forgiveness', speaker: 'The Messenger and the believers', title: 'Your forgiveness, our Lord — to You is the return', startAt: 'غفرانك' },
  { slug: 'lord-do-not-burden-us', surah: 2, from: 286, group: 'rabbana', category: 'difficulty', speaker: 'The believers', title: 'Do not burden us beyond what we can bear', startAt: 'ربنا' },
  { slug: 'do-not-let-hearts-deviate', surah: 3, from: 8, group: 'rabbana', category: 'guidance', speaker: 'Those firmly grounded in knowledge', title: 'Do not let our hearts deviate after You have guided us', startAt: 'ربنا' },
  { slug: 'you-will-gather-mankind', surah: 3, from: 9, group: 'rabbana', category: 'guidance', speaker: 'Those firmly grounded in knowledge', title: 'You will gather mankind on a Day of no doubt', startAt: 'ربنا' },
  { slug: 'we-have-believed-forgive-us', surah: 3, from: 16, group: 'rabbana', category: 'forgiveness', speaker: 'The God-conscious', title: 'We have believed — forgive our sins and save us from the Fire', startAt: 'ربنا' },
  { slug: 'disciples-we-believed', surah: 3, from: 53, group: 'rabbana', category: 'guidance', speaker: 'The disciples of Prophet Isa', title: 'We believed in what You revealed — record us among the witnesses', startAt: 'ربنا' },
  { slug: 'forgive-our-excesses', surah: 3, from: 147, group: 'rabbana', category: 'forgiveness', speaker: 'Godly men who fought alongside the prophets', title: 'Forgive our sins and our excesses, make our feet firm', startAt: 'ربنا' },
  { slug: 'people-of-understanding', surah: 3, from: 191, to: 194, group: 'rabbana', category: 'mercy', speaker: 'People of understanding, reflecting on creation', title: 'You did not create this in vain — protect us from the Fire', startAt: 'ربنا' },
  { slug: 'write-us-among-witnesses', surah: 5, from: 83, group: 'rabbana', category: 'guidance', speaker: 'Believers among the People of the Book', title: 'We have believed — write us among the witnesses', startAt: 'ربنا' },
  { slug: 'adam-prayer-for-forgiveness', surah: 7, from: 23, group: 'rabbana', category: 'forgiveness', speaker: 'Prophet Adam and Hawwa', title: 'We have wronged ourselves — forgive us and have mercy on us', startAt: 'ربنا' },
  { slug: 'not-with-the-wrongdoers', surah: 7, from: 47, group: 'rabbana', category: 'protection', speaker: 'The people of the Heights (A‘raf)', title: 'Do not place us with the wrongdoing people', startAt: 'ربنا' },
  { slug: 'judge-between-us-in-truth', surah: 7, from: 89, group: 'rabbana', category: 'difficulty', speaker: 'Prophet Shu‘ayb', title: 'Judge between us and our people in truth', startAt: 'ربنا@last' },
  { slug: 'die-as-muslims', surah: 7, from: 126, group: 'rabbana', category: 'patience', speaker: 'Pharaoh’s magicians, after believing', title: 'Pour patience upon us and let us die as Muslims', startAt: 'ربنا@last' },
  { slug: 'not-a-trial-for-the-wrongdoers', surah: 10, from: 85, to: 86, group: 'rabbana', category: 'protection', speaker: 'The people of Prophet Musa', title: 'Do not make us a trial for the wrongdoing people', startAt: 'ربنا' },
  { slug: 'you-know-what-we-conceal', surah: 14, from: 38, group: 'rabbana', category: 'mercy', speaker: 'Prophet Ibrahim', title: 'You know what we conceal and what we reveal' },
  { slug: 'establish-prayer-forgive-parents', surah: 14, from: 40, to: 41, group: 'rabbana', category: 'family', speaker: 'Prophet Ibrahim', title: 'Make me and my descendants establish prayer; forgive my parents' },
  { slug: 'people-of-the-cave', surah: 18, from: 10, group: 'rabbana', category: 'guidance', speaker: 'The youths of the Cave', title: 'Grant us mercy from Yourself and right guidance', startAt: 'ربنا' },
  { slug: 'we-have-believed-have-mercy', surah: 23, from: 109, group: 'rabbana', category: 'mercy', speaker: 'A party of Allah’s servants', title: 'We have believed — forgive us and have mercy on us', startAt: 'ربنا' },
  { slug: 'avert-the-punishment-of-hell', surah: 25, from: 65, group: 'rabbana', category: 'protection', speaker: 'The servants of the Most Merciful', title: 'Avert from us the punishment of Hell', startAt: 'ربنا' },
  { slug: 'family-as-coolness-of-eyes', surah: 25, from: 74, group: 'rabbana', category: 'family', speaker: 'The servants of the Most Merciful', title: 'Grant us spouses and children who are the coolness of our eyes', startAt: 'ربنا' },
  { slug: 'angels-pray-for-believers', surah: 40, from: 7, to: 9, group: 'rabbana', category: 'forgiveness', speaker: 'The angels who bear the Throne', title: 'The angels’ dua for the believers and their families', startAt: 'ربنا' },
  { slug: 'forgive-us-and-our-brothers', surah: 59, from: 10, group: 'rabbana', category: 'forgiveness', speaker: 'The believers who came after', title: 'Forgive us and our brothers who preceded us in faith', startAt: 'ربنا' },
  { slug: 'upon-you-we-rely', surah: 60, from: 4, group: 'rabbana', category: 'protection', speaker: 'Prophet Ibrahim and those with him', title: 'Upon You we rely, to You we turn', startAt: 'ربنا' },
  { slug: 'not-a-trial-for-disbelievers', surah: 60, from: 5, group: 'rabbana', category: 'protection', speaker: 'Prophet Ibrahim and those with him', title: 'Do not make us a trial for those who disbelieve' },
  { slug: 'perfect-our-light', surah: 66, from: 8, group: 'rabbana', category: 'forgiveness', speaker: 'The Prophet and the believers, on the Day of Judgement', title: 'Perfect our light and forgive us', startAt: 'ربنا' },

  // ── Duas of the Prophets ─────────────────────────────────────────────
  { slug: 'make-this-city-secure', surah: 2, from: 126, group: 'prophets', category: 'protection', speaker: 'Prophet Ibrahim', title: 'Make this a secure land and provide its people with fruits', startAt: 'رب' },
  { slug: 'mother-of-maryam-dedication', surah: 3, from: 35, group: 'prophets', category: 'acceptance', speaker: 'The wife of ‘Imran, mother of Maryam', title: 'I dedicate what is in my womb to You — accept it from me', startAt: 'رب' },
  { slug: 'zakariya-good-offspring', surah: 3, from: 38, group: 'prophets', category: 'family', speaker: 'Prophet Zakariya', title: 'Grant me from Yourself good offspring', startAt: 'رب' },
  { slug: 'isa-table-from-heaven', surah: 5, from: 114, group: 'prophets', category: 'gratitude', speaker: 'Prophet Isa', title: 'Send down to us a table spread from heaven', startAt: 'اللهم' },
  { slug: 'musa-forgive-me-and-my-brother', surah: 7, from: 151, group: 'prophets', category: 'forgiveness', speaker: 'Prophet Musa', title: 'Forgive me and my brother, admit us into Your mercy', startAt: 'رب' },
  { slug: 'nuh-refuge-from-asking-wrongly', surah: 11, from: 47, group: 'prophets', category: 'forgiveness', speaker: 'Prophet Nuh', title: 'I seek refuge in You from asking what I have no knowledge of', startAt: 'رب' },
  { slug: 'yusuf-die-as-muslim', surah: 12, from: 101, group: 'prophets', category: 'gratitude', speaker: 'Prophet Yusuf', title: 'Let me die as a Muslim and join me with the righteous', startAt: 'رب' },
  { slug: 'ibrahim-secure-city-no-idols', surah: 14, from: 35, group: 'prophets', category: 'protection', speaker: 'Prophet Ibrahim', title: 'Make this city secure and keep me and my sons from idols', startAt: 'رب' },
  { slug: 'mercy-for-parents', surah: 17, from: 24, group: 'prophets', category: 'family', speaker: 'Taught to every believer, for their parents', title: 'My Lord, have mercy on them as they raised me when small', startAt: 'رب' },
  { slug: 'entry-and-exit-with-truth', surah: 17, from: 80, group: 'prophets', category: 'protection', speaker: 'Taught to the Prophet ﷺ', title: 'Make my entry and my exit truthful, grant me supporting authority', startAt: 'رب' },
  { slug: 'musa-expand-my-chest', surah: 20, from: 25, to: 28, group: 'prophets', category: 'knowledge', speaker: 'Prophet Musa, sent to Pharaoh', title: 'Expand my chest, ease my task, untie my tongue', startAt: 'رب' },
  { slug: 'increase-me-in-knowledge', surah: 20, from: 114, group: 'prophets', category: 'knowledge', speaker: 'Taught to the Prophet ﷺ', title: 'My Lord, increase me in knowledge', startAt: 'رب' },
  { slug: 'ayyub-harm-has-touched-me', surah: 21, from: 83, group: 'prophets', category: 'difficulty', speaker: 'Prophet Ayyub', title: 'Harm has touched me, and You are the Most Merciful', startAt: 'أني' },
  { slug: 'yunus-in-the-darkness', surah: 21, from: 87, group: 'prophets', category: 'forgiveness', speaker: 'Prophet Yunus, in the belly of the whale', title: 'There is no god but You — glory be to You', startAt: 'أن@last' },
  { slug: 'zakariya-do-not-leave-me-alone', surah: 21, from: 89, group: 'prophets', category: 'family', speaker: 'Prophet Zakariya', title: 'Do not leave me alone, and You are the best of inheritors', startAt: 'رب' },
  { slug: 'nuh-blessed-landing', surah: 23, from: 29, group: 'prophets', category: 'protection', speaker: 'Prophet Nuh, on the Ark', title: 'Land me at a blessed landing place', startAt: 'رب' },
  { slug: 'refuge-from-devils', surah: 23, from: 97, to: 98, group: 'refuge', category: 'protection', speaker: 'Taught to the Prophet ﷺ', title: 'I seek refuge in You from the promptings of the devils', startAt: 'رب' },
  { slug: 'forgive-and-have-mercy', surah: 23, from: 118, group: 'prophets', category: 'mercy', speaker: 'Taught to the Prophet ﷺ', title: 'Forgive and have mercy — You are the best of the merciful', startAt: 'رب' },
  { slug: 'ibrahim-wisdom-and-righteous', surah: 26, from: 83, to: 85, group: 'prophets', category: 'guidance', speaker: 'Prophet Ibrahim', title: 'Grant me wisdom and join me with the righteous', startAt: 'رب' },
  { slug: 'sulayman-gratitude', surah: 27, from: 19, group: 'prophets', category: 'gratitude', speaker: 'Prophet Sulayman', title: 'Enable me to be grateful for Your favour', startAt: 'رب' },
  { slug: 'musa-i-have-wronged-myself', surah: 28, from: 16, group: 'prophets', category: 'forgiveness', speaker: 'Prophet Musa', title: 'I have wronged myself, so forgive me', startAt: 'رب' },
  { slug: 'musa-save-me', surah: 28, from: 21, group: 'prophets', category: 'protection', speaker: 'Prophet Musa, leaving Egypt', title: 'Save me from the wrongdoing people', startAt: 'رب' },
  { slug: 'musa-in-need-of-good', surah: 28, from: 24, group: 'prophets', category: 'difficulty', speaker: 'Prophet Musa, in Madyan', title: 'I am in need of whatever good You send down to me', startAt: 'رب' },
  { slug: 'lut-help-me', surah: 29, from: 30, group: 'prophets', category: 'difficulty', speaker: 'Prophet Lut', title: 'Help me against the corrupting people', startAt: 'رب' },
  { slug: 'ibrahim-righteous-child', surah: 37, from: 100, group: 'prophets', category: 'family', speaker: 'Prophet Ibrahim', title: 'Grant me a child from among the righteous', startAt: 'رب' },
  { slug: 'gratitude-for-parents', surah: 46, from: 15, group: 'prophets', category: 'gratitude', speaker: 'The righteous believer, reaching forty', title: 'Enable me to be grateful, and make my offspring righteous', startAt: 'رب' },
  { slug: 'nuh-i-am-overpowered', surah: 54, from: 10, group: 'prophets', category: 'difficulty', speaker: 'Prophet Nuh', title: 'I am overpowered, so help me', startAt: 'أني' },
  { slug: 'house-in-paradise', surah: 66, from: 11, group: 'prophets', category: 'protection', speaker: 'Asiya, the wife of Pharaoh', title: 'Build for me a house near You in Paradise', startAt: 'رب' },
  { slug: 'nuh-forgive-me-and-my-parents', surah: 71, from: 28, group: 'prophets', category: 'forgiveness', speaker: 'Prophet Nuh', title: 'Forgive me, my parents and the believers', startAt: 'رب' },

  // ── Seeking refuge ───────────────────────────────────────────────────
  { slug: 'refuge-from-ignorance', surah: 2, from: 67, group: 'refuge', category: 'protection', speaker: 'Prophet Musa', title: 'I seek refuge in Allah from being among the ignorant', startAt: 'أعوذ' },
  { slug: 'refuge-from-the-arrogant', surah: 40, from: 27, group: 'refuge', category: 'protection', speaker: 'Prophet Musa', title: 'I seek refuge in my Lord from every arrogant one', startAt: 'إني' },
  { slug: 'seeking-refuge-falaq', surah: 113, from: 1, to: 5, group: 'refuge', category: 'protection', speaker: 'Surah Al-Falaq', title: 'Refuge in the Lord of daybreak' },
  { slug: 'seeking-refuge-nas', surah: 114, from: 1, to: 6, group: 'refuge', category: 'protection', speaker: 'Surah An-Nas', title: 'Refuge in the Lord of mankind' },
];

export function getDua(slug: string): QuranicDua | undefined {
  return QURANIC_DUAS.find((d) => d.slug === slug);
}

export function duaVerseKeys(d: QuranicDua): string[] {
  const out: string[] = [];
  for (let a = d.from; a <= (d.to ?? d.from); a++) out.push(`${d.surah}:${a}`);
  return out;
}

export function duaReference(d: QuranicDua): string {
  return d.to ? `${d.surah}:${d.from}–${d.to}` : `${d.surah}:${d.from}`;
}
