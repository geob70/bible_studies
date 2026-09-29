'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  PlusCircle, 
  StickyNote as StickyIcon, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw,
  Globe,
  Layers
} from 'lucide-react';
import { BibleChapterData, BibleStudy } from '@/types/bible-study';
import { BIBLE_BOOKS, BIBLE_TRANSLATIONS, fetchBibleChapter } from '@/lib/bible-data';

interface BibleReaderProps {
  study: BibleStudy;
  onUpdateStudy: (updates: Partial<BibleStudy>) => void;
  onInsertIntoNotes: (content: string) => void;
  onAddStickyNote: (content: string) => void;
}

export default function BibleReader({
  study,
  onUpdateStudy,
  onInsertIntoNotes,
  onAddStickyNote,
}: BibleReaderProps) {
  const [chapterData, setChapterData] = useState<BibleChapterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState('web');
  const [copiedVerseIndex, setCopiedVerseIndex] = useState<number | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const currentBookInfo = BIBLE_BOOKS.find((b) => b.name === study.currentBook) || BIBLE_BOOKS[44]; // Romans

  // Load chapter data whenever book, chapter, or translation changes
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchBibleChapter(study.currentBook, study.currentChapter, translation);
        if (isMounted) {
          setChapterData(data);
        }
      } catch (e) {
        console.error('Failed to load Bible chapter', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (study.bibleMode === 'builtin') {
      load();
    }

    return () => {
      isMounted = false;
    };
  }, [study.currentBook, study.currentChapter, translation, study.bibleMode]);

  const handleBookChange = (newBook: string) => {
    onUpdateStudy({
      currentBook: newBook,
      currentChapter: 1,
      passage: `${newBook} 1`,
    });
  };

  const handleChapterChange = (newChapter: number) => {
    if (newChapter < 1 || newChapter > currentBookInfo.chapters) return;
    onUpdateStudy({
      currentChapter: newChapter,
      passage: `${study.currentBook} ${newChapter}`,
    });
  };

  const handleCopyVerse = (verseText: string, verseNum: number) => {
    const fullText = `"${verseText}" — ${study.currentBook} ${study.currentChapter}:${verseNum} (${translation.toUpperCase()})`;
    navigator.clipboard.writeText(fullText);
    setCopiedVerseIndex(verseNum);
    setTimeout(() => setCopiedVerseIndex(null), 2000);
  };

  const handleInsertVerseToNotes = (verseText: string, verseNum: number) => {
    const snippet = `<blockquote>"${verseText}" — <strong>${study.currentBook} ${study.currentChapter}:${verseNum}</strong></blockquote><p></p>`;
    onInsertIntoNotes(snippet);
  };

  const handleAddVerseToSticky = (verseText: string, verseNum: number) => {
    const noteText = `${study.currentBook} ${study.currentChapter}:${verseNum}: "${verseText}"`;
    onAddStickyNote(noteText);
  };

  return (
    <div className="bible-reader flex-1 flex flex-col h-full bg-[#ffffff] border-l border-[#2525251a] overflow-hidden select-none">
      <div className="pane-label"><span>02 &nbsp; / &nbsp; SCRIPTURE</span><BookOpen size={15} /></div>
      {/* Top Header for Reader Controls */}
      <div className="reader-controls px-4 py-2.5 border-b border-[#25252514] bg-[#f5f5f5] flex items-center justify-between gap-2">
        {study.bibleMode === 'builtin' ? (
          <>
            {/* Book Selector */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <BookOpen className="w-4 h-4 text-[#252525] shrink-0" />
              <select
                aria-label="Bible book"
                value={study.currentBook}
                onChange={(e) => handleBookChange(e.target.value)}
                className="bg-[#ffffff] border border-[#2525251a] rounded-full px-3 py-1 text-xs font-semibold text-[#252525] outline-hidden cursor-pointer truncate max-w-[150px]"
              >
                <optgroup label="New Testament">
                  {BIBLE_BOOKS.filter((b) => b.testament === 'NT').map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Old Testament">
                  {BIBLE_BOOKS.filter((b) => b.testament === 'OT').map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Chapter Navigation */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleChapterChange(study.currentChapter - 1)}
                  disabled={study.currentChapter <= 1}
                  className="btn-icon-pill w-7 h-7 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Previous Chapter"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <select
                  aria-label="Chapter"
                  value={study.currentChapter}
                  onChange={(e) => handleChapterChange(parseInt(e.target.value, 10))}
                  className="bg-[#ffffff] border border-[#2525251a] rounded-full px-2.5 py-1 text-xs font-semibold text-[#252525] outline-hidden cursor-pointer"
                >
                  {Array.from({ length: currentBookInfo.chapters }, (_, i) => i + 1).map((ch) => (
                    <option key={ch} value={ch}>
                      Ch {ch}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleChapterChange(study.currentChapter + 1)}
                  disabled={study.currentChapter >= currentBookInfo.chapters}
                  className="btn-icon-pill w-7 h-7 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Next Chapter"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Translation Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                aria-label="Translation"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="bg-[#ffffff] border border-[#2525251a] rounded-full px-2.5 py-1 text-[11px] font-medium text-[#6b6b6b] outline-hidden cursor-pointer"
              >
                {BIBLE_TRANSLATIONS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          /* Iframe header controls */
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-4 h-4 text-[#252525]" />
              <span className="text-xs font-medium text-[#6b6b6b] truncate max-w-[240px]">
                {study.bibleUrl}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIframeKey((k) => k + 1)}
                className="btn-icon-pill w-7 h-7"
                title="Reload Iframe"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
              <a
                href={study.bibleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon-pill w-7 h-7"
                title="Open in new tab"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {study.bibleMode === 'builtin' ? (
        <div className="reader-canvas flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {loading ? (
            <div className="py-20 text-center text-sm text-[#6b6b6b] flex flex-col items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
              <span>Loading {study.currentBook} {study.currentChapter}...</span>
            </div>
          ) : chapterData && chapterData.verses.length > 0 ? (
            <>
              {/* Reference Header */}
              <div className="chapter-heading mb-4 pb-2 border-b border-[#25252514] flex items-baseline justify-between">
                <h2 className="text-lg font-bold text-[#252525]">
                  {chapterData.reference}
                </h2>
                <span className="text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">
                  {chapterData.translation_name || translation.toUpperCase()}
                </span>
              </div>

              {/* Verses list */}
              <div className="verses space-y-3 font-serif">
                {chapterData.verses.map((v) => (
                  <div
                    key={v.verse}
                    className="verse group relative p-2.5 -mx-2.5 rounded-[12px] hover:bg-[#f5f5f5] transition-colors leading-relaxed"
                  >
                    <div className="text-[15px] text-[#171717] pl-6 relative">
                      <span className="absolute left-0 top-0.5 text-[11px] font-sans font-bold text-[#6b6b6b] select-none">
                        {v.verse}
                      </span>
                      {v.text}
                    </div>

                    {/* Floating quick action buttons */}
                    <div className="verse-actions opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 flex items-center gap-1 bg-[#ffffff] border border-[#2525251a] rounded-full p-1 shadow-md z-10 font-sans">
                      <button
                        onClick={() => handleInsertVerseToNotes(v.text, v.verse)}
                        className="p-1 rounded-full hover:bg-[#f5f5f5] text-[#252525] transition-colors"
                        title="Insert into notes editor"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAddVerseToSticky(v.text, v.verse)}
                        className="p-1 rounded-full hover:bg-[#f5f5f5] text-neutral-600 transition-colors"
                        title="Add to sticky note"
                      >
                        <StickyIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyVerse(v.text, v.verse)}
                        className="p-1 rounded-full hover:bg-[#f5f5f5] text-[#252525] transition-colors"
                        title="Copy verse"
                      >
                        {copiedVerseIndex === v.verse ? (
                          <Check className="w-3.5 h-3.5 text-neutral-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-sm text-[#6b6b6b]">
              No verses found for this chapter.
            </div>
          )}
        </div>
      ) : (
        /* External Iframe view */
        <div className="bible-reader flex-1 flex flex-col h-full bg-[#f5f5f5] relative">
          <iframe
            key={iframeKey}
            src={study.bibleUrl}
            title="External Bible Web App"
            className="w-full h-full border-none bg-white"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />

          {/* Fallback overlay helper if external website blocks framing */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-[16px] bg-[#ffffff]/90 backdrop-blur-md border border-[#2525251a] shadow-lg flex items-center justify-between text-xs text-[#252525]">
            <div>
              <span className="font-semibold block">Browser Frame Notice:</span>
              <span className="text-[#6b6b6b]">
                If the website does not load, its security policy may block embedding.
              </span>
            </div>
            <div className="flex gap-2">
              <a
                href={study.bibleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill text-xs py-1 px-3"
              >
                Open Tab
              </a>
              <button
                onClick={() => onUpdateStudy({ bibleMode: 'builtin' })}
                className="btn-pill btn-pill-primary text-xs py-1 px-3"
              >
                Use Built-in Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
