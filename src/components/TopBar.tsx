'use strict';
'use client';

import React, { useState } from 'react';
import { 
  PanelLeft, 
  Download, 
  Plus, 
  Globe, 
  BookOpen, 
  Search, 
  Check, 
  FileText,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { BibleStudy } from '@/types/bible-study';

interface TopBarProps {
  study: BibleStudy;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onUpdateStudy: (updates: Partial<BibleStudy>) => void;
  onNewStudy: (template?: 'blank' | 'soap' | 'inductive') => void;
  onExportPdf: () => void;
  onSearchScripture: (query: string) => void;
  isSaving: boolean;
}

export default function TopBar({
  study,
  isSidebarOpen,
  onToggleSidebar,
  onUpdateStudy,
  onNewStudy,
  onExportPdf,
  onSearchScripture,
  isSaving,
}: TopBarProps) {
  const [urlInput, setUrlInput] = useState(
    study.bibleMode === 'iframe' ? study.bibleUrl : `${study.currentBook} ${study.currentChapter}`
  );
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  // Sync urlInput when study changes
  React.useEffect(() => {
    if (study.bibleMode === 'iframe') {
      setUrlInput(study.bibleUrl);
    } else {
      setUrlInput(`${study.currentBook} ${study.currentChapter}`);
    }
  }, [study.bibleMode, study.bibleUrl, study.currentBook, study.currentChapter]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = urlInput.trim();
    if (!query) return;

    if (query.startsWith('http://') || query.startsWith('https://')) {
      onUpdateStudy({
        bibleMode: 'iframe',
        bibleUrl: query,
      });
    } else {
      onUpdateStudy({
        bibleMode: 'builtin',
      });
      onSearchScripture(query);
    }
  };

  return (
    <header className="w-full bg-[#ffffff] border-b border-[#0a0a0a1a] px-4 py-2.5 flex items-center justify-between gap-3 z-30 select-none">
      {/* Left controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="btn-icon-pill"
          title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-4 h-4 text-[#0a0a0a]" />
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-1">
          <span className="text-xs font-bold tracking-wider text-[#111111] uppercase px-2 py-0.5 bg-[#f5f5f5] rounded-full border border-[#0a0a0a14]">
            STUDY
          </span>
          <span className="text-sm font-semibold text-[#0a0a0a] max-w-[140px] md:max-w-[200px] truncate" title={study.title}>
            {study.title || 'Untitled Study'}
          </span>
        </div>
      </div>

      {/* Center URL / Search Bar - as in wireframe */}
      <form
        onSubmit={handleUrlSubmit}
        className="flex-1 max-w-2xl mx-auto flex items-center bg-[#f5f5f5] border border-[#0a0a0a1a] rounded-[9999px] px-3.5 py-1.5 focus-within:border-[#0a0a0a] focus-within:bg-[#ffffff] transition-all shadow-xs"
      >
        <div className="flex items-center gap-1.5 text-[#6b6b6b] mr-2">
          {study.bibleMode === 'iframe' ? (
            <Globe className="w-4 h-4 text-[#0a0a0a]" />
          ) : (
            <BookOpen className="w-4 h-4 text-[#0a0a0a]" />
          )}
        </div>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter Bible URL or passage reference (e.g. John 3:16, Romans 8)"
          className="w-full bg-transparent text-sm text-[#0a0a0a] placeholder-[#a1a1a1] outline-hidden"
        />
        
        {/* Toggle Mode Button */}
        <button
          type="button"
          onClick={() => {
            const nextMode = study.bibleMode === 'builtin' ? 'iframe' : 'builtin';
            onUpdateStudy({ bibleMode: nextMode });
          }}
          className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#ffffff] border border-[#0a0a0a14] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a33] transition-colors ml-2 shrink-0 cursor-pointer"
          title="Switch between Built-in Bible reader and External Web App Iframe"
        >
          {study.bibleMode === 'builtin' ? 'Reader' : 'Iframe'}
        </button>

        <button
          type="submit"
          className="ml-1 text-[#6b6b6b] hover:text-[#0a0a0a] p-1 cursor-pointer transition-colors"
          title="Search / Load"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Right Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Auto-save indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#6b6b6b] px-2 py-1">
          {isSaving ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-[#16a34a]" />
              <span>Saved</span>
            </>
          )}
        </div>

        {/* Template Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
            className="btn-pill hidden md:inline-flex text-xs py-1.5 px-3"
            title="Create study with template"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6b6b6b]" />
            <span>Templates</span>
            <ChevronDown className="w-3 h-3 text-[#a1a1a1]" />
          </button>

          {showTemplateDropdown && (
            <div 
              className="absolute right-0 mt-1.5 w-56 bg-[#ffffff] border border-[#0a0a0a1a] rounded-[16px] shadow-lg py-1.5 z-50 text-xs"
              onClick={() => setShowTemplateDropdown(false)}
            >
              <button
                onClick={() => onNewStudy('blank')}
                className="w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] text-[#0a0a0a] font-medium flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-[#6b6b6b]" />
                Blank Study
              </button>
              <button
                onClick={() => onNewStudy('soap')}
                className="w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] text-[#0a0a0a] font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                SOAP Method (Scripture, Observation, Application, Prayer)
              </button>
              <button
                onClick={() => onNewStudy('inductive')}
                className="w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] text-[#0a0a0a] font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Inductive Method (Observe, Interpret, Apply)
              </button>
            </div>
          )}
        </div>

        {/* New Study Pill */}
        <button
          onClick={() => onNewStudy('blank')}
          className="btn-pill text-xs py-1.5 px-3"
          title="Create a new Bible study"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>

        {/* Export PDF Pill */}
        <button
          onClick={onExportPdf}
          className="btn-pill btn-pill-primary text-xs py-1.5 px-3.5"
          title="Export notes as a styled PDF"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
}
