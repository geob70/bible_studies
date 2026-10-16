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
  { id: 'niv', name: 'New International Version (NIV)' },
  { id: 'web', name: 'World English Bible (WEB)' },
  { id: 'kjv', name: 'King James Version (KJV)' },
  { id: 'bbe', name: 'Bible in Basic English (BBE)' },
  { id: 'oeb-cw', name: 'Open English Bible (OEB)' },
];

export const PRELOADED_ROMANS_8_NIV: BibleChapterData = {
  reference: 'Romans 8',
  translation_name: 'New International Version (NIV)',
  translation_id: 'niv',
  verses: [
    { book_name: 'Romans', chapter: 8, verse: 1, text: 'Therefore, there is now no condemnation for those who are in Christ Jesus,' },
    { book_name: 'Romans', chapter: 8, verse: 2, text: 'because through Christ Jesus the law of the Spirit who gives life has set you free from the law of sin and death.' },
    { book_name: 'Romans', chapter: 8, verse: 3, text: 'For what the law was powerless to do because it was weakened by the flesh, God did by sending his own Son in the likeness of sinful flesh to be a sin offering. And so he condemned sin in the flesh,' },
    { book_name: 'Romans', chapter: 8, verse: 4, text: 'in order that the righteous requirement of the law might be fully met in us, who do not live according to the flesh but according to the Spirit.' },
    { book_name: 'Romans', chapter: 8, verse: 5, text: 'Those who live according to the flesh have their minds set on what the flesh desires; but those who live in accordance with the Spirit have their minds set on what the Spirit desires.' },
    { book_name: 'Romans', chapter: 8, verse: 6, text: 'The mind governed by the flesh is death, but the mind governed by the Spirit is life and peace.' },
    { book_name: 'Romans', chapter: 8, verse: 7, text: 'The mind governed by the flesh is hostile to God; it does not submit to God\'s law, nor can it do so.' },
    { book_name: 'Romans', chapter: 8, verse: 8, text: 'Those who are in the realm of the flesh cannot please God.' },
    { book_name: 'Romans', chapter: 8, verse: 9, text: 'You, however, are not in the realm of the flesh but are in the realm of the Spirit, if indeed the Spirit of God lives in you. And if anyone does not have the Spirit of Christ, they do not belong to Christ.' },
    { book_name: 'Romans', chapter: 8, verse: 10, text: 'But if Christ is in you, then even though your body is subject to death because of sin, the Spirit gives life because of righteousness.' },
    { book_name: 'Romans', chapter: 8, verse: 11, text: 'And if the Spirit of him who raised Jesus from the dead is living in you, he who raised Christ from the dead will also give life to your mortal bodies because of his Spirit who lives in you.' },
    { book_name: 'Romans', chapter: 8, verse: 12, text: 'Therefore, brothers and sisters, we have an obligation—but it is not to the flesh, to live according to it.' },
    { book_name: 'Romans', chapter: 8, verse: 13, text: 'For if you live according to the flesh, you will die; but if by the Spirit you put to death the misdeeds of the body, you will live.' },
    { book_name: 'Romans', chapter: 8, verse: 14, text: 'For those who are led by the Spirit of God are the children of God.' },
    { book_name: 'Romans', chapter: 8, verse: 15, text: 'The Spirit you received does not make you slaves, so that you live in fear again; rather, the Spirit you received brought about your adoption to sonship. And by him we cry, “Abba, Father.”' },
    { book_name: 'Romans', chapter: 8, verse: 16, text: 'The Spirit himself testifies with our spirit that we are God\'s children.' },
    { book_name: 'Romans', chapter: 8, verse: 17, text: 'Now if we are children, then we are heirs—heirs of God and co-heirs with Christ, if indeed we share in his sufferings in order that we may also share in his glory.' },
    { book_name: 'Romans', chapter: 8, verse: 18, text: 'I consider that our present sufferings are not worth comparing with the glory that will be revealed in us.' },
    { book_name: 'Romans', chapter: 8, verse: 19, text: 'For the creation waits in eager expectation for the children of God to be revealed.' },
    { book_name: 'Romans', chapter: 8, verse: 20, text: 'For the creation was subjected to frustration, not by its own choice, but by the will of the one who subjected it, in hope' },
    { book_name: 'Romans', chapter: 8, verse: 21, text: 'that the creation itself will be liberated from its bondage to decay and brought into the freedom and glory of the children of God.' },
    { book_name: 'Romans', chapter: 8, verse: 22, text: 'We know that the whole creation has been groaning as in the pains of childbirth right up to the present time.' },
    { book_name: 'Romans', chapter: 8, verse: 23, text: 'Not only so, but we ourselves, who have the firstfruits of the Spirit, groan inwardly as we wait eagerly for our adoption to sonship, the redemption of our bodies.' },
    { book_name: 'Romans', chapter: 8, verse: 24, text: 'For in this hope we were saved. But hope that is seen is no hope at all. Who hopes for what they already have?' },
    { book_name: 'Romans', chapter: 8, verse: 25, text: 'But if we hope for what we do not yet have, we wait for it patiently.' },
    { book_name: 'Romans', chapter: 8, verse: 26, text: 'In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans.' },
    { book_name: 'Romans', chapter: 8, verse: 27, text: 'And he who searches our hearts knows the mind of the Spirit, because the Spirit intercedes for God\'s people in accordance with the will of God.' },
    { book_name: 'Romans', chapter: 8, verse: 28, text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
    { book_name: 'Romans', chapter: 8, verse: 29, text: 'For those God foreknew he also predestined to be conformed to the image of his Son, that he might be the firstborn among many brothers and sisters.' },
    { book_name: 'Romans', chapter: 8, verse: 30, text: 'And those he predestined, he also called; those he called, he also justified; those he justified, he also glorified.' },
    { book_name: 'Romans', chapter: 8, verse: 31, text: 'What, then, shall we say in response to these things? If God is for us, who can be against us?' },
    { book_name: 'Romans', chapter: 8, verse: 32, text: 'He who did not spare his own Son, but gave him up for us all—how will he not also, along with him, graciously give us all things?' },
    { book_name: 'Romans', chapter: 8, verse: 33, text: 'Who will bring any charge against those whom God has chosen? It is God who justifies.' },
    { book_name: 'Romans', chapter: 8, verse: 34, text: 'Who then is the one who condemns? No one. Christ Jesus who died—more than that, who was raised to life—is at the right hand of God and is also interceding for us.' },
    { book_name: 'Romans', chapter: 8, verse: 35, text: 'Who shall separate us from the love of Christ? Shall trouble or hardship or persecution or famine or nakedness or danger or sword?' },
    { book_name: 'Romans', chapter: 8, verse: 36, text: 'As it is written: “For your sake we face death all day long; we are considered as sheep to be slaughtered.”' },
    { book_name: 'Romans', chapter: 8, verse: 37, text: 'No, in all these things we are more than conquerors through him who loved us.' },
    { book_name: 'Romans', chapter: 8, verse: 38, text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers,' },
    { book_name: 'Romans', chapter: 8, verse: 39, text: 'neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.' },
  ],
};

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
const nivBookCache = new Map<string, any>();

async function fetchNivChapter(bookName: string, chapter: number): Promise<BibleChapterData> {
  const matchedBook = BIBLE_BOOKS.find(
    (b) => b.name.toLowerCase() === bookName.toLowerCase() || b.abbr.toLowerCase() === bookName.toLowerCase()
  );
  const canonicalBook = matchedBook ? matchedBook.name : bookName;
  const fileName = canonicalBook === 'Song of Solomon' ? 'Song Of Solomon' : canonicalBook;
  const normalizedKey = fileName.toLowerCase();

  let bookData = nivBookCache.get(normalizedKey);

  if (!bookData) {
    try {
      const localUrl = `/bible/niv/${encodeURIComponent(fileName)}.json`;
      const res = await fetch(localUrl);
      if (res.ok) {
        bookData = await res.json();
        nivBookCache.set(normalizedKey, bookData);
      }
    } catch {
      // Local fetch failed, fallback to GitHub raw
    }
  }

  if (!bookData) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/aruljohn/Bible-niv/main/${encodeURIComponent(fileName)}.json`;
      const res = await fetch(rawUrl);
      if (res.ok) {
        bookData = await res.json();
        nivBookCache.set(normalizedKey, bookData);
      }
    } catch (e) {
      console.error('Failed to fetch NIV from GitHub raw', e);
    }
  }

  if (bookData && Array.isArray(bookData.chapters)) {
    const chapterObj = bookData.chapters.find((c: any) => String(c.chapter) === String(chapter));
    if (chapterObj && Array.isArray(chapterObj.verses)) {
      return {
        reference: `${canonicalBook} ${chapter}`,
        translation_name: 'New International Version (NIV)',
        translation_id: 'niv',
        verses: chapterObj.verses.map((v: any) => ({
          book_name: canonicalBook,
          chapter,
          verse: parseInt(v.verse, 10) || 1,
          text: (v.text || '').replace(/`/g, "'").trim(),
        })),
      };
    }
  }

  throw new Error(`NIV chapter ${canonicalBook} ${chapter} not found`);
}

export async function fetchBibleChapter(
  bookName: string,
  chapter: number,
  translation = 'niv'
): Promise<BibleChapterData> {
  const cacheKey = `${bookName.toLowerCase()}_${chapter}_${translation}`;

  // Check preloaded first
  if (bookName.toLowerCase() === 'romans' && chapter === 8) {
    if (translation === 'niv') return PRELOADED_ROMANS_8_NIV;
    if (translation === 'web') return PRELOADED_ROMANS_8;
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

  // Special handling for NIV
  if (translation === 'niv') {
    try {
      const formatted = await fetchNivChapter(bookName, chapter);
      chapterCache.set(cacheKey, formatted);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`bible_cache_${cacheKey}`, JSON.stringify(formatted));
        } catch {}
      }
      return formatted;
    } catch (err) {
      console.warn('NIV fetch error, falling back to WEB', err);
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
