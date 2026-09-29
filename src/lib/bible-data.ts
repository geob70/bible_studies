import { BibleBookInfo, BibleChapterData, BibleVerse } from '@/types/bible-study';

export const BIBLE_BOOKS: BibleBookInfo[] = [
  // Old Testament
  { name: 'Genesis', testament: 'OT', chapters: 50, abbr: 'GEN' },
  { name: 'Exodus', testament: 'OT', chapters: 40, abbr: 'EXO' },
  { name: 'Leviticus', testament: 'OT', chapters: 27, abbr: 'LEV' },
  { name: 'Numbers', testament: 'OT', chapters: 36, abbr: 'NUM' },
  { name: 'Deuteronomy', testament: 'OT', chapters: 34, abbr: 'DEU' },
  { name: 'Joshua', testament: 'OT', chapters: 24, abbr: 'JOS' },
  { name: 'Judges', testament: 'OT', chapters: 21, abbr: 'JDG' },
  { name: 'Ruth', testament: 'OT', chapters: 4, abbr: 'RUT' },
  { name: '1 Samuel', testament: 'OT', chapters: 31, abbr: '1SA' },
  { name: '2 Samuel', testament: 'OT', chapters: 24, abbr: '2SA' },
  { name: '1 Kings', testament: 'OT', chapters: 22, abbr: '1KI' },
  { name: '2 Kings', testament: 'OT', chapters: 25, abbr: '2KI' },
  { name: '1 Chronicles', testament: 'OT', chapters: 29, abbr: '1CH' },
  { name: '2 Chronicles', testament: 'OT', chapters: 36, abbr: '2CH' },
  { name: 'Ezra', testament: 'OT', chapters: 10, abbr: 'EZR' },
  { name: 'Nehemiah', testament: 'OT', chapters: 13, abbr: 'NEH' },
  { name: 'Esther', testament: 'OT', chapters: 10, abbr: 'EST' },
  { name: 'Job', testament: 'OT', chapters: 42, abbr: 'JOB' },
  { name: 'Psalms', testament: 'OT', chapters: 150, abbr: 'PSA' },
  { name: 'Proverbs', testament: 'OT', chapters: 31, abbr: 'PRO' },
  { name: 'Ecclesiastes', testament: 'OT', chapters: 12, abbr: 'ECC' },
  { name: 'Song of Solomon', testament: 'OT', chapters: 8, abbr: 'SNG' },
  { name: 'Isaiah', testament: 'OT', chapters: 66, abbr: 'ISA' },
  { name: 'Jeremiah', testament: 'OT', chapters: 52, abbr: 'JER' },
  { name: 'Lamentations', testament: 'OT', chapters: 5, abbr: 'LAM' },
  { name: 'Ezekiel', testament: 'OT', chapters: 48, abbr: 'EZK' },
  { name: 'Daniel', testament: 'OT', chapters: 12, abbr: 'DAN' },
  { name: 'Hosea', testament: 'OT', chapters: 14, abbr: 'HOS' },
  { name: 'Joel', testament: 'OT', chapters: 3, abbr: 'JOL' },
  { name: 'Amos', testament: 'OT', chapters: 9, abbr: 'AMO' },
  { name: 'Obadiah', testament: 'OT', chapters: 1, abbr: 'OBA' },
  { name: 'Jonah', testament: 'OT', chapters: 4, abbr: 'JON' },
  { name: 'Micah', testament: 'OT', chapters: 7, abbr: 'MIC' },
  { name: 'Nahum', testament: 'OT', chapters: 3, abbr: 'NAM' },
  { name: 'Habakkuk', testament: 'OT', chapters: 3, abbr: 'HAB' },
  { name: 'Zephaniah', testament: 'OT', chapters: 3, abbr: 'ZEP' },
  { name: 'Haggai', testament: 'OT', chapters: 2, abbr: 'HAG' },
  { name: 'Zechariah', testament: 'OT', chapters: 14, abbr: 'ZEC' },
  { name: 'Malachi', testament: 'OT', chapters: 4, abbr: 'MAL' },

  // New Testament
  { name: 'Matthew', testament: 'NT', chapters: 28, abbr: 'MAT' },
  { name: 'Mark', testament: 'NT', chapters: 16, abbr: 'MRK' },
  { name: 'Luke', testament: 'NT', chapters: 24, abbr: 'LUK' },
  { name: 'John', testament: 'NT', chapters: 21, abbr: 'JHN' },
  { name: 'Acts', testament: 'NT', chapters: 28, abbr: 'ACT' },
  { name: 'Romans', testament: 'NT', chapters: 16, abbr: 'ROM' },
  { name: '1 Corinthians', testament: 'NT', chapters: 16, abbr: '1CO' },
  { name: '2 Corinthians', testament: 'NT', chapters: 13, abbr: '2CO' },
  { name: 'Galatians', testament: 'NT', chapters: 6, abbr: 'GAL' },
  { name: 'Ephesians', testament: 'NT', chapters: 6, abbr: 'EPH' },
  { name: 'Philippians', testament: 'NT', chapters: 4, abbr: 'PHP' },
  { name: 'Colossians', testament: 'NT', chapters: 4, abbr: 'COL' },
  { name: '1 Thessalonians', testament: 'NT', chapters: 5, abbr: '1TH' },
  { name: '2 Thessalonians', testament: 'NT', chapters: 3, abbr: '2TH' },
  { name: '1 Timothy', testament: 'NT', chapters: 6, abbr: '1TI' },
  { name: '2 Timothy', testament: 'NT', chapters: 4, abbr: '2TI' },
  { name: 'Titus', testament: 'NT', chapters: 3, abbr: 'TIT' },
  { name: 'Philemon', testament: 'NT', chapters: 1, abbr: 'PHM' },
  { name: 'Hebrews', testament: 'NT', chapters: 13, abbr: 'HEB' },
  { name: 'James', testament: 'NT', chapters: 5, abbr: 'JAS' },
  { name: '1 Peter', testament: 'NT', chapters: 5, abbr: '1PE' },
  { name: '2 Peter', testament: 'NT', chapters: 3, abbr: '2PE' },
  { name: '1 John', testament: 'NT', chapters: 5, abbr: '1JN' },
  { name: '2 John', testament: 'NT', chapters: 1, abbr: '2JN' },
  { name: '3 John', testament: 'NT', chapters: 1, abbr: '3JN' },
  { name: 'Jude', testament: 'NT', chapters: 1, abbr: 'JUD' },
  { name: 'Revelation', testament: 'NT', chapters: 22, abbr: 'REV' },
];

export const BIBLE_TRANSLATIONS = [
  { id: 'web', name: 'World English Bible (WEB)' },
  { id: 'kjv', name: 'King James Version (KJV)' },
  { id: 'bbe', name: 'Bible in Basic English (BBE)' },
  { id: 'oeb-cw', name: 'Open English Bible (OEB)' },
];

// Offline instant starter data for Romans 8 (World English Bible)
export const PRELOADED_ROMANS_8: BibleChapterData = {
  reference: 'Romans 8',
  translation_name: 'World English Bible',
  verses: [
    { book_name: 'Romans', chapter: 8, verse: 1, text: 'There is therefore now no condemnation to those who are in Christ Jesus, who don’t walk according to the flesh, but according to the Spirit.' },
    { book_name: 'Romans', chapter: 8, verse: 2, text: 'For the law of the Spirit of life in Christ Jesus made me free from the law of sin and of death.' },
    { book_name: 'Romans', chapter: 8, verse: 3, text: 'For what the law couldn’t do, in that it was weak through the flesh, God did, sending his own Son in the likeness of sinful flesh and for sin, he condemned sin in the flesh;' },
    { book_name: 'Romans', chapter: 8, verse: 4, text: 'that the ordinance of the law might be fulfilled in us, who walk not after the flesh, but after the Spirit.' },
    { book_name: 'Romans', chapter: 8, verse: 5, text: 'For those who live according to the flesh set their minds on the things of the flesh, but those who live according to the Spirit, the things of the Spirit.' },
    { book_name: 'Romans', chapter: 8, verse: 6, text: 'For the mind of the flesh is death, but the mind of the Spirit is life and peace;' },
    { book_name: 'Romans', chapter: 8, verse: 7, text: 'because the mind of the flesh is hostile towards God; for it is not subject to God’s law, neither indeed can it be.' },
    { book_name: 'Romans', chapter: 8, verse: 8, text: 'Those who are in the flesh can’t please God.' },
    { book_name: 'Romans', chapter: 8, verse: 9, text: 'But you are not in the flesh but in the Spirit, if it is so that the Spirit of God dwells in you. But if any man doesn’t have the Spirit of Christ, he is not his.' },
    { book_name: 'Romans', chapter: 8, verse: 10, text: 'If Christ is in you, the body is dead because of sin, but the spirit is alive because of righteousness.' },
    { book_name: 'Romans', chapter: 8, verse: 11, text: 'But if the Spirit of him who raised up Jesus from the dead dwells in you, he who raised up Christ Jesus from the dead will also give life to your mortal bodies through his Spirit who dwells in you.' },
    { book_name: 'Romans', chapter: 8, verse: 14, text: 'For as many as are led by the Spirit of God, these are children of God.' },
    { book_name: 'Romans', chapter: 8, verse: 15, text: 'For you didn’t receive the spirit of bond again to fear, but you received the Spirit of adoption, by whom we cry, “Abba! Father!”' },
    { book_name: 'Romans', chapter: 8, verse: 16, text: 'The Spirit himself testifies with our spirit that we are children of God;' },
    { book_name: 'Romans', chapter: 8, verse: 17, text: 'and if children, then heirs; heirs of God, and joint heirs with Christ; if indeed we suffer with him, that we may also be glorified with him.' },
    { book_name: 'Romans', chapter: 8, verse: 28, text: 'We know that all things work together for good for those who love God, to those who are called according to his purpose.' },
    { book_name: 'Romans', chapter: 8, verse: 31, text: 'What then shall we say about these things? If God is for us, who can be against us?' },
    { book_name: 'Romans', chapter: 8, verse: 37, text: 'No, in all these things, we are more than conquerors through him who loved us.' },
    { book_name: 'Romans', chapter: 8, verse: 38, text: 'For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers,' },
    { book_name: 'Romans', chapter: 8, verse: 39, text: 'nor height, nor depth, nor any other created thing, will be able to separate us from the love of God, which is in Christ Jesus our Lord.' },
  ],
};

// Psalm 23 preloaded
export const PRELOADED_PSALM_23: BibleChapterData = {
  reference: 'Psalms 23',
  translation_name: 'World English Bible',
  verses: [
    { book_name: 'Psalms', chapter: 23, verse: 1, text: 'Yahweh is my shepherd: I shall lack nothing.' },
    { book_name: 'Psalms', chapter: 23, verse: 2, text: 'He makes me lie down in green pastures. He leads me beside still waters.' },
    { book_name: 'Psalms', chapter: 23, verse: 3, text: 'He restores my soul. He guides me in the paths of righteousness for his name’s sake.' },
    { book_name: 'Psalms', chapter: 23, verse: 4, text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.' },
    { book_name: 'Psalms', chapter: 23, verse: 5, text: 'You prepare a table before me in the presence of my enemies. You have anointed my head with oil. My cup runs over.' },
    { book_name: 'Psalms', chapter: 23, verse: 6, text: 'Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh’s house forever.' },
  ],
};

const chapterCache = new Map<string, BibleChapterData>();

export async function fetchBibleChapter(
  bookName: string,
  chapter: number,
  translation = 'web'
): Promise<BibleChapterData> {
  const cacheKey = `${bookName.toLowerCase()}_${chapter}_${translation}`;

  // Check preloaded first
  if (bookName.toLowerCase() === 'romans' && chapter === 8 && translation === 'web') {
    return PRELOADED_ROMANS_8;
  }
  if (bookName.toLowerCase().startsWith('psalm') && chapter === 23 && translation === 'web') {
    return PRELOADED_PSALM_23;
  }

  // Check memory cache
  if (chapterCache.has(cacheKey)) {
    return chapterCache.get(cacheKey)!;
  }

  // Check local storage cache
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`bible_cache_${cacheKey}`);
      if (stored) {
        const parsed = JSON.parse(stored) as BibleChapterData;
        chapterCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch {
      // Ignore local storage error
    }
  }

  // Fetch from Bible API
  const query = encodeURIComponent(`${bookName} ${chapter}`);
  const url = `https://bible-api.com/${query}?translation=${translation}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load chapter (${res.status})`);
    }
    const data = await res.json();

    const formatted: BibleChapterData = {
      reference: data.reference || `${bookName} ${chapter}`,
      translation_name: data.translation_name || translation.toUpperCase(),
      translation_id: data.translation_id || translation,
      verses: (data.verses || []).map((v: { book_name: string; chapter: number; verse: number; text: string }) => ({
        book_name: v.book_name || bookName,
        chapter: v.chapter || chapter,
        verse: v.verse,
        text: (v.text || '').trim(),
      })),
    };

    chapterCache.set(cacheKey, formatted);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`bible_cache_${cacheKey}`, JSON.stringify(formatted));
      } catch {
        // quota exceeded or private mode, safe to ignore
      }
    }

    return formatted;
  } catch (err) {
    console.error('Error fetching Bible chapter:', err);
    // Fallback if network fails
    if (bookName.toLowerCase() === 'romans') return PRELOADED_ROMANS_8;
    return {
      reference: `${bookName} ${chapter}`,
      verses: [
        {
          book_name: bookName,
          chapter,
          verse: 1,
          text: `[Offline note] Could not fetch ${bookName} ${chapter} live. Please verify network connection or select another chapter.`,
        },
      ],
    };
  }
}

export function parseScriptureReference(input: string): { book: string; chapter: number; verse?: number } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Handles: "1 John 3", "Romans 8:28", "John 3", "Psalms 23"
  const regex = /^((?:[1-3]\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+)(?::(\d+))?$/i;
  const match = trimmed.match(regex);
  if (!match) return null;

  const rawBook = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const verse = match[3] ? parseInt(match[3], 10) : undefined;

  const foundBook = BIBLE_BOOKS.find(
    (b) => b.name.toLowerCase() === rawBook.toLowerCase() || b.abbr.toLowerCase() === rawBook.toLowerCase()
  );

  return {
    book: foundBook ? foundBook.name : rawBook,
    chapter: isNaN(chapter) ? 1 : chapter,
    verse,
  };
}
