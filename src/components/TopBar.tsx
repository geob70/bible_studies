"use strict";
"use client";

import React, { useState } from "react";
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
  ChevronDown,
} from "lucide-react";
import { BibleStudy, StudyTemplateType } from "@/types/bible-study";

interface TopBarProps {
  study: BibleStudy;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onUpdateStudy: (updates: Partial<BibleStudy>) => void;
  onNewStudy: (template?: StudyTemplateType) => void;
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
    study.bibleMode === "iframe"
      ? study.bibleUrl
      : `${study.currentBook} ${study.currentChapter}`,
  );
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [isReaderModeOpen, setIsReaderModeOpen] = useState(false);

  const readerModeRef = React.useRef<HTMLDivElement>(null);
  const templateDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        readerModeRef.current &&
        !readerModeRef.current.contains(e.target as Node)
      ) {
        setIsReaderModeOpen(false);
      }
      if (
        templateDropdownRef.current &&
        !templateDropdownRef.current.contains(e.target as Node)
      ) {
        setShowTemplateDropdown(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsReaderModeOpen(false);
        setShowTemplateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Sync urlInput when study changes
  React.useEffect(() => {
    if (study.bibleMode === "iframe") {
      setUrlInput(study.bibleUrl);
    } else {
      setUrlInput(`${study.currentBook} ${study.currentChapter}`);
    }
  }, [
    study.bibleMode,
    study.bibleUrl,
    study.currentBook,
    study.currentChapter,
  ]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = urlInput.trim();
    if (!query) return;

    if (query.startsWith("http://") || query.startsWith("https://")) {
      onUpdateStudy({
        bibleMode: "iframe",
        bibleUrl: query,
      });
    } else {
      onUpdateStudy({
        bibleMode: "builtin",
      });
      onSearchScripture(query);
    }
  };

  return (
    <header className="topbar w-full bg-[#ffffff] border-b border-[#2525251a] px-4 py-2.5 flex items-center justify-between gap-3 z-30 select-none">
      {/* Left controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="btn-icon-pill"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-4 h-4 text-[#252525]" />
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-1">
          <span className="text-xs font-bold tracking-wider text-[#171717] uppercase px-2 py-0.5 bg-[#f5f5f5] rounded-full border border-[#25252514]">
            His Presence
          </span>
          <span
            className="text-sm font-semibold text-[#252525] max-w-[140px] md:max-w-[200px] truncate"
            title={study.title}
          >
            {study.title || "Your study space"}
          </span>
        </div>
      </div>

      {/* Center: Reader Mode Dropdown + URL / Passage Search Bar */}
      <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2">
        {/* Reader Mode Dropdown (web reader / custom reader) */}
        <div className="relative shrink-0" ref={readerModeRef}>
          <button
            type="button"
            onClick={() => setIsReaderModeOpen((prev) => !prev)}
            className="h-[34px] px-3 rounded-[10px] md:rounded-full bg-[#ffffff] border border-[#2525251a] hover:border-[#25252533] hover:bg-[#f9f9f9] text-xs font-medium text-[#252525] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer select-none"
            aria-haspopup="true"
            aria-expanded={isReaderModeOpen}
            title="Switch reader mode"
          >
            <span>
              {study.bibleMode === "iframe" ? "web reader" : "custom reader"}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#6b6b6b] transition-transform duration-150 ${
                isReaderModeOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isReaderModeOpen && (
            <div className="absolute left-0 mt-1.5 w-40 bg-[#ffffff] border border-[#2525251a] rounded-[14px] shadow-lg py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  onUpdateStudy({
                    bibleMode: "iframe",
                    bibleUrl: study.bibleUrl || "https://www.bible.com/bible",
                  });
                  setIsReaderModeOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] transition-colors flex items-center justify-between cursor-pointer ${
                  study.bibleMode === "iframe"
                    ? "font-semibold text-[#171717]"
                    : "text-[#6b6b6b]"
                }`}
              >
                <span>web reader</span>
                {study.bibleMode === "iframe" && (
                  <Check className="w-3.5 h-3.5 text-[#171717]" />
                )}
              </button>

              <div className="my-1 border-t border-[#25252514]" />

              <button
                type="button"
                onClick={() => {
                  onUpdateStudy({ bibleMode: "builtin" });
                  setIsReaderModeOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] transition-colors flex items-center justify-between cursor-pointer ${
                  study.bibleMode === "builtin"
                    ? "font-semibold text-[#171717]"
                    : "text-[#6b6b6b]"
                }`}
              >
                <span>custom reader</span>
                {study.bibleMode === "builtin" && (
                  <Check className="w-3.5 h-3.5 text-[#171717]" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Search Input Bar */}
        <form
          onSubmit={handleUrlSubmit}
          className="passage-search flex-1 flex items-center bg-[#f5f5f5] border border-[#2525251a] rounded-[9999px] px-3.5 py-1.5 focus-within:border-[#252525] focus-within:bg-[#ffffff] transition-all shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-[#6b6b6b] mr-2">
            {study.bibleMode === "iframe" ? (
              <Globe className="w-4 h-4 text-[#252525]" />
            ) : (
              <BookOpen className="w-4 h-4 text-[#252525]" />
            )}
          </div>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={
              study.bibleMode === "iframe"
                ? "http/........."
                : "Search passage (e.g. John 3:16, Romans 8)"
            }
            className="w-full bg-transparent text-sm text-[#252525] placeholder-[#a1a1a1] outline-hidden"
          />

          <button
            type="submit"
            className="ml-1 text-[#6b6b6b] hover:text-[#252525] p-1 cursor-pointer transition-colors"
            title="Search / Load"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Auto-save indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#6b6b6b] px-2 py-1">
          {isSaving ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-pulse" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-[#7f7f7f]" />
              <span>Saved</span>
            </>
          )}
        </div>

        {/* Template Selector Dropdown */}
        <div className="relative" ref={templateDropdownRef}>
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
              className="absolute right-0 mt-1.5 w-64 bg-[#ffffff] border border-[#2525251a] rounded-[16px] shadow-lg py-1.5 z-50 text-xs"
              onClick={() => setShowTemplateDropdown(false)}
            >
              <button
                onClick={() => onNewStudy("blank")}
                className="w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] text-[#252525] font-medium flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-[#6b6b6b]" />
                Blank Study
              </button>
              <button
                onClick={() => onNewStudy("contrast")}
                className="w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] text-[#252525] font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                Kingdom Contrast (Truth vs. Counterfeit)
              </button>
              <button
                onClick={() => onNewStudy("character")}
                className="w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] text-[#252525] font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                Character Deep-Dive (Walk in Their Shoes)
              </button>
              <button
                onClick={() => onNewStudy("soap")}
                className="w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] text-[#252525] font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                SOAP Method (Scripture, Observe, Apply, Pray)
              </button>
              <button
                onClick={() => onNewStudy("inductive")}
                className="w-full text-left px-3.5 py-2 hover:bg-[#f5f5f5] text-[#252525] font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                Inductive Method (Observe, Interpret, Apply)
              </button>
            </div>
          )}
        </div>

        {/* New Study Pill */}
        <button
          onClick={() => onNewStudy("blank")}
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
