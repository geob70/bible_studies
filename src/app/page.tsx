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
import { BookOpen, FileText, StickyNote, X, Check, Trash2 } from 'lucide-react';

export default function BibleStudyApp() {
  const [studies, setStudies] = useState<BibleStudy[]>([INITIAL_STUDY]);
  const [activeStudyId, setActiveStudyId] = useState<string>(INITIAL_STUDY.id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [splitRatio, setSplitRatio] = useState(58); // 58% editor, 42% bible reader
  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);
  const [insertTrigger, setInsertTrigger] = useState<{ content: string; timestamp: number } | null>(null);
  const [mobileTab, setMobileTab] = useState<'bible' | 'notes'>('bible');
  const [isMobileStickyOpen, setIsMobileStickyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; id: number } | null>(null);
  const [studyToDelete, setStudyToDelete] = useState<{ id: string; title: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((text: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage({ text, id: Date.now() });
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

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
    showToast('New study created');
  };

  const handleDeleteStudy = (id: string) => {
    const nextList = removeStudyFromStorage(id);
    setStudies(nextList);
    if (activeStudyId === id) {
      setActiveStudyId(nextList[0]?.id || INITIAL_STUDY.id);
    }
    showToast('Study deleted');
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
    showToast('Study duplicated');
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
    showToast('Added to sticky notes');
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
    showToast('Sticky note removed');
  };

  // Cross-component insertion
  const handleInsertIntoNotes = (contentHtml: string) => {
    setInsertTrigger({
      content: contentHtml,
      timestamp: Date.now(),
    });
    // Auto-switch to Notes tab on mobile
    setMobileTab('notes');
    setIsMobileStickyOpen(false);
    showToast('Inserted into notes');
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

      <div className="workspace-intro no-print hidden md:flex">
        <div><span className="eyebrow">YOUR PERSONAL STUDY SPACE</span><h1>A little time in the Word.</h1></div>
        <p>Read slowly. Reflect deeply.<br />Let the words take root.</p>
      </div>
      {/* Main Workspace: Split Pane on Desktop, Single View on Mobile */}
      <main
        ref={containerRef}
        className="workspace flex-1 flex overflow-hidden relative no-print"
      >
        {/* Left Side: Rich Text Note Editor */}
        <section
          style={{ width: `${splitRatio}%` }}
          className={`workspace-pane workspace-pane-editor h-full flex flex-col min-w-0 md:min-w-[320px] overflow-hidden bg-[#ffffff] transition-opacity duration-150 ${
            mobileTab === 'notes'
              ? 'w-full flex'
              : 'max-md:absolute max-md:inset-0 max-md:invisible max-md:opacity-0 max-md:pointer-events-none'
          }`}
        >
          <Editor
            study={activeStudy}
            onUpdateStudy={handleUpdateActiveStudy}
            insertContentTrigger={insertTrigger}
          />
        </section>

        {/* Draggable Splitter Handle (Desktop Only) */}
        <div
          onMouseDown={handleMouseDownSplitter}
          className="pane-splitter hidden md:flex w-2.5 bg-[#f5f5f5] hover:bg-[#eaeaea] active:bg-[#171717]/20 cursor-col-resize items-center justify-center border-x border-[#25252514] transition-colors select-none group z-10"
          title="Drag to resize Notes and Bible pane"
        >
          <div className="w-1 h-8 rounded-full bg-[#a1a1a1] group-hover:bg-[#171717] transition-colors" />
        </div>

        {/* Right Side: Built-in Bible Reader or Iframe Web App */}
        <section
          style={{ width: `${100 - splitRatio}%` }}
          className={`workspace-pane workspace-pane-bible h-full flex flex-col min-w-0 md:min-w-[320px] overflow-hidden bg-[#ffffff] transition-opacity duration-150 ${
            mobileTab === 'bible'
              ? 'w-full flex'
              : 'max-md:absolute max-md:inset-0 max-md:invisible max-md:opacity-0 max-md:pointer-events-none'
          }`}
        >
          <BibleReader
            study={activeStudy}
            onUpdateStudy={handleUpdateActiveStudy}
            onInsertIntoNotes={handleInsertIntoNotes}
            onAddStickyNote={(text) => handleAddStickyNote(text, 'yellow')}
          />
        </section>
      </main>

      {/* Bottom Section: Sticky Notes Bar (Desktop Only) */}
      <footer className="no-print shrink-0 hidden md:block">
        <StickyNotesBar
          stickyNotes={activeStudy.stickyNotes || []}
          onAddStickyNote={handleAddStickyNote}
          onUpdateStickyNote={handleUpdateStickyNote}
          onDeleteStickyNote={handleDeleteStickyNote}
          onInsertIntoNotes={handleInsertIntoNotes}
        />
      </footer>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <nav className="mobile-bottom-nav md:hidden shrink-0 bg-[#ffffff] border border-[#25252514] border-b-0 rounded-t-[24px] px-4 py-2 flex items-center justify-between z-30 select-none pb-[max(10px,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
        {/* 2 Primary Tabs: Bible & Notes */}
        <div className="flex items-center gap-2 flex-1 max-w-[270px]">
          <button
            onClick={() => setMobileTab('bible')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mobileTab === 'bible'
                ? 'bg-[#171717] text-[#ffffff] shadow-xs'
                : 'bg-[#f5f5f5] text-[#6b6b6b] hover:text-[#171717] active:scale-95'
            }`}
            title="Bible Reader"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bible</span>
          </button>

          <button
            onClick={() => setMobileTab('notes')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mobileTab === 'notes'
                ? 'bg-[#171717] text-[#ffffff] shadow-xs'
                : 'bg-[#f5f5f5] text-[#6b6b6b] hover:text-[#171717] active:scale-95'
            }`}
            title="Study Notes"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>
        </div>

        {/* Sticky Notes Slide-Up Drawer Button */}
        <button
          onClick={() => setIsMobileStickyOpen(true)}
          className="flex items-center gap-1.5 py-2 px-3 rounded-full text-xs font-medium bg-[#f5f5f5] hover:bg-[#eaeaea] text-[#252525] border border-[#25252514] transition-all active:scale-95 ml-2 cursor-pointer"
          title="Open Sticky Notes"
        >
          <StickyNote className="w-3.5 h-3.5 text-[#252525]" />
          <span>Stickies</span>
          <span className="w-5 h-5 rounded-full bg-[#ffffff] border border-[#2525251a] flex items-center justify-center text-[10px] font-bold text-[#171717]">
            {activeStudy.stickyNotes?.length || 0}
          </span>
        </button>
      </nav>

      {/* Mobile Sticky Notes Drawer / Sheet */}
      {isMobileStickyOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileStickyOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative bg-[#ffffff] rounded-t-[24px] border-t border-[#2525251a] shadow-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="px-4 py-3 border-b border-[#25252514] flex items-center justify-between bg-[#fbfbfb]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs tracking-wider uppercase text-[#171717]">
                  Thoughts to Keep
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#f0f0f0] text-[11px] font-semibold text-[#252525]">
                  {activeStudy.stickyNotes?.length || 0}
                </span>
              </div>
              <button
                onClick={() => setIsMobileStickyOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#eaeaea] text-[#6b6b6b] hover:text-[#171717] transition-colors cursor-pointer"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body: Sticky Notes Bar */}
            <div className="overflow-y-auto p-2 bg-[#f5f5f5]">
              <StickyNotesBar
                stickyNotes={activeStudy.stickyNotes || []}
                onAddStickyNote={handleAddStickyNote}
                onUpdateStickyNote={handleUpdateStickyNote}
                onDeleteStickyNote={handleDeleteStickyNote}
                onInsertIntoNotes={handleInsertIntoNotes}
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Global Toast Notification */}
      {toastMessage && (
        <div
          key={toastMessage.id}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-[#171717] text-[#ffffff] px-4 py-2 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-3 duration-200 select-none pointer-events-none"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Slide-over Archive Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        studies={studies}
        activeStudyId={activeStudyId}
        onSelectStudy={handleSelectStudy}
        onNewStudy={handleNewStudy}
        onDeleteStudy={(study) => setStudyToDelete({ id: study.id, title: study.title || 'Untitled Study' })}
        onDuplicateStudy={handleDuplicateStudy}
        onReloadAllStudies={handleReloadAllStudies}
      />

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        study={activeStudy}
      />

      {/* Custom Delete Confirmation Modal (Centered in Exact Middle of Page) */}
      {studyToDelete && (
        <div
          onClick={() => setStudyToDelete(null)}
          className="no-print fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#ffffff] rounded-[24px] border border-[#2525251a] p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#171717] mb-1.5">
              Delete Bible Study?
            </h3>
            <p className="text-xs text-[#6b6b6b] leading-relaxed mb-5">
              Are you sure you want to delete <span className="font-semibold text-[#171717]">"{studyToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setStudyToDelete(null)}
                className="btn-pill flex-1 text-xs py-2 justify-center cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteStudy(studyToDelete.id);
                  setStudyToDelete(null);
                }}
                className="btn-pill btn-pill-primary flex-1 text-xs py-2 justify-center bg-red-600 hover:bg-red-700 border-red-600 text-white cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
            <span>{new Date(activeStudy.updatedAt || activeStudy.createdAt).toLocaleDateString()}</span>
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
