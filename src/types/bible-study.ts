export type StickyColor = 'yellow' | 'mint' | 'sky' | 'lavender' | 'peach' | 'rose' | 'slate';

export interface StickyNote {
  id: string;
  content: string;
  color: StickyColor;
  createdAt: string;
  updatedAt?: string;
}

export interface BibleStudy {
  id: string;
  title: string;
  passage: string;
  bibleUrl: string;
  bibleMode: 'builtin' | 'iframe';
  currentBook: string;
  currentChapter: number;
  contentHtml: string;
  stickyNotes: StickyNote[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BibleVerse {
  book_id?: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapterData {
  reference: string;
  verses: BibleVerse[];
  translation_name?: string;
  translation_id?: string;
}

export interface BibleBookInfo {
  name: string;
  testament: 'OT' | 'NT';
  chapters: number;
  abbr: string;
}
