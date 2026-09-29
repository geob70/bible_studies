'use strict';
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BibleStudy, StickyColor } from '@/types/bible-study';
import { 
  loadAllStudies, 
  loadActiveStudyId, 
  saveStudy, 
  saveActiveStudyId, 
  deleteStudy as removeStudyFromStorage, 
  createNewStudy,
  INITIAL_STUDY
} from '@/lib/storage';
import { parseScriptureReference } from '@/lib/bible-data';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import BibleReader from '@/components/BibleReader';
import StickyNotesBar from '@/components/StickyNotesBar';
import PdfExportModal from '@/components/PdfExportModal';

export default function BibleStudyApp() {
  const [studies, setStudies] = useState<BibleStudy[]>([INITIAL_STUDY]);
  const [activeStudyId, setActiveStudyId] = useState<string>(INITIAL_STUDY.id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [splitRatio, setSplitRatio] = useState(58); // 58% editor, 42% bible reader
  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);
  const [insertTrigger, setInsertTrigger] = useState<{ content: string; timestamp: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load studies from LocalStorage on mount
  useEffect(() => {
    const loadedStudies = loadAllStudies();
    const activeId = loadActiveStudyId();
    setStudies(loadedStudies);
    const exists = loadedStudies.some((s) => s.id === activeId);
    setActiveStudyId(exists ? activeId : loadedStudies[0]?.id || INITIAL_STUDY.id);
  }, []);

  const activeStudy = studies.find((s) => s.id === activeStudyId) || studies[0] || INITIAL_STUDY;

  // Auto-save debounced handler
  const handleUpdateActiveStudy = useCallback((updates: Partial<BibleStudy>) => {
    setStudies((prev) => {
      const idx = prev.findIndex((s) => s.id === activeStudyId);
      if (idx === -1) return prev;
      const updated: BibleStudy = {
        ...prev[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      const nextList = [...prev];
      nextList[idx] = updated;

      // Debounce actual save to LocalStorage
      setIsSaving(true);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveStudy(updated);
        setIsSaving(false);
      }, 500);

      return nextList;
    });
  }, [activeStudyId]);

  const handleSelectStudy = (id: string) => {
    setActiveStudyId(id);
    saveActiveStudyId(id);
    setIsSidebarOpen(false);
  };

  const handleNewStudy = (template: 'blank' | 'soap' | 'inductive' = 'blank') => {
    const newStudy = createNewStudy(template);
    setStudies((prev) => [newStudy, ...prev]);
    setActiveStudyId(newStudy.id);
    setIsSidebarOpen(false);
  };

  const handleDeleteStudy = (id: string) => {
    const nextList = removeStudyFromStorage(id);
    setStudies(nextList);
    if (activeStudyId === id) {
      setActiveStudyId(nextList[0]?.id || INITIAL_STUDY.id);
    }
  };

  const handleDuplicateStudy = (studyToCopy: BibleStudy) => {
    const duplicated: BibleStudy = {
      ...studyToCopy,
      id: `study-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${studyToCopy.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveStudy(duplicated);
    setStudies((prev) => [duplicated, ...prev]);
    setActiveStudyId(duplicated.id);
  };

  const handleReloadAllStudies = () => {
    const reloaded = loadAllStudies();
    setStudies(reloaded);
    setActiveStudyId(reloaded[0]?.id || INITIAL_STUDY.id);
  };

  // Sticky Notes handlers
  const handleAddStickyNote = (content = '', color: StickyColor = 'yellow') => {
    const nextNote = {
      id: `sn-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      content,
      color,
      createdAt: new Date().toISOString(),
    };
    handleUpdateActiveStudy({
      stickyNotes: [nextNote, ...(activeStudy.stickyNotes || [])],
    });
  };

  const handleUpdateStickyNote = (noteId: string, updates: Partial<typeof activeStudy.stickyNotes[0]>) => {
    const updatedNotes = (activeStudy.stickyNotes || []).map((n) =>
      n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    );
    handleUpdateActiveStudy({ stickyNotes: updatedNotes });
  };

  const handleDeleteStickyNote = (noteId: string) => {
    const filtered = (activeStudy.stickyNotes || []).filter((n) => n.id !== noteId);
    handleUpdateActiveStudy({ stickyNotes: filtered });
  };

  // Cross-component insertion
  const handleInsertIntoNotes = (contentHtml: string) => {
    setInsertTrigger({
      content: contentHtml,
      timestamp: Date.now(),
    });
  };

  // Search scripture reference (e.g. from top bar)
  const handleSearchScripture = (query: string) => {
    const parsed = parseScriptureReference(query);
    if (parsed) {
      handleUpdateActiveStudy({
        currentBook: parsed.book,
        currentChapter: parsed.chapter,
        passage: `${parsed.book} ${parsed.chapter}${parsed.verse ? `:${parsed.verse}` : ''}`,
      });
    }
  };

  // Split-screen mouse dragging
  const handleMouseDownSplitter = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSplitter(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplitter || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const percentage = (relativeX / rect.width) * 100;
      if (percentage >= 28 && percentage <= 75) {
        setSplitRatio(percentage);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSplitter(false);
    };

    if (isDraggingSplitter) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplitter]);

  return (
    <div className="study-app flex flex-col h-screen w-screen bg-[#ffffff] text-[#252525] overflow-hidden select-none font-sans">
      {/* Top Navigation Bar */}
      <div className="no-print">
        <TopBar
          study={activeStudy}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onUpdateStudy={handleUpdateActiveStudy}
          onNewStudy={handleNewStudy}
          onExportPdf={() => setIsPdfModalOpen(true)}
          onSearchScripture={handleSearchScripture}
          isSaving={isSaving}
        />
      </div>

      <div className="workspace-intro no-print">
        <div><span className="eyebrow">YOUR PERSONAL STUDY SPACE</span><h1>A little time in the Word.</h1></div>
        <p>Read slowly. Reflect deeply.<br />Let the words take root.</p>
      </div>
      {/* Main Workspace: Split Pane (Editor Left + Bible Reader Right) */}
      <main
        ref={containerRef}
        className="workspace flex-1 flex overflow-hidden relative no-print"
      >
        {/* Left Side: Rich Text Note Editor */}
        <section
          style={{ width: `${splitRatio}%` }}
          className="workspace-pane h-full flex flex-col min-w-[320px] overflow-hidden bg-[#ffffff]"
        >
          <Editor
            study={activeStudy}
            onUpdateStudy={handleUpdateActiveStudy}
            insertContentTrigger={insertTrigger}
          />
        </section>

        {/* Draggable Splitter Handle */}
        <div
          onMouseDown={handleMouseDownSplitter}
          className="pane-splitter w-2.5 bg-[#f5f5f5] hover:bg-[#eaeaea] active:bg-[#171717]/20 cursor-col-resize flex items-center justify-center border-x border-[#25252514] transition-colors select-none group z-10"
          title="Drag to resize Notes and Bible pane"
        >
          <div className="w-1 h-8 rounded-full bg-[#a1a1a1] group-hover:bg-[#171717] transition-colors" />
        </div>

        {/* Right Side: Built-in Bible Reader or Iframe Web App */}
        <section
          style={{ width: `${100 - splitRatio}%` }}
          className="workspace-pane h-full flex flex-col min-w-[320px] overflow-hidden bg-[#ffffff]"
        >
          <BibleReader
            study={activeStudy}
            onUpdateStudy={handleUpdateActiveStudy}
            onInsertIntoNotes={handleInsertIntoNotes}
            onAddStickyNote={(text) => handleAddStickyNote(text, 'yellow')}
          />
        </section>
      </main>

      {/* Bottom Section: Sticky Notes Bar */}
      <footer className="no-print shrink-0">
        <StickyNotesBar
          stickyNotes={activeStudy.stickyNotes || []}
          onAddStickyNote={handleAddStickyNote}
          onUpdateStickyNote={handleUpdateStickyNote}
          onDeleteStickyNote={handleDeleteStickyNote}
          onInsertIntoNotes={handleInsertIntoNotes}
        />
      </footer>

      {/* Slide-over Archive Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        studies={studies}
        activeStudyId={activeStudyId}
        onSelectStudy={handleSelectStudy}
        onNewStudy={handleNewStudy}
        onDeleteStudy={handleDeleteStudy}
        onDuplicateStudy={handleDuplicateStudy}
        onReloadAllStudies={handleReloadAllStudies}
      />

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        study={activeStudy}
      />

      {/* Clean Native Print Layout (Hidden on screen, shown when printing) */}
      <div className="hidden print:block p-8 bg-white text-black font-sans leading-relaxed">
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            BIBLE STUDY NOTES
          </div>
          <h1 className="text-3xl font-bold mt-1 text-black">
            {activeStudy.title || 'Untitled Bible Study'}
          </h1>
          <div className="mt-2 flex gap-3 text-sm text-gray-700">
            <span className="font-semibold">{activeStudy.passage}</span>
            <span>•</span>
            <span suppressHydrationWarning>
              {new Date(activeStudy.updatedAt || activeStudy.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div 
          className="tiptap-editor-content print:text-base mb-8"
          dangerouslySetInnerHTML={{ __html: activeStudy.contentHtml }} 
        />

        {activeStudy.stickyNotes?.length > 0 && (
          <div className="print-reflections mt-10 pt-6 border-t-2 border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-black">Study Insights & Sticky Notes</h2>
            <div className="grid grid-cols-2 gap-4">
              {activeStudy.stickyNotes.map((note) => (
                <div key={note.id} className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-xs">
                  <p className="font-medium text-gray-800 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
